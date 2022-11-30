import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import got from 'got'
import ora from 'ora'

import { getCliVersion } from '@/utils/versionCheck'
import { colors } from '@/utils/colors'
import { notice } from '@/utils/notice'

const loading = ora()

async function getLatestVersion(module: string) {
  const api = `https://registry.npmmirror.com/${module}`
  const accept = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'

  const data = (await got(api, { headers: { accept } }).json()) as any
  const vs = Object.keys(data?.versions)

  return vs.length ? vs[vs.length - 1] : ''
}

export async function update() {
  loading.start(`checking update for kiviBot CLI...`)
  const lv = await getLatestVersion('kivibot')

  const promiseExec = promisify(exec)

  if (lv !== getCliVersion()) {
    await promiseExec('npx ncu -u -g kivibot')

    loading.stop()

    const updateCmd = 'npm up -g kivibot --registry=https://registry.npmmirror.com'

    notice.warn(colors.gray(`KiviBot ${lv} has published, update it via:`))
    console.log(colors.cyan(updateCmd))
  }

  loading.start(`updating dependencies...`)

  await promiseExec('npx ncu -u @kivibot/core kivibot-plugin-*')

  const cmd = `npm up --registry=https://registry.npmmirror.com`
  const { stderr, stdout } = await promiseExec(cmd)

  if (stderr) {
    if (/npm ERR/i.test(String(stderr))) {
      loading.fail(`error occurred：`)
      console.log(stderr)
      loading.succeed(`update faild`)
      return false
    }
  }

  if (/up to date/.test(stdout)) {
    loading.succeed(`everything is up to date`)
  } else {
    loading.succeed(`update successfully`)
  }

  return true
}

update.help = `
      update\tupdate dependencies (and plugins)`

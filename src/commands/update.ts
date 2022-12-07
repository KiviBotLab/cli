import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import axios from 'axios'
import ncu from 'npm-check-updates'
import ora from 'ora'
import path from 'node:path'

import { colors } from '@/utils/colors'
import { CWD } from '@/path'
import { getCliVersion } from '@/utils/versionCheck'
import { notice } from '@/utils/notice'

const loading = ora()

async function getLatestVersion(module: string) {
  const api = `https://registry.npmmirror.com/${module}`
  const accept = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'

  const { data } = await axios.get(api, { headers: { accept } })
  const vs = Object.keys(data?.versions)

  return vs.length ? vs[vs.length - 1] : ''
}

export async function update() {
  loading.start(`checking update for kiviBot CLI...`)
  const lv = await getLatestVersion('kivibot')

  const promiseExec = promisify(exec)

  if (lv !== getCliVersion()) {
    loading.stop()

    const updateCmd = 'npm up -g kivibot --registry=https://registry.npmmirror.com'

    notice.warn(colors.gray(`KiviBot ${lv} has published, update it via:`))
    console.log(colors.cyan(updateCmd))
  }

  loading.start(`updating dependencies...`)

  try {
    const upInfo = await ncu({
      packageFile: path.join(CWD, 'package.json'),
      filter: ['@kivibot/*', 'kivibot', 'kivibot-*'],
      upgrade: true,
      jsonUpgraded: true,
      registry: 'https://registry.npmmirror.com'
    })

    const npmUpCmd = `npm up --registry=https://registry.npmmirror.com`

    const { stderr } = await promiseExec(npmUpCmd)

    if (stderr) {
      if (/npm ERR/i.test(String(stderr))) {
        loading.fail(`error occurred：`)
        console.log(stderr)
        loading.succeed(`update faild`)

        return false
      }
    }

    if (upInfo) {
      const info = Object.entries(upInfo)
        .map((k, v) => `${k} => ${v}`)
        .join('\n')

      loading.succeed(info || 'everything is up to date')
    }
  } catch (e) {
    loading.fail(`error occurred：`)
    console.log(e)
    loading.succeed(`update faild`)
  }
}

update.help = `
      update\tupdate KiviBot and plugins`

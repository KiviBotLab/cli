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
  loading.start(`正在检查更新 kiviBot CLI...`)
  const lv = await getLatestVersion('kivibot')

  if (lv !== getCliVersion()) {
    loading.stop()

    const updateCmd = 'npm up -g kivibot --registry=https://registry.npmmirror.com'

    notice.warn(colors.gray(`KiviBot ${lv} 已发布，请使用以下命令进行更新:`))
    console.log(colors.cyan(updateCmd))
  }

  loading.start(`正在更新...`)

  const promiseExec = promisify(exec)
  const cmd = `npm up --registry=https://inpm.deno.dev`
  const { stderr, stdout } = await promiseExec(cmd)

  if (stderr) {
    if (/npm ERR/i.test(String(stderr))) {
      loading.fail(`更新过程出现问题，npm 输出如下：`)
      console.log(stderr)
      loading.succeed(`更新失败`)
      return false
    }
  }

  if (/up\sto\sdate/.test(stdout)) {
    loading.succeed(`当前使用的框架插件和依赖均为最新版本`)
  } else {
    loading.succeed(`更新完成`)
  }

  return true
}

update.help = `
      update\t更新框架和依赖`

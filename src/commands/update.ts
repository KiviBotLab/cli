import axios from 'axios'
import ncu from 'npm-check-updates'
import ora from 'ora'
import path from 'node:path'

import { colors } from '@/utils/colors'
import { CWD } from '@/path'
import { getCliVersion } from '@/utils/versionCheck'
import { notice } from '@/utils/notice'
import { promiseExec } from '@/utils/promiseExec'

const loading = ora()

async function getLatestVersion(module: string) {
  const api = `https://registry.npmmirror.com/${module}`
  const accept = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'

  const { data } = await axios.get(api, { headers: { accept } })
  const vs = Object.keys(data?.versions)

  return vs.length ? vs[vs.length - 1] : ''
}

export async function update() {
  loading.start(`正在检查 KiviBot CLI 更新...`)
  const lv = await getLatestVersion('kivibot')

  if (lv !== getCliVersion()) {
    loading.stop()

    const updateCmd = 'npm up -g kivibot --registry=https://registry.npmmirror.com'

    notice.warn(colors.gray(`KiviBot CLI ${lv} 已发布，你可以通过以下命令进行更新:`))
    console.log(colors.cyan(updateCmd))
  }

  loading.start(`正在安装依赖...`)

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
        loading.fail(`发生错误：`)
        console.log(stderr)
        loading.fail(`更新失败，参考上面的错误日志`)

        return false
      }
    }

    if (upInfo) {
      const info = Object.entries(upInfo)
        .map((k, v) => `${k} => ${v}`)
        .join('\n')

      loading.succeed(info || '已是最新')
    }
  } catch (e) {
    loading.fail(`发生错误：`)
    console.log(e)
    loading.fail(`更新失败，参考上面的错误日志`)
  }
}

update.help = `
      update\t更新 KiviBot 框架和插件依赖`

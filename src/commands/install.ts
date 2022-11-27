import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import ora from 'ora'

import { colors } from '@/utils/colors'
import { ensureArray } from '@/utils/ensureArray'
import { notice } from '@/utils/notice'

import type { ParsedArgs } from 'minimist'

const loading = ora()

export const kiviDeps = ['@kivibot/core', 'axios', 'node-cron']

export async function installDependencies(_deps: string | string[] = []) {
  const promiseExec = promisify(exec)
  const modules = ensureArray(_deps)

  const cmd = `npm i ${modules.join(' ')} --registry=https://inpm.deno.dev`
  const mds = modules.map((mod) => colors.cyan(mod)).join(', ')
  const mdsStr = mds ? ` ${mds} ` : ''

  loading.start(`正在安装${mdsStr.trimEnd()}`)

  const { stderr } = await promiseExec(cmd)

  if (stderr) {
    if (/npm ERR/i.test(String(stderr))) {
      loading.stop()
      notice.warn(`${mdsStr.trimStart()}安装过程出现问题，npm 输出如下：`)
      console.log(stderr)
      notice.error(`${mdsStr.trimStart()}安装失败`)
      return false
    }
  }

  loading.succeed(`${mdsStr.trimStart()}安装完成`)

  return true
}

export async function install(args: ParsedArgs) {
  const modules = args._.length ? args._ : kiviDeps
  await installDependencies(modules)
}

install.help = `
      install\t安装框架核心依赖，可传入参数安装其他依赖`

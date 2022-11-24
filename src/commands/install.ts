import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import ora from 'ora'

import { colors } from '@/utils/colors'
import { ensureArray } from '@/utils/ensureArray'

import type { ParsedArgs } from 'minimist'

const loading = ora()

export const kiviDeps = ['@kivibot/core', 'axios']

export async function installDependencies(_deps: string | string[] = []) {
  const promiseExec = promisify(exec)
  const modules = ensureArray(_deps)

  const cmd = `npm i ${modules.join(' ')} --registry=https://registry.npmmirror.com`
  const mds = modules.map((mod) => colors.cyan(mod)).join(', ')

  loading.start(`正在安装 node 依赖${mds ? `: ${mds}` : ''}`)

  const { stderr } = await promiseExec(cmd)

  if (stderr) {
    loading.fail(`${`${mds} `}安装过程出现问题，npm 输出如下：`)
    console.log(stderr)
    return false
  } else {
    loading.succeed(`node 依赖${` ${mds} `}安装完成`)
    return true
  }
}

export async function install(args: ParsedArgs) {
  const modules = [...args._, ...(args.only ? [] : kiviDeps)]
  await installDependencies(modules)
}

install.help = `
      install\t安装框架核心依赖，可传入参数安装其他依赖`
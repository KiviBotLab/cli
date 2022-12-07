import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import ora from 'ora'

import { colors } from '@/utils/colors'
import { ensureArray } from '@/utils/ensureArray'
import { notice } from '@/utils/notice'

import type { ParsedArgs } from 'minimist'

const loading = ora()

export const kiviDeps = ['@kivibot/core']

export async function installDependencies(_deps: string | string[] = []) {
  const promiseExec = promisify(exec)
  const modules = ensureArray(_deps)

  const mds = colors.cyan(modules.map((mod) => mod).join(', '))
  const mdsStr = mds ? ` ${mds} ` : ''

  loading.start(`installing${mdsStr}`)

  const cmd = `npm i ${modules.join(' ')} --registry=https://registry.npmmirror.com/`

  const { stderr } = await promiseExec(cmd)

  if (stderr) {
    if (/npm ERR/i.test(String(stderr))) {
      loading.stop()
      notice.warn(`faild to install${mdsStr}, npm output: `)
      console.log(stderr)
      notice.error(`faild to install${mdsStr}`)
      return false
    }
  }

  loading.succeed(`successfully install${mdsStr}`)

  return true
}

export async function install(args: ParsedArgs) {
  const modules = args._.length ? args._ : kiviDeps
  await installDependencies(modules)
}

install.help = `
      install\tinstall dependencies`

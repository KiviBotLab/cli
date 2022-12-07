import fs from 'fs-extra'
import prompts from 'prompts'
import path from 'node:path'

import { checkModule } from '@/utils/checkModule'
import { installDependencies } from './install'
import { js_template } from '@/templates/javascript'
import { notice } from '@/utils/notice'
import { PluginDir } from '@/path'
import { ts_config, ts_template } from '@/templates/typescript'

import type { ParsedArgs } from 'minimist'

export const create = async (args: ParsedArgs) => {
  const pluginName = args._[0]

  // 当前 node_modules 目录下是否已存在 TS 依赖
  const isTypescriptExist = checkModule('typescript')

  const { lang, inputPluginName, needInstallTypescript } = await prompts([
    {
      type: pluginName ? null : 'text',
      name: 'inputPluginName',
      message: 'plugin name',
      initial: 'demo'
    },
    {
      type: 'select',
      name: 'lang',
      message: 'develop language',
      choices: [
        { title: 'JavaScript', value: 'JS' },
        { title: 'TypeScript', value: 'TS' }
      ],
      initial: 0
    },
    {
      type: (pre) => (pre === 'TS' && !isTypescriptExist ? 'confirm' : null),
      name: 'needInstallTypescript',
      message: 'need to install TypeScript for you?',
      initial: true
    }
  ])

  const pname = pluginName ?? inputPluginName
  const pluginDirPath = path.join(PluginDir, pname)

  if (fs.existsSync(pluginDirPath)) {
    const { cover } = await prompts([
      {
        type: 'confirm',
        name: 'cover',
        message: `${pname} already exists, cover it？`,
        initial: false
      }
    ])

    if (cover) {
      fs.removeSync(pluginDirPath)

      notice.info(`delete: ${pluginDirPath}`)
    } else {
      notice.success('cancelled')
      process.exit(0)
    }
  }

  // 确保插件目录存在
  fs.ensureDirSync(pluginDirPath)

  if (lang === 'TS') {
    try {
      fs.writeFileSync(path.join(pluginDirPath, 'index.ts'), ts_template)
      fs.writeFileSync(path.join(pluginDirPath, 'tsconfig.json'), ts_config)
    } catch {
      notice.error('faild to wirte files')
      process.exit(1)
    }

    if (needInstallTypescript) {
      await installDependencies('typescript')
    }
  } else if (lang === 'JS') {
    try {
      fs.writeFileSync(path.join(pluginDirPath, 'index.js'), js_template)
    } catch {
      notice.error('faild to wirte files')
      process.exit(1)
    }
  }

  notice.success(`create: ${pluginDirPath}`)
}

create.help = `
      create\tcreate plugin template (JS/TS)`

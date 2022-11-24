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
      message: '请输入插件名称',
      initial: 'demo'
    },
    {
      type: 'select',
      name: 'lang',
      message: '请选择开发语言（按 ↑/↓）',
      choices: [
        { title: 'JavaScript', description: '使用 JavaScript 进行开发', value: 'JS' },
        { title: 'TypeScript', description: '使用 TypeScript 进行开发', value: 'TS' }
      ],
      initial: 0
    },
    {
      type: (pre) => (pre === 'TS' && !isTypescriptExist ? 'confirm' : null),
      name: 'needInstallTypescript',
      message: '是否需要安装 TypeScript',
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
        message: `插件 ${pname} 已存在，是否覆盖创建？（原有目录会被删除）`,
        initial: false
      }
    ])

    if (cover) {
      fs.removeSync(pluginDirPath)

      notice.info(`已删除: ${pluginDirPath}`)
    } else {
      notice.success('已取消')
      process.exit(0)
    }
  }

  // 确保插件目录存在
  fs.mkdirSync(pluginDirPath)

  if (lang === 'TS') {
    try {
      fs.writeFileSync(path.join(pluginDirPath, 'index.ts'), ts_template)
      fs.writeFileSync(path.join(pluginDirPath, 'tsconfig.json'), ts_config)
    } catch {
      notice.error('写出模板文件出错')
      process.exit(1)
    }

    if (needInstallTypescript) {
      await installDependencies('typescript')
    }
  } else if (lang === 'JS') {
    try {
      fs.writeFileSync(path.join(pluginDirPath, 'index.js'), js_template)
    } catch {
      notice.error('写出模板文件出错')
      process.exit(1)
    }
  }

  notice.success(`成功创建 ${lang} 模板: ${pluginDirPath}`)
}

create.help = `
      create\t新建插件模板`

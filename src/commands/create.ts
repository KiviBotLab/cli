import { colors } from '@/utils/colors'
import prompts from 'prompts'
import type { ParsedArgs } from 'minimist'

export const create = async (args: ParsedArgs) => {
  const lang = String(args.c).toUpperCase()

  if (['JS', 'TS'].includes(lang)) {
    console.log(colors.green(`已选择 ${lang} 作为开发语言。`))
  } else {
    const config = await prompts({
      type: 'select',
      name: 'lang',
      message: '开发语言',
      choices: [
        { title: 'JavaScript', description: '使用 JavaScript 进行开发', value: 'JS' },
        { title: 'TypeScript', description: '使用 TypeScript 进行开发', value: 'TS' }
      ],
      initial: 1
    })

    console.log(config)
  }
}

create.help = `
      create\t新建插件模板（-t 指定语言，JS 或 TS）`

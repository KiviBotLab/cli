import minimist from 'minimist'
import path from 'node:path'

import { colors } from './utils/colors'
import * as cmds from './commands'
import { versionCheck } from './utils/versionCheck'

type Cmd = keyof typeof cmds

const pkg = require(path.join(__dirname, '../package.json'))
const args = minimist(process.argv.slice(2))
const inputCmd: string | undefined = args._[0]

const Head = `KiviBot CLI v${pkg.version ?? '未知'}\n\n`
const HelpHead = `用法：kivi <命令> [选项]\n\n命令：`

export const exitHandler = () => {
  process.stdout.write(colors.yellow('已退出 KiviBot CLI'))
  process.exit(0)
}

const cli = async () => {
  versionCheck()

  /** 捕获 Ctrl C 中断退出 */
  process.on('SIGINT', exitHandler)

  if (!inputCmd || !Object.keys(cmds).includes(inputCmd)) {
    const helps = Object.values(cmds).map((e) => e.help)

    console.log(Head + HelpHead + helps.join(''))
  } else {
    try {
      args._.shift()

      const res = cmds[inputCmd as Cmd](args)

      if (res instanceof Promise) await res
    } catch (e) {
      console.log(e)
      console.log(colors.red('Error Occured !'))
    }
  }
}

cli()

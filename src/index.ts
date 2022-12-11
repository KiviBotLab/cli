import minimist from 'minimist'
import path from 'node:path'

import { colors } from './utils/colors'
import * as cmds from './commands'
import { versionCheck } from './utils/versionCheck'
import { notice } from './utils/notice'

type Cmd = keyof typeof cmds

const pkg = require(path.join(__dirname, '../package.json'))
const args = minimist(process.argv.slice(2))
const inputCmd: string | undefined = args._[0]

const Head = `KiviBot CLI v${pkg.version ?? 'unknown'}\n\n`
const HelpHead = `Usage：kivi <cmd> [option]\n\nCommands：`

export const exitHandler = () => {
  process.stdout.write(colors.yellow('\nexit KiviBot CLI'))
  process.exit(0)
}

const cli = async () => {
  /** 捕获 Ctrl C 中断退出 */
  process.on('SIGINT', exitHandler)

  if (args.v || args.version) {
    return console.log(Head)
  }

  if (!inputCmd || !Object.keys(cmds).includes(inputCmd)) {
    const helps = Object.values(cmds).map((e) => e.help)

    console.log(Head + HelpHead + helps.join(''))
  } else {
    try {
      args._.shift()

      if (args.debug) {
        versionCheck()
      }

      const res = cmds[inputCmd as Cmd](args)

      if (res instanceof Promise) await res
    } catch (e) {
      console.log(e)
      notice.error('error occured! check the logs above.')
    }
  }
}

cli()

import minimist from 'minimist'
import path from 'node:path'

import * as cmds from './commands'
import { colors } from './utils/colors'

type Cmd = keyof typeof cmds

const pkg = require(path.join(__dirname, '../package.json'))
const args = minimist(process.argv.slice(2))
const inputCmd: string | undefined = args._[0]

const Head = `KiviBot CLI v${pkg.version ?? '未知'}\n\n`
const HelpHead = `用法：kivi <命令> [选项]\n\n命令：`

const cli = async () => {
  if (!inputCmd || !Object.keys(cmds).includes(inputCmd)) {
    const helps = Object.values(cmds).map((e) => e.help)

    console.log(Head + HelpHead + helps.join(''))
  } else {
    try {
      cmds[inputCmd as Cmd](args)
    } catch {
      console.log(colors.red('Error Occured !'))
    }
  }
}

cli()

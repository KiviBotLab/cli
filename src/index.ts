import minimist from 'minimist'
import path from 'node:path'

import { colors } from './utils/colors'
import * as cmds from './commands'
import { versionCheck } from './utils/versionCheck'
import { notice } from './utils/notice'

type Cmd = keyof typeof cmds

const pkg = require(path.join(__dirname, '../package.json'))
const args = minimist(process.argv.slice(2))
const firstCmd: string | undefined = args._[0]
const inputCmd = firstCmd === 'delete' ? 'del' : firstCmd

const Head = `KiviBot CLI v${pkg.version}\n\n`
const HelpHead = `用法：kivi <命令> [选项]\n\n命令列表：`

export const exitHandler = () => {
  process.stdout.write(colors.yellow('\n已退出 KiviBot CLI'))
  process.exit(0)
}

const cli = async () => {
  /** 捕获 Ctrl C 中断退出 */
  process.on('SIGINT', exitHandler)

  if (args.v || args.version) {
    return console.log(pkg.version)
  }

  if (!inputCmd || !Object.keys(cmds).includes(inputCmd)) {
    const helps = Object.values(cmds).map((e) => e.help)

    console.log('\n' + Head + HelpHead + helps.join('') + '\n')
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
      notice.error('CLI 执行遇到错误，参考上面输出的日志')
    }
  }
}

cli()

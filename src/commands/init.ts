import fs, { writeFileSync } from 'fs-extra'
import prompts from 'prompts'

import { AppPath, ConfPath, PkgPath } from '@/path'
import { base64encode } from '@/utils/base64'
import { colors } from '@/utils/colors'
import { exitHandler } from '..'
import { kiviDeps, installDependencies } from './install'
import { notice } from '@/utils/notice'
import { pkg_template } from '@/templates/package-json'
import { start } from './start'

import type { PromptObject } from 'prompts'
import type { ParsedArgs } from 'minimist'

const DefaultNoticeConfig = {
  enable: true,
  friend: {
    request: {
      enable: true,
      action: 'ignore'
    },
    increase: true,
    decrease: true,
    message: false
  },
  group: {
    request: {
      enable: true,
      action: 'ignore'
    },
    increase: true,
    decrease: true,
    ban: true,
    admin: true,
    transfer: true
  }
}

const questions: PromptObject[] = [
  {
    name: 'account',
    type: 'text',
    message: 'Bot account',
    validate: (input) => {
      return /^[1-9]\d{4,9}$/.test(input.trim()) ? true : 'bad account'
    },
    format: (e) => Number(e.trim())
  },
  {
    name: 'platform',
    type: 'select',
    message: 'platform',
    initial: 0,
    choices: [
      {
        title: 'iPad',
        value: 5
      },
      {
        title: 'aPhone',
        value: 1
      },
      {
        title: 'APad',
        value: 2
      },
      {
        title: 'MacOS',
        value: 4
      },
      {
        title: 'aWatch',
        value: 3
      }
    ]
  },
  {
    name: 'admins',
    type: 'list',
    message: 'Bot admins',
    separator: ' ',
    format: (list: string[]) => [...new Set(list.filter((e) => !!e).map(Number))],
    validate: (list: string) => {
      return /^[1-9]\d{4,9}(\s+[1-9]\d{4,9})*$/.test(list.trim()) ? true : 'bad admin account'
    }
  },
  {
    name: 'login_mode',
    type: 'select',
    message: 'login mode',
    initial: 0,
    choices: [
      {
        title: 'password',
        value: 'password'
      },
      {
        title: 'qrcode',
        value: 'qrcode'
      }
    ]
  },
  {
    name: 'password',
    type: (login_mode) => {
      return login_mode === 'password' ? 'text' : null
    },
    message: 'Bot password',
    style: 'password',
    validate: (password) => {
      return /^.{6,16}$/.test(password.trim()) ? true : 'bad password'
    },
    format: (password) => password.trim()
  },
  {
    name: 'device_mode',
    type: (prev) => {
      return prev === 'qrcode' ? null : 'select'
    },
    initial: 0,
    message: 'device mode',
    choices: [
      {
        title: 'SMS',
        value: 'sms'
      },
      {
        title: 'qrcode',
        value: 'qrcode'
      }
    ]
  }
]

export async function init(args: ParsedArgs) {
  const isForce = args.force
  const log_level = args.log_level
  const needInstall = args.install
  const needStart = args.start

  if (!isForce && fs.existsSync(ConfPath)) {
    notice.warn('`kivi.json` already exists, use `--force` flag to cover')
    process.exit(0)
  }

  const answer = await prompts(questions)

  answer.password ??= ''
  answer.device_mode ??= 'sms'

  if (!answer.login_mode || (answer.login_mode === 'password' && !answer.password)) {
    notice.warn('exit KiviBot CLI')
    process.exit(0)
  }

  const isOK = writeKiviConf({
    account: answer.account,
    login_mode: answer.login_mode,
    device_mode: answer.device_mode,
    message_mode: 'short',
    password: base64encode(answer.password),
    log_level: typeof log_level === 'string' ? log_level : 'info',
    admins: answer.admins,
    plugins: [],
    notice: DefaultNoticeConfig,
    oicq_config: {
      platform: answer.platform
    }
  })

  writeFileSync(AppPath, "require('@kivibot/core').start()")
  writeFileSync(PkgPath, pkg_template)

  const files = ['kivi.json', 'app.js', 'package.json']

  if (isOK) {
    notice.success(`create files ${colors.cyan(files.join(', '))}`)

    if (needInstall || needStart) {
      await installDependencies(kiviDeps)
    }

    if (needStart) {
      process.off('SIGINT', exitHandler)
      await start()
    }
  } else {
    notice.error('faild to write config')
    process.exit(1)
  }
}

init.help = `
      init\tinit KiviBot, guide to generate config file`

function writeKiviConf(conf: Record<string, any>) {
  try {
    fs.writeJsonSync(ConfPath, conf, { spaces: 2 })
    return true
  } catch {
    return false
  }
}

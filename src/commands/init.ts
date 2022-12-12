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
    message: 'Bot QQ 账号',
    validate: (input) => {
      return /^[1-9]\d{4,9}$/.test(input.trim()) ? true : '无效的 QQ 账号'
    },
    format: (e) => Number(e.trim())
  },
  {
    name: 'platform',
    type: 'select',
    message: '登录协议',
    initial: 0,
    choices: [
      {
        title: 'iPad（苹果平板，推荐，可多设备同时在线）',
        value: 5
      },
      {
        title: 'aPhone（安卓手机）',
        value: 1
      },
      {
        title: 'APad（安卓平板）',
        value: 2
      },
      {
        title: 'MacOS（苹果电脑）',
        value: 4
      },
      {
        title: 'aWatch（安卓手表）',
        value: 3
      }
    ]
  },
  {
    name: 'admins',
    type: 'list',
    message: 'Bot 管理员',
    separator: ' ',
    format: (list: string[]) => [...new Set(list.filter((e) => !!e).map(Number))],
    validate: (list: string) => {
      return /^[1-9]\d{4,9}(\s+[1-9]\d{4,9})*$/.test(list.trim()) ? true : '无效的管理员 QQ 账号'
    }
  },
  {
    name: 'login_mode',
    type: 'select',
    message: '登录模式',
    initial: 0,
    choices: [
      {
        title: '密码登录（推荐服务器使用）',
        value: 'password'
      },
      {
        title: '扫码登录（存在 IP 限制，推荐本地使用）',
        value: 'qrcode'
      }
    ]
  },
  {
    name: 'password',
    type: (login_mode) => {
      return login_mode === 'password' ? 'text' : null
    },
    message: 'Bot 账号密码',
    style: 'password',
    validate: (password) => {
      return /^.{6,16}$/.test(password.trim()) ? true : '无效的密码'
    },
    format: (password) => password.trim()
  },
  {
    name: 'device_mode',
    type: (prev) => {
      return prev === 'qrcode' ? null : 'select'
    },
    initial: 0,
    message: '设备锁验证模式',
    choices: [
      {
        title: '短信验证码',
        value: 'sms'
      },
      {
        title: '二维码',
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
    notice.warn('配置文件 `kivi.json` 已存在，加上 `--force` 进行覆盖')
    process.exit(0)
  }

  const answer = await prompts(questions)

  answer.password ??= ''
  answer.device_mode ??= 'sms'

  if (!answer.login_mode || (answer.login_mode === 'password' && !answer.password)) {
    notice.warn('退出 KiviBot CLI')
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
    notice.success(`创建文件: ${colors.cyan(files.join(', '))}`)

    if (needInstall || needStart) {
      await installDependencies(kiviDeps)
    }

    if (needStart) {
      process.off('SIGINT', exitHandler)
      await start()
    }
  } else {
    notice.error('配置文件和入口文件写入失败')
    process.exit(1)
  }
}

init.help = `
      init\t初始化框架，引导生成配置文件和入口文件`

function writeKiviConf(conf: Record<string, any>) {
  try {
    fs.writeJsonSync(ConfPath, conf, { spaces: 2 })
    return true
  } catch {
    return false
  }
}

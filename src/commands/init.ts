import fs, { writeFileSync } from 'fs-extra'
import prompts from 'prompts'

import { AppPath, ConfPath } from '@/path'
import { base64encode } from '@/utils/base64'
import { colors } from '@/utils/colors'
import { exitHandler } from '..'
import { kiviDeps, installDependencies } from './install'
import { notice } from '@/utils/notice'
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
    message: '请输入 Bot QQ 账号',
    validate: (input) => {
      return /^[1-9]\d{4,9}$/.test(input.trim()) ? true : '账号格式错误，请检查'
    },
    format: (e) => Number(e.trim())
  },
  {
    name: 'platform',
    type: 'select',
    message: '请选择登录协议 (按 ↑/↓)',
    initial: 0,
    choices: [
      {
        title: 'iPad（推荐）',
        value: 5,
        description: '平板协议不与手机电脑冲突，可同时在线，不会挤掉手机电脑'
      },
      {
        title: '安卓手机（推荐）',
        value: 1,
        description: '占用手机设备，会挤掉手机登录，无法通过手机QQ登录机器人帐号'
      },
      {
        title: '安卓平板',
        value: 2,
        description: '平板协议不与手机电脑冲突，可同时在线，不会挤掉手机电脑'
      },
      {
        title: 'MacOS',
        value: 4,
        description: '占用电脑设备，会挤掉电脑登录，无法通过电脑QQ登录机器人帐号'
      },
      {
        title: '安卓手表',
        value: 3,
        description: '不推荐，虽然不与手机电脑冲突，但是功能有阉割'
      }
    ]
  },
  {
    name: 'admins',
    type: 'list',
    message: '请输入 Bot 管理员 QQ',
    separator: ' ',
    format: (list: string[]) => [...new Set(list.filter((e) => !!e).map(Number))],
    validate: (list: string) => {
      return /^[1-9]\d{4,9}(\s+[1-9]\d{4,9})*$/.test(list.trim()) ? true : '账号格式错误，请检查'
    }
  },
  {
    name: 'login_mode',
    type: 'select',
    message: '请选择登录模式 (按 ↑/↓)',
    initial: 0,
    choices: [
      {
        title: '密码登录（推荐）',
        value: 'password',
        description: '可绕过扫码出现网络环境异常的问题'
      },
      {
        title: '扫码登录',
        value: 'qrcode',
        description: '在服务器上远程扫码可能会报环境异常'
      }
    ]
  },
  {
    name: 'password',
    type: (login_mode) => {
      return login_mode === 'password' ? 'text' : null
    },
    initial: '',
    message: '请输入 Bot 账号密码',
    style: 'password',
    validate: (password) => {
      return /^.{6,16}$/.test(password.trim()) ? true : '密码格式错误，请检查'
    },
    format: (password) => password.trim()
  },
  {
    name: 'device_mode',
    type: (prev) => {
      return ['qrcode', 'password'].includes(prev) ? null : 'select'
    },
    initial: 0,
    message: '请选择设备锁验证模式 (按 ↑/↓)',
    choices: [
      {
        title: '短信验证',
        value: 'sms',
        description: '需要使用绑定的手机号接收短信验证码'
      },
      {
        title: '扫码验证',
        value: 'qrcode',
        description: '在服务器上远程扫码可能会报环境异常'
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
    notice.warn('配置文件 `kivi.json` 已存在，覆盖请加上 `--force` 标志')
    process.exit(0)
  }

  const answer = await prompts(questions)

  if (!answer.login_mode || (answer.login_mode === 'password' && !answer.password)) {
    notice.warn('已退出 KiviBot CLI')
    process.exit(0)
  }

  const isOK = writeKiviConf({
    account: answer.account,
    login_mode: answer.login_mode,
    device_mode: answer.device_mode ?? 'sms',
    message_mode: 'short',
    password: base64encode(answer.password) ?? '',
    log_level: typeof log_level === 'string' ? log_level : 'info',
    admins: answer.admins,
    plugins: [],
    notice: DefaultNoticeConfig,
    oicq_config: {}
  })

  writeFileSync(AppPath, "require('@kivibot/core').start()")

  if (isOK) {
    notice.success(`已创建文件 ${colors.cyan(`kivi.json`)}， ${colors.cyan(`app.js`)}`)

    if (needInstall || needStart) {
      await installDependencies(kiviDeps)
    }

    if (needStart) {
      process.off('SIGINT', exitHandler)
      await start()
    }
  } else {
    notice.error('写出配置失败')
    process.exit(1)
  }
}

init.help = `
      init\t初始化框架，引导生成账号配置文件`

function writeKiviConf(conf: Record<string, any>) {
  try {
    fs.writeJsonSync(ConfPath, conf, { spaces: 2 })
    return true
  } catch {
    return false
  }
}

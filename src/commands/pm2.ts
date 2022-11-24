import { spawn } from 'node:child_process'

import { exitHandler } from '..'
import { installDependencies } from './install'
import { getCurrentAccount } from '@/utils/getCurrentAccount'
import { checkModule } from '@/utils/checkModule'

import type { ParsedArgs } from 'minimist'

export async function deploy(args: ParsedArgs) {
  if (!checkModule('pm2')) {
    await installDependencies('pm2')
  }

  process.off('SIGINT', exitHandler)

  const account = getCurrentAccount()
  const pm2Args = ['pm2', 'start', 'app.js', '--name', account || 'KiviBot']

  if (args.f) {
    pm2Args.push('-f')
  }

  const pm2 = spawn('npx', pm2Args, { stdio: 'inherit' })

  pm2.stdout?.on('data', (data) => console.log(data.toString()))
  pm2.stderr?.on('data', (data) => console.error(data.toString()))
}

deploy.help = `
      deploy\t使用 pm2 将框架进程部署在后台`

export async function stop(args: ParsedArgs) {
  if (!checkModule('pm2')) {
    await installDependencies('pm2')
  }

  process.off('SIGINT', exitHandler)

  const account = getCurrentAccount()
  const pm2Args = ['pm2', 'stop', account || 'KiviBot']

  if (args.f) {
    pm2Args.push('-f')
  }

  const pm2 = spawn('npx', pm2Args, { stdio: 'inherit' })

  pm2.stdout?.on('data', (data) => console.log(data.toString()))
  pm2.stderr?.on('data', (data) => console.error(data.toString()))
}

stop.help = `
      stop\t停止 pm2 后台的框架进程`

export async function log(args: ParsedArgs) {
  if (!checkModule('pm2')) {
    await installDependencies('pm2')
  }

  process.off('SIGINT', exitHandler)

  const account = getCurrentAccount()
  const pm2Args = ['pm2', 'log', account || 'KiviBot']

  if (args.f) {
    pm2Args.push('-f')
  }

  const pm2 = spawn('npx', pm2Args, { stdio: 'inherit' })

  pm2.stdout?.on('data', (data) => console.log(data.toString()))
  pm2.stderr?.on('data', (data) => console.error(data.toString()))
}

log.help = `
      log\t查看 pm2 框架进程日志`

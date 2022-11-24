import { spawn } from 'node:child_process'

import { exitHandler } from '..'
import { installDependencies } from './install'
import { getCurrentAccount } from '@/utils/getCurrentAccount'
import { checkModule } from '@/utils/checkModule'

export async function deploy() {
  if (!checkModule('pm2')) {
    await installDependencies('pm2')
  }

  process.off('SIGINT', exitHandler)

  const account = getCurrentAccount()

  const pm2 = spawn('pm2', ['start', 'app.js', '--name', account || 'KiviBot'], {
    stdio: 'inherit'
  })

  pm2.stdout?.on('data', (data) => console.log(data.toString()))
  pm2.stderr?.on('data', (data) => console.error(data.toString()))
}

deploy.help = `
      deploy\t使用 pm2 将框架进程部署在后台`

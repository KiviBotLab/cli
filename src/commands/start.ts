import { spawn } from 'node:child_process'

import { exitHandler } from '..'
import { kiviDeps, installDependencies } from './install'
import { checkModule } from '@/utils/checkModule'

export async function start() {
  if (!checkModule('@kivibot/core')) {
    await installDependencies(kiviDeps)
  }

  process.off('SIGINT', exitHandler)

  const node = spawn('node', ['app.js'], { stdio: 'inherit' })

  node.stdout?.on('data', (data) => console.log(data.toString()))
  node.stderr?.on('data', (data) => console.error(data.toString()))

  node.on('error', (err) => console.error(err))
}

start.help = `
      start\t使用 \`kivi.json\` 配置文件启动 KiviBot`

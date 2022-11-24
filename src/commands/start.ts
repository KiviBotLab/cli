import { spawn } from 'node:child_process'
import { existsSync } from 'fs-extra'

import { exitHandler } from '..'
import { kiviDeps, installDependencies } from './install'
import { NodeModulesDir } from '@/path'

export async function start() {
  if (!existsSync(NodeModulesDir)) {
    await installDependencies(kiviDeps)
  }

  process.off('SIGINT', exitHandler)

  const node = spawn('node', ['app.js'], { stdio: 'inherit' })

  node.stdout?.on('data', (data) => console.log(data.toString()))
  node.stderr?.on('data', (data) => console.error(data.toString()))
}

start.help = `
      start\t启动框架`

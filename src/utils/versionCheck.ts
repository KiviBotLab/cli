import os from 'node:os'
import { execSync } from 'node:child_process'
import { notice } from './notice'

export function versionCheck() {
  const nodeVersionInfo = execSync('node -v').toString('utf8').trim()
  const npmVersionInfo = execSync('npm -v').toString('utf8').trim()
  const arch = os.arch()

  const nodeMajorVersion = Number(nodeVersionInfo.replace('v', '').split('.')[0])

  if (!nodeMajorVersion || nodeMajorVersion < 14) {
    notice.warn(`框架要求 node 最低版本为 14，当前版本为 ${nodeMajorVersion} 请升级 node 版本`)
    process.exit(0)
  }

  notice.info(`运行环境 arch: ${arch} | node：${nodeVersionInfo} | npm：${npmVersionInfo}`)
}

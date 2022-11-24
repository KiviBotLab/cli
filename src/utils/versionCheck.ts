import os from 'node:os'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { notice } from './notice'
import { colors } from './colors'

export function getCliVersion() {
  return require(path.join(__dirname, '../../package.json')).version
}

export function versionCheck() {
  const nodeVerInfo = execSync('node -v').toString('utf8').trim()
  const npmVerInfo = execSync('npm -v').toString('utf8').trim()
  const arch = os.arch()

  const nodeMajorVersion = Number(nodeVerInfo.replace('v', '').split('.')[0])

  if (!nodeMajorVersion || nodeMajorVersion < 14) {
    notice.warn(`要求 node 最低版本为 14，当前为 ${nodeMajorVersion}，请升级 node 版本`)
    process.exit(0)
  }

  const ver = getCliVersion()
  const platform = os.platform()
  const env = `node: ${nodeVerInfo} | npm: ${npmVerInfo} | arch: ${platform}-${arch}`

  notice.info(colors.gray(`KiviBot CLI ${ver} | ${env}`))
}

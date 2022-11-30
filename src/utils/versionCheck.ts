import os from 'node:os'
import path from 'node:path'
import { notice } from './notice'
import { colors } from './colors'

export function getCliVersion() {
  return require(path.join(__dirname, '../../package.json')).version
}

export function versionCheck() {
  const nodeInfo = process.versions.node
  const nodeMajorVersion = nodeInfo.split('.')[0]

  if (Number(nodeMajorVersion) < 14) {
    notice.warn(`要求 node 最低版本为 14，当前为 ${nodeMajorVersion}，请升级 node 版本`)
    process.exit(0)
  }

  const ver = getCliVersion()
  const platform = os.platform()
  const env = `node: ${nodeInfo} | arch: ${platform}-${os.arch()}`

  notice.info(colors.gray(`KiviBot CLI ${ver} | ${env}`))
}

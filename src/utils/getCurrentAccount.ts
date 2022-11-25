import { ConfPath } from '@/path'

export function getCurrentAccount() {
  const kiviConf = require(ConfPath)
  return String(kiviConf?.account ?? '')
}

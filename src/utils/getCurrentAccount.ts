import { ConfPath } from '@/path'

import type { KiviConf } from '@kivibot/core'

export function getCurrentAccount() {
  const kiviConf: KiviConf = require(ConfPath)
  return String(kiviConf?.account ?? '')
}

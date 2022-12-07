import { writeJsonSync } from 'fs-extra'
import fg from 'fast-glob'
import path from 'node:path'

import { CWD } from '@/path'
import { notice } from '@/utils/notice'

import type { ParsedArgs } from 'minimist'

function shuffleString(str: string) {
  return str
    .split('')
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .join('')
}

export async function fix(args: ParsedArgs) {
  const device = args.device
  const deviceFile = args.deviceFile

  if (device) {
    const oicqDevicePath = deviceFile || (await fg('data/oicq/*/*.json'))?.[0]

    if (!oicqDevicePath) {
      notice.error('device file not found')
      process.exit(1)
    }

    const filePath = path.join(CWD, oicqDevicePath)

    try {
      const config = require(filePath)
      writeJsonSync(filePath, { ...config, imei: shuffleString(config?.imei || '') }, { spaces: 2 })

      notice.success('IMEI has been modified successfullly')
    } catch {
      notice.error('faild to read device config file')
    }
  }
}

fix.help = `
      fix\tfix command to solve certain problems`

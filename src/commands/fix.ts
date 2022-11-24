import fg from 'fast-glob'
import path from 'node:path'

import { notice } from '@/utils/notice'

import type { ParsedArgs } from 'minimist'
import { CWD } from '@/path'
import { writeJsonSync } from 'fs-extra'

function shuffleString(str: string) {
  return str
    .split('')
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .join('')
}

export async function fix(args: ParsedArgs) {
  const device = args.device

  if (device) {
    const oicqDevicePath = (await fg('data/oicq/*/*.json'))?.[0]

    if (!oicqDevicePath) {
      notice.error('设备文件不存在，请先启动一次框架生成配置文件')
      process.exit(1)
    }

    const filePath = path.join(CWD, oicqDevicePath)

    try {
      const config = require(filePath)
      writeJsonSync(filePath, { ...config, imei: shuffleString(config?.imei || '') }, { spaces: 2 })

      notice.success('已修改设备文件 IMEI')
    } catch {
      notice.error('读取设备文件发生错误')
    }
  }
}

fix.help = `
      fix\t修复命令，--device 修改设备 IMEI`

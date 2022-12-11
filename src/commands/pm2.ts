import { checkModule } from '@/utils/checkModule'
import { getCurrentAccount } from '@/utils/getCurrentAccount'
import { installDependencies } from './install'

import type { ParsedArgs } from 'minimist'
import { promiseExec } from '@/utils/promiseExec'
import { notice } from '@/utils/notice'

async function pm2(operation: 'start' | 'stop' | 'delete' | 'log', force = false) {
  if (!checkModule('pm2')) {
    await installDependencies('pm2')
  }

  const account = getCurrentAccount()
  const pm2Args = ['npx', 'pm2', operation, 'app.js', '--name', account || 'KiviBot']

  if (force) {
    pm2Args.push('-f')
  }

  try {
    await promiseExec(pm2Args.join(' '))
  } catch {}

  const opt = operation === 'start' ? 'deploy' : operation

  notice.info(`${opt} KiviBot successfully via pm2`)
}

export async function deploy(args: ParsedArgs) {
  await pm2('start', args.f)
}

deploy.help = `
      deploy\tdeploy KiviBot in background using pm2`

export async function stop(args: ParsedArgs) {
  await pm2('stop', args.f)
}

stop.help = `
      stop\tstop KiviBot background pm2 process`

export async function log(args: ParsedArgs) {
  await pm2('log', args.f)
}

log.help = `
      log\tview KiviBot background log using pm2`

export async function del(args: ParsedArgs) {
  await pm2('delete', args.f)
}

del.help = `
      del\tdelete KiviBot background pm2 process`

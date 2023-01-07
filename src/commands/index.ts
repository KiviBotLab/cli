import { init } from './init'
import { start } from './start'
import { deploy, stop, del, log, list } from './pm2'
import { create } from './create'
import { install } from './install'
import { update } from './update'
import { fix } from './fix'

export const cmds = {
  create,
  deploy,
  fix,
  init,
  install,
  list,
  log,
  start,
  stop,
  update,
  delete: del
}

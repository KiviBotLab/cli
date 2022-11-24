export const ts_config = `
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "CommonJS",
    "moduleResolution": "node",
    "rootDirs": [],
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
`.trim()

export const ts_template = `
import { KiviPlugin } from '@kivibot/core'

const plugin = new KiviPlugin('TS插件模板', '0.1.0')

plugin.onMounted((bot, [mainAdmin, ...admins]) => {
  bot.sendPrivateMsg(mainAdmin, plugin.name + '插件被禁用')

  plugin.onCmd('Hello', (e, args) => e.reply('World'))

  plugin.on('message', (e) => e.reply(e.message))
})

plugin.onUnmounted((bot, [mainAdmin, ...admins]) => {
  bot.sendPrivateMsg(mainAdmin, plugin.name + '插件被禁用')
})

export default plugin
`.trim()
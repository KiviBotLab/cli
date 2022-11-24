export const js_template = `
import { KiviPlugin } from '@kivibot/core'

const plugin = new KiviPlugin('JS插件模板', '0.1.0')

plugin.onMounted((bot, [mainAdmin, ...admins]) => {
  bot.sendPrivateMsg(mainAdmin, plugin.name + '插件被禁用')

  plugin.onCmd('Hello', (e, args) => e.reply('World'))

  plugin.on('message', (e) => e.reply(e.message))
})

plugin.onUnmounted((bot, [mainAdmin, ...admins]) => {
  bot.sendPrivateMsg(mainAdmin, plugin.name + '插件被禁用')
})

module.exports = plugin
`.trim()

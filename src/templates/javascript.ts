export const js_template = `
const { KiviPlugin } = require('@kivibot/core')

const plugin = new KiviPlugin('demo', '0.1.0', {
  enableGroups: [123456]
})

plugin.onMounted((bot, admins) => {
  plugin.onMessage((event, params) => {
    if (event.toString() === 'hello') {
      event.reply('world')
    }
  })

  plugin.onCmd('/cmd', (event, params, options) => {
    event.reply(JSON.stringify(params) + JSON.stringify(options))
  })

  plugin.onCmd(['cmd1', /^cmd2/i], (event, params, options) => {
    event.reply('cmd1 or /cmd2/i trigger!')
  })

  plugin.onAdminCmd('/adminCmd', (event, params, options) => {
    event.reply(JSON.stringify(params) + JSON.stringify(options))
  })

  plugin.onMatch([/morning/i, 'evening'], (event) => {
    event.reply('you too')
  })

  plugin.cron('0,10,20,30,40,50 * * * * *', (bot) => {
    bot.sendPrivateMsg(plugin.mainAdmin, 'cron task trigger!')
  })

  plugin.on('message.private', (event) => {
    event.reply('Hi, I am KiviBot.')
  })
})

module.exports = { plugin }
`.trim()

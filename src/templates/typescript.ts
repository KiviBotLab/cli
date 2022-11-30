export const ts_config = `
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
`.trim()

export const ts_template = `
import { KiviPlugin, segment } from '@kivibot/core'

const plugin = new KiviPlugin('demo', '0.1.0')

plugin.onMounted((bot, admins) => {
  plugin.onMessage(event => {
    const message = event.toString()

    if (message === 'hello') {
      event.reply([segment.face(66), 'world'])
    }
  })

  plugin.onCmd('/cmd', (event, params, options) => {
    event.reply(JSON.stringify(params) + JSON.stringify(options))
  })

  plugin.onCmd(['/cmd1', /^\\/cmd2/i], (event, params, options) => {
    event.reply('/cmd1 or /^/cmd2/i trigger!')
  })

  plugin.onAdminCmd('/adminCmd', (event, params, options) => {
    plugin.log(JSON.stringify(params) + JSON.stringify(options))

    event.reply(JSON.stringify(params) + JSON.stringify(options))
  })

  plugin.onMatch([/morning/i, 'evening'], event => {
    event.reply('you too')
  })

  plugin.cron('0,20,40 * * * * *', bot => {
    bot.sendPrivateMsg(plugin.mainAdmin, 'cron task trigger!')
  })

  plugin.on('message.private', event => {
    const id = event.sender.user_id
    const msg = 'receive message from: ' + id

    bot.sendPrivateMsg(plugin.mainAdmin, msg)
  })
})

export { plugin }
`.trim()

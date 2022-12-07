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
import { KiviPlugin, segment, http } from '@kivibot/core'

const plugin = new KiviPlugin('demo', '0.1.0')

plugin.onMounted(() => {
  plugin.onMessage(event => {
    const { raw_message } = event

    if (raw_message === 'hello') {
      const msgs = [segment.face(66), 'world']
      event.reply(msgs)
    }
  })
})

export { plugin }
`.trim()

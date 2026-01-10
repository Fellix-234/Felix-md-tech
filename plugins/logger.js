const fs = require('fs')
const path = require('path')

const logDir = path.join(__dirname, '..', 'logs')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)
const logFile = path.join(logDir, 'messages.log')

function append(line) {
  try { fs.appendFileSync(logFile, line + '\n') } catch {}
}

module.exports = {
  init: (sock) => {
    sock.ev.on('messages.upsert', ({ messages }) => {
      for (const m of messages) {
        const time = new Date().toISOString()
        const from = m.key?.remoteJid || 'unknown'
        const text = m.message?.conversation || m.message?.extendedTextMessage?.text || ''
        append(`${time} | ${from} | ${text}`)
      }
    })
  },
  command: 'logtail',
  description: 'Return last 20 log lines',
  run: async (sock, msg, args, { from }) => {
    try {
      const data = fs.readFileSync(logFile, 'utf8')
      const lines = data.trim().split('\n').slice(-20).join('\n')
      await sock.sendMessage(from, { text: lines || 'No logs yet.' })
    } catch (e) {
      await sock.sendMessage(from, { text: 'No logs available.' })
    }
  }
}

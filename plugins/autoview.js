module.exports = {
  command: 'autoview',
  description: 'Toggle auto-view status on/off',
  init: (sock) => {
    // mark incoming messages as read when auto-view is enabled
    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const m of messages) {
        try {
          if (!global.autoview) continue
          if (!m.key || m.key.fromMe) continue
          const jid = m.key.remoteJid
          const participant = m.key.participant || jid
          const id = m.key.id
          if (!jid) continue

          // If this is a status update (stories), remoteJid is 'status@broadcast'
          if (jid === 'status@broadcast') {
            try {
              if (typeof sock.sendReadReceipt === 'function') {
                await sock.sendReadReceipt(jid, participant, id)
              } else if (typeof sock.readMessages === 'function') {
                await sock.readMessages([m.key])
              }
            } catch (e) {}
            continue
          }

          // For normal messages, mark as read
          try {
            if (typeof sock.sendReadReceipt === 'function') {
              await sock.sendReadReceipt(jid, participant, id)
            } else if (typeof sock.readMessages === 'function') {
              await sock.readMessages([m.key])
            }
          } catch (e) {}
        } catch (e) {}
      }
    })
  },
  run: async (sock, msg, args, { from }) => {
    global.autoview = !global.autoview
    await sock.sendMessage(from, { text: `Auto-view is now ${global.autoview ? 'enabled' : 'disabled'}` })
  }
}

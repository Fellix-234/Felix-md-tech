const owner = "254725391914@s.whatsapp.net"
const sessions = {}

module.exports = {
  command: "inquiry",

  run: async (sock, msg, args, ctx) => {
    sessions[ctx.from] = { step: 1 }
    await sock.sendMessage(ctx.from, { text: "👤 Your name?" })
  },

  onMessage: async (sock, msg, ctx) => {
    if (!sessions[ctx.from]) return
    const text = msg.message?.conversation
    if (!text) return

    const s = sessions[ctx.from]

    if (s.step === 1) {
      s.name = text
      s.step = 2
      return sock.sendMessage(ctx.from, { text: "📧 Your email?" })
    }

    if (s.step === 2) {
      s.email = text
      s.step = 3
      return sock.sendMessage(ctx.from, { text: "💬 Describe your request:" })
    }

    if (s.step === 3) {
      await sock.sendMessage(owner, {
        text: `
📥 CLIENT INQUIRY

Name: ${s.name}
Email: ${s.email}

Message:
${text}
`
      })
      delete sessions[ctx.from]
      await sock.sendMessage(ctx.from, { text: "✅ Inquiry sent!" })
    }
  }
}
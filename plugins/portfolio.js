module.exports = {
  command: "portfolio",
  run: async (sock, msg, args, ctx) => {
    await sock.sendMessage(ctx.from, {
      text: `
📁 *FELIX MD TECH PORTFOLIO*
🤖 WhatsApp Bots
🌐 Web Development
🛡 Automation & Security

🔗 https://elgringo.netlify.app/
`
    })
  }
}
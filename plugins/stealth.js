const owner = "254725391914"

module.exports = {
  command: "stealth",
  run: async (sock, msg, args, ctx) => {
    const sender = msg.key.participant?.split("@")[0] || ""
    if (sender !== owner) {
      return sock.sendMessage(ctx.from, { text: "❌ Owner only" })
    }
    global.stealth = !global.stealth
    await sock.sendMessage(ctx.from, {
      text: `🕶 Stealth Mode: ${global.stealth ? "ON" : "OFF"}`
    })
  }
}
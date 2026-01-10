module.exports = {
  command: "ping",
  run: async (sock, msg, args, ctx) => {
    const start = Date.now()
    await sock.sendMessage(ctx.from, { text: "🏓 Pinging..." })
    await sock.sendMessage(ctx.from, {
      text: `🏓 Pong: ${Date.now() - start}ms`
    })
  }
}
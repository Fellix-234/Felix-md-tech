module.exports = {
  command: "uptime",
  run: async (sock, msg, args, ctx) => {
    const up = process.uptime()
    await sock.sendMessage(ctx.from, {
      text: `⏱ Uptime: ${(up / 60).toFixed(2)} minutes`
    })
  }
}
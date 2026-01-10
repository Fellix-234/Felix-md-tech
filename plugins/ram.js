module.exports = {
  command: "ram",
  run: async (sock, msg, args, ctx) => {
    const used = process.memoryUsage().rss / 1024 / 1024
    await sock.sendMessage(ctx.from, {
      text: `🧠 RAM Used: ${used.toFixed(2)} MB`
    })
  }
}
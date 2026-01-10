module.exports = {
  command: "leave",
  run: async (sock, msg, args, ctx) => {
    if (!ctx.from.endsWith("@g.us")) {
      return sock.sendMessage(ctx.from, {
        text: "❌ This is not a group"
      })
    }

    await sock.sendMessage(ctx.from, {
      text: "👋 FELIX MD TECH leaving the group"
    })

    await sock.groupLeave(ctx.from)
  }
}
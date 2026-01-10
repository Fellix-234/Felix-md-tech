const owner = "254725391914"

module.exports = {
  command: "join",
  run: async (sock, msg, args, ctx) => {
    const sender = msg.key.participant?.split("@")[0]
    if (sender !== owner) return

    const link = args[0]
    if (!link) {
      return sock.sendMessage(ctx.from, {
        text: "❌ Provide group invite link"
      })
    }

    const code = link.split("/").pop()
    await sock.groupAcceptInvite(code)

    await sock.sendMessage(ctx.from, {
      text: "✅ Joined group successfully"
    })
  }
}
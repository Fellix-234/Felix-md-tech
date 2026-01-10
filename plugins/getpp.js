module.exports = {
  command: "getpp",
  run: async (sock, msg, args, ctx) => {
    try {
      const user =
        msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
        ctx.from
      const pp = await sock.profilePictureUrl(user, "image")
      await sock.sendMessage(ctx.from, { image: { url: pp } })
    } catch {
      await sock.sendMessage(ctx.from, { text: "❌ No profile picture" })
    }
  }
}
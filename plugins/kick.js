

module.exports = {
    command: "kick",
    run: async (sock, msg, args, ctx) => {
        if (!ctx.from.endsWith("@g.us")) return
        const user = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return sock.sendMessage(ctx.from, { text: "❌ Please mention a user to kick." })
            await sock.groupParticipantUpdate(ctx.from, [user], "remove")
    }
}
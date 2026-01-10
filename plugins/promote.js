module.exports = {
    command : "promote",
    run: async (sock, msg, args, ctx) => {
        const user=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!User)return
        await sock.groupParticipantUpdate(ctx.from,[user],"promote")
    }
}
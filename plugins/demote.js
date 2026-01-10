

module.exports = {
    command:"demote",
    run: async (sock, msg, args, ctx) => {
        const user=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!User)return
        await sock.groupParticipantUpdate(ctx.from,[user],"demote")
    }   
}
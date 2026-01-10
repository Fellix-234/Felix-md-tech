module.exports = {
    command: "del",
    run: async (sock, msg, args, ctx) => {
        const quoted=msg.message.extendedTextMassage?.contextInfo
        if(!quoted)return
        await sock.sendMessage(ctx.from,{
            delete: {
                remoteJid: ctx.from,
                fromMe: true,
                id: quoted.stanzaId,
                participant: quoted.participant
            }
        })
    }
}
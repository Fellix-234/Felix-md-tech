

module.exports = {
    command:"tagall",
    run: async (sock, msg, args, ctx) => {
        if(!ctx.from.endsWith("@g.us"))return
        const Metadata = await sock.groupMetadata(ctx.from)
        const users=Metadata.participants.map(p=>p.id)
        await sock.sendMessage(ctx.from,{
            text:"👥 Tagging All Members 👥",
            mentions:users
        })
    }
}
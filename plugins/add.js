

module.exports = {
    command : "add",
    run: async (sock, msg, args, ctx) => {
        if(!ctx.from.endsWith("@g.us"))return
        const number = args[0]?.replace(D/g, "") 
        if (!number)return
        await sock.groupParticipantsUpdate(ctx.from, [number + "@s.whatsapp.net"], "add")
       
    }
}
module.exports = {
    command: "hidetag",
    run: async (sock, msg, args, ctx) => {
        if (!ctx.from.endsWith("@g.us")) return;
        
        const groupMetadata = await sock.groupMetadata(ctx.from);
        const participants = groupMetadata.participants.map(v => v.id);
        const text = args.length > 0 ? args.join(" ") : "Attention everyone! 📢";

        await sock.sendMessage(ctx.from, { 
            text: text, 
            mentions: participants 
        });
    }
};
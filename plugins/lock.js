const owner="254725391914"
global.locked = false

module.exports = {
    command: "lock",
    run: async (sock, msg, args, ctx) => {
        const sender=msg.key.partipant?.split("@")[0]
        if(sender!==owner)return
        global.locked=!global.locked
        await sock.sendMessage(ctx.from,{
            text:`🔒 Bot is now ${global.locked?"on":"off"}
            `
        })
    }
}
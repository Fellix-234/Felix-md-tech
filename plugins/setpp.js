const owner="254725391914"
module.exports = {
    command: "setpp",
    run: async (sock, msg, args, ctx) => {
        const sender=msg.key.participant?.split("@")[0]
        if(sender!==owner)return
        const quoted=msg.message.extendedTextMessage?.contextInfo?.quotedMessage
        if(!quoted?.imageMessage)
            return sock.sendMessage(ctx.from,{text:"RAeply to an image to set as profile picture."})
        const img=await sock.downloadMediaMessage(msg)
        await sock.updateProfilePicture(ctx.from,img)
        await sock.sendMessage(ctx.from,{text:"✅ Profile picture updated."})
    }
}
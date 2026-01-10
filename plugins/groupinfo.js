module.exports = {
  command: "groupinfo",
  run: async (sock, msg, args, ctx) => {
    if(!ctx.from.endsWith("@g.us")) return
    const meta=await sock.groupMetadata(ctx.from)
    await sock.sendMessage(ctx.from, {
        Text:
         `👥 Group Name: ${meta.subject}
👥 Group ID: ${meta.id}
👥 Group Creator: ${meta.owner}
👥 Participants: ${meta.participants.length}
📊 Group Description: ${meta.desc || "No description"}
`
    })
    }
}

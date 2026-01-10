module.exports = {
  command: "greet",
  run: async (sock, msg, args, ctx) => {
    const user = msg.key.participant || ctx.from
    await sock.sendMessage(ctx.from, {
      text: `👋 Welcome @${user.split("@")[0]} to FELIX MD TECH`,
      mentions: [user]
    })
  }
}
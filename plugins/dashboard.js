module.exports = {
  command: "dashboard",
  run: async (sock, msg, args, ctx) => {
    await sock.sendMessage(ctx.from, {
      text: "📊 Dashboard:\nhttps://elgringo.netlify.app/"
    })
  }
}
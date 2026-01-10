module.exports = {
  command: "website",
  run: async (sock, msg, args, ctx) => {
    await sock.sendMessage(ctx.from, {
      text: "🌐 Official Website:\nhttps://elgringo.netlify.app/"
    })
  }
}
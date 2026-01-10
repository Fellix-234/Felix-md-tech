module.exports = {
  command: "autoreact",
  run: async (sock, msg, args, ctx) => {
    global.autoreact = !global.autoreact
    await sock.sendMessage(ctx.from, {
      text: `🔥 AutoReact: ${global.autoreact ? "ON" : "OFF"}`
    })
  }
}
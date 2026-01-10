module.exports = {
  command: "settings",
  run: async (sock, msg, args, ctx) => {
    await sock.sendMessage(ctx.from, {
      text: `
⚙ BOT SETTINGS

AutoReact: ${global.autoreact}
Stealth: ${global.stealth}

Commands:
!autoreact
!stealth
`
    })
  }
}
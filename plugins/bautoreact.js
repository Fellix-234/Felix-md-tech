module.exports = {
  command: 'autoreact',
  description: 'Toggle auto-react on/off',
  run: async (sock, msg, args, { from }) => {
    global.autoreact = !global.autoreact
    await sock.sendMessage(from, { text: `Auto-react is now ${global.autoreact ? 'enabled' : 'disabled'}` })
  }
}

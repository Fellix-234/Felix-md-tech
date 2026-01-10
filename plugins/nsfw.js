module.exports = {
  command: 'nsfw',
  description: 'Toggle NSFW protection (placeholder)',
  run: async (sock, msg, args, { from }) => {
    global.nsfwProtection = !global.nsfwProtection
    await sock.sendMessage(from, { text: `NSFW protection is now ${global.nsfwProtection ? 'enabled' : 'disabled'}` })
  }
}

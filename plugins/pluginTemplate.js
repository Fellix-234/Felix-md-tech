// Template for adding new plugins
module.exports = {
  command: 'plugintemplate',
  description: 'Example plugin template',
  init: (sock) => {
    // optional: run once after socket is created
  },
  run: async (sock, msg, args, { from }) => {
    await sock.sendMessage(from, { text: 'This is a plugin template.' })
  }
}

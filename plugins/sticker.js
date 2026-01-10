const { Sticker } = require("wa-sticker-formatter")
module.exports = {
  command: "sticker",
  run: async (sock, msg, args, ctx) => {
    const quoted =
      msg.message.extendedTextMessage?.contextInfo?.quotedMessage
    if (!quoted?.imageMessage) return

    const img = await sock.downloadMediaMessage({
      message: quoted,
      key: msg.key
    })
    const sticker = new Sticker(img, {
      pack: "FELIX MD TECH",
      author: "Wondering Jew",
      quality: 70
    })
    await sock.sendMessage(ctx.from, await sticker.toMessage())
  }
}
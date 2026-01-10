const https = require("https")
let hits = 0

module.exports = {
  command: "analytics",
  run: async (sock, msg, args, ctx) => {
    hits++
    const start = Date.now()

    https.get("https://elgringo.netlify.app/", () => {
      const ms = Date.now() - start
      sock.sendMessage(ctx.from, {
        text: `
📊 WEBSITE ANALYTICS
🟢 Status: ONLINE
⚡ Response: ${ms} ms
👥 Hits: ${hits}
`
      })
    }).on("error", () => {
      sock.sendMessage(ctx.from, {
        text: "🔴 Website unreachable"
      })
    })
  }
}
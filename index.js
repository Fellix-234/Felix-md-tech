const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")
const P = require("pino")
const fs = require("fs")

const prefix = "!"
global.autoreact = true
global.stealth = false
global.locked = false
global.antilink = true

const plugins = []
for (const file of fs.readdirSync("./plugins")) {
  if (file.endsWith(".js")) {
    plugins.push(require(`./plugins/${file}`))
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  // initialize plugins that export an `init(sock)` function
  for (const plugin of plugins) {
    if (typeof plugin.init === 'function') {
      try { plugin.init(sock) } catch (e) { }
    }
  }

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return
    if (global.stealth || global.locked) return

    const from = msg.key.remoteJid
    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    // 🚫 Anti-link
    if (
      global.antilink &&
      from.endsWith("@g.us") &&
      body.includes("chat.whatsapp.com")
    ) {
      return sock.sendMessage(from, { text: "🚫 Group links not allowed" })
    }

    // 🔥 Auto-react
    if (global.autoreact && from !== "status@broadcast") {
      try {
        await sock.sendMessage(from, {
          react: { text: "🔥", key: msg.key }
        })
      } catch {}
    }

    if (!body.startsWith(prefix)) return

    const args = body.slice(1).trim().split(/ +/)
    const command = args.shift().toLowerCase()

    for (const plugin of plugins) {
      if (plugin.command === command) {
        await plugin.run(sock, msg, args, { from })
      }
    }
  })
  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      if (
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut
      ) {
        startBot()
      }
    } else if (connection === "open") {
      console.log("✅ FELIX MD TECH ONLINE")
    }
  })
}

startBot()
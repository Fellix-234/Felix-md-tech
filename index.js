import 'dotenv/config';
import express from 'express';
import { createBot } from 'whatsapp-cloud-api';

async function startBot () {
  // Auth state (saved in /session folder)
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    auth: state,
    browser: ["Felix-MD", "Chrome", "1.0"],
    printQRInTerminal: false
  })

  // Save session
  sock.ev.on("creds.update", saveCreds)

  // Connection updates
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update

    // Show QR
    if (qr) {
      console.log(chalk.green("📱 Scan this QR code:"))
      qrcode.generate(qr, { small: true })
    }

    // Connected
    if (connection === "open") {
      console.log(chalk.green("✅ Felix MD connected successfully!"))
    }

    // Reconnect if disconnected
    if (connection === "close") {
      const reason =
        lastDisconnect?.error?.output?.statusCode

      if (reason !== DisconnectReason.loggedOut) {
        console.log(chalk.yellow("🔄 Reconnecting..."))
        startBot()
      } else {
        console.log(chalk.red("❌ Logged out. Delete session folder and rescan."))
      }
    }
  })

  // OPTIONAL: Pairing code instead of QR
  if (!state.creds.registered) {
    const phoneNumber = "2547XXXXXXXX" // YOUR NUMBER (NO +)

    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(phoneNumber)
        console.log(chalk.cyan("🔗 PAIRING CODE:"), code)
      } catch (err) {
        console.error("Pairing failed:", err)
      }
    }, 3000)
  }
}

// START THE BOT
startBot()



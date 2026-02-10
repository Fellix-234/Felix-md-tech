import 'dotenv/config';
import express from 'express';
import chalk from 'chalk';
import qrcode from 'qrcode-terminal';
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';

// Ensure session directory exists
const sessionDir = './session';
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

async function startBot() {
  try {
    console.log(chalk.blue('🤖 Starting Felix MD Bot...'));
    
    // Auth state (saved in /session folder)
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const sock = makeWASocket({
      auth: state,
      browser: ["Felix-MD", "Chrome", "1.0.0"],
      printQRInTerminal: true
    });

    // Save session on credential updates
    sock.ev.on("creds.update", saveCreds);

    // Connection updates
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      // Show QR code
      if (qr) {
        console.log(chalk.green("\n📱 Scan this QR code to connect:\n"));
        qrcode.generate(qr, { small: true });
      }

      // Connection established
      if (connection === "open") {
        console.log(chalk.green("✅ Felix MD Bot connected successfully!"));
      }

      // Handle disconnection
      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;

        if (reason === DisconnectReason.loggedOut) {
          console.log(chalk.red("❌ Logged out. Delete session folder and rescan."));
          process.exit(0);
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log(chalk.yellow("🔄 Connection closed. Reconnecting..."));
          startBot();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log(chalk.yellow("🔄 Connection lost. Reconnecting..."));
          startBot();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log(chalk.yellow("🔄 Connection replaced elsewhere. Reconnecting..."));
          startBot();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log(chalk.yellow("🔄 Restart required. Reconnecting..."));
          startBot();
        } else {
          console.log(chalk.yellow(`🔄 Disconnected with reason: ${reason}. Reconnecting...`));
          startBot();
        }
      }
    });

    // Listen for incoming messages
    sock.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];
      if (!msg.message) return; // Ignore status updates
      
      console.log(chalk.cyan(`📨 Message from ${msg.key.remoteJid}: ${JSON.stringify(msg.message)}`));
    });

  } catch (err) {
    console.error(chalk.red("❌ Error starting bot:"), err);
    setTimeout(startBot, 5000);
  }
}

// START THE BOT
startBot();



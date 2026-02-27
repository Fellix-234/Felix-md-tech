import 'dotenv/config';
import express from 'express';
import chalk from 'chalk';
import qrcode from 'qrcode-terminal';
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import readline from 'readline';
import settings from './settings.js';

// Ensure session directory exists
const sessionDir = './session';
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

const defaultBotImageUrl = 'https://files.catbox.moe/cs1vep.jpg';
let runtimePairingNumber = '';

function getPairingNumber() {
  const candidates = [
    runtimePairingNumber,
    process.env.PAIRING_NUMBER,
    process.env.NUMERO_OWNER,
    process.env.OWNER_NUMBER,
    settings?.ownerNumber
  ];

  for (const candidate of candidates) {
    const digits = String(candidate || '').replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 15) {
      return digits;
    }
  }

  return '';
}

function askQuestion(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function ensurePairingNumberFromPrompt() {
  const defaultNumber = getPairingNumber();

  if (!process.stdin.isTTY) {
    runtimePairingNumber = defaultNumber;
    return;
  }

  const prompt = defaultNumber
    ? `📱 Enter WhatsApp number for pairing (press Enter to use ${defaultNumber}): `
    : '📱 Enter WhatsApp number for pairing (country code + number): ';

  const input = await askQuestion(prompt);
  const digits = String(input || '').replace(/\D/g, '');

  if (digits.length >= 10 && digits.length <= 15) {
    runtimePairingNumber = digits;
    return;
  }

  runtimePairingNumber = defaultNumber;
}

function getOwnerJid() {
  const ownerNumber = getPairingNumber();
  return ownerNumber ? `${ownerNumber}@s.whatsapp.net` : null;
}

function logPairingCode(pairingNumber, code) {
  if (!code) return;
  const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
  console.log(chalk.yellow('\n================= PAIRING CODE ================='));
  console.log(chalk.yellow(`📱 Number: +${pairingNumber}`));
  console.log(chalk.yellow(`🔐 Code: ${formatted}`));
  console.log(chalk.yellow('================================================\n'));
  console.log(chalk.cyan('📲 On WhatsApp: Linked Devices -> Link a Device -> Enter pairing code\n'));
}

async function sendStartupMessage(sock) {
  const ownerJid = getOwnerJid();
  if (!ownerJid) {
    console.log(chalk.yellow('ℹ️ Owner number not set. Startup message was not sent.'));
    return;
  }

  const caption = [
    '✅ Felix MD Bot started successfully!',
    `🤖 Bot: ${settings?.botName || 'Felix MD'}`,
    `📦 Version: ${settings?.version || 'unknown'}`,
    '🟢 Status: Online'
  ].join('\n');

  try {
    await sock.sendMessage(ownerJid, {
      image: { url: settings?.botImageUrl || defaultBotImageUrl },
      caption
    });
    console.log(chalk.green(`✅ Startup message sent to ${ownerJid}`));
  } catch (err) {
    console.log(chalk.red(`❌ Failed to send startup image message: ${err?.message || err}`));
    try {
      await sock.sendMessage(ownerJid, { text: caption });
      console.log(chalk.green(`✅ Fallback startup text sent to ${ownerJid}`));
    } catch (fallbackErr) {
      console.log(chalk.red(`❌ Failed to send startup text message: ${fallbackErr?.message || fallbackErr}`));
    }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize bot components (directories, audio, etc.)
const __dirname = path.dirname(new URL(import.meta.url).pathname);
try {
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  const init = require('./utils/init.js');
  init();
} catch (err) {
  console.log('⚠️  Initialization module not available');
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

    let pairingCodeRequested = false;
    let startupMessageSent = false;

    async function requestPairingCodeWithRetry() {
      await ensurePairingNumberFromPrompt();
      const pairingNumber = getPairingNumber();
      if (!pairingNumber) {
        console.log(chalk.yellow('ℹ️ Pairing number not configured. Set PAIRING_NUMBER or OWNER_NUMBER in .env to log pairing code.'));
        return;
      }

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const code = await sock.requestPairingCode(pairingNumber);
          logPairingCode(pairingNumber, code);
          pairingCodeRequested = true;
          return;
        } catch (pairErr) {
          console.log(chalk.red(`❌ Failed to request pairing code (attempt ${attempt}/3): ${pairErr?.message || pairErr}`));
          if (attempt < 3) {
            await sleep(4000);
          }
        }
      }

      console.log(chalk.yellow('ℹ️ Could not fetch pairing code yet. The bot will continue trying on reconnect.'));
    }

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

      if (connection === "connecting" && !state.creds.registered && !pairingCodeRequested) {
        await requestPairingCodeWithRetry();
      }

      // Connection established
      if (connection === "open") {
        console.log(chalk.green("✅ Felix MD Bot connected successfully!"));
        console.log(chalk.cyan("🎵 Bot ready! Sound effects enabled."));

        if (!startupMessageSent) {
          await sendStartupMessage(sock);
          startupMessageSent = true;
        }
      }

      // Handle disconnection
      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;

        if (reason === DisconnectReason.loggedOut) {
          if (!state.creds.registered) {
            console.log(chalk.yellow("⚠️ Pairing session reset by WhatsApp. Retrying fresh connection..."));
            startBot();
          } else {
            console.log(chalk.red("❌ Logged out. Delete session folder and rescan."));
            process.exit(0);
          }
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



const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Initialize client with LocalAuth
const client = new Client({
    authStrategy: new LocalAuth() // Automatically handles session
});

// Listen for QR code
client.on('qr', (qr) => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, { small: true }); // Display QR code in terminal
});

// When client is ready
client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

// Optional: Listen to incoming messages
client.on('message', message => {
    console.log(`Message from ${message.from}: ${message.body}`);
    // Example: auto-reply
    if(message.body.toLowerCase() === 'hi') {
        message.reply('Hello! 👋 I am your bot.');
    }
});

// Initialize the client
client.initialize();

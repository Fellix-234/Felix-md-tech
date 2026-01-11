import express from 'express';
import 'dotenv/config';
import { createBot } from 'whatsapp-cloud-api';

const app = express();
app.use(express.json());

const from = process.env.WHATSAPP_PHONE_NUMBER_ID;
const token = process.env.WHATSAPP_ACCESS_TOKEN;
const bot = createBot(from, token);

// Webhook for receiving messages
app.post('/webhook', async (req, res) => {
    const message = req.body;
    console.log('Incoming message:', message);

    // Example: auto-reply to text messages
    if (message.entry?.[0]?.changes?.[0]?.value?.messages) {
        const msgData = message.entry[0].changes[0].value.messages[0];
        const sender = msgData.from;
        const text = msgData.text?.body;

        if (text) {
            await bot.sendText(sender, `You said: ${text}`);
        }
    }

    res.sendStatus(200);
});

// Start server
app.listen(3000, () => {
    console.log('Webhook server running on port 3000');
});


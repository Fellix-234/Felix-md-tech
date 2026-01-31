import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to return QR code
app.get('/paircode', (req, res) => {
  // Replace this URL with your Felix-MD bot QR generator
  const sampleQR = 'https://files.catbox.moe/2vn3xl.png';
  res.json({ qrURL: sampleQR });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

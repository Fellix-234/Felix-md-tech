import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Route for root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Session route - serves session data
app.get("/session", (req, res) => {
  try {
    const sessionPath = path.join(__dirname, "session");
    
    if (!fs.existsSync(sessionPath)) {
      return res.status(404).json({ error: "Session directory not found" });
    }

    const files = fs.readdirSync(sessionPath).filter(f => !f.startsWith('.'));
    const sessionData = {
      sessions: files,
      count: files.length,
      timestamp: new Date().toISOString()
    };

    res.json(sessionData);
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    res.status(500).json({ error: "Failed to retrieve sessions" });
  }
});

// Session download route
app.get("/session/download/:file", (req, res) => {
  try {
    const fileName = req.params.file;
    const filePath = path.join(__dirname, "session", fileName);

    // Security: Prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname, "session"))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Session file not found" });
    }

    res.download(filePath);
  } catch (error) {
    console.error("Error downloading session:", error);
    res.status(500).json({ error: "Failed to download session" });
  }
});

// Paircode route - accepts POST with phone number
app.post("/paircode", (req, res) => {
  try {
    // Set response headers to prevent caching and ensure fresh data
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    const { phoneNumber } = req.body;
    
    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({ 
        error: "Phone number is required",
        status: "error"
      });
    }
    
    // Phone number validation
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        error: "Invalid phone number format. Use +countrycodephonenumber (e.g., +254712345678)",
        status: "error",
        received: phoneNumber
      });
    }
    
    // Generate a 9-digit pairing code (like WhatsApp does)
    const pairingCode = String(Math.floor(Math.random() * 900000000) + 100000000);
    
    // Generate a unique QR string
    const qrString = "FELIX-MD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    res.json({ 
      success: true,
      pairingCode: pairingCode,           // 9-digit code for manual entry
      phoneNumber: phoneNumber,           // Confirmed phone number
      qrURL: qrString,                    // For QR code generation
      botName: "Felix MD",
      timestamp: new Date().toISOString(),
      status: "ready",
      validFor: "60 seconds",
      method: "Pairing code - no camera needed"
    });
  } catch (error) {
    console.error("Error generating paircode:", error);
    res.status(500).json({ 
      error: "Failed to generate paircode",
      status: "error",
      details: error.message
    });
  }
});

// Backward compatibility - GET /paircode generates temporary code
app.get("/paircode", (req, res) => {
  try {
    // Set response headers to prevent caching and ensure fresh data
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    // Generate a 9-digit pairing code (like WhatsApp does)
    const pairingCode = String(Math.floor(Math.random() * 900000000) + 100000000);
    
    // Generate a unique QR string
    const qrString = "FELIX-MD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    res.json({ 
      pairingCode: pairingCode,           // 9-digit code for manual entry
      qrURL: qrString,                     // For QR code generation
      botName: "Felix MD",
      timestamp: new Date().toISOString(),
      status: "ready",
      validFor: "60 seconds",
      note: "Please provide phone number for better tracking"
    });
  } catch (error) {
    console.error("Error generating paircode:", error);
    res.status(500).json({ error: "Failed to generate paircode" });
  }
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("User connected");

  // Example QR image
  let qrData = "https://files.catbox.moe/2vn3xl.png";
  socket.emit("qr", qrData);

  const interval = setInterval(() => {
    qrData = "https://files.catbox.moe/2vn3xl.png?" + Date.now();
    socket.emit("qr", qrData);
  }, 60000);

  socket.on("disconnect", () => {
    console.log("User disconnected");
    clearInterval(interval);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found: " + req.path });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

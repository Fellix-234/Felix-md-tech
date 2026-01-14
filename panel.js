import express from "express";
import fs from "fs";
import multer from "multer";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve panel frontend
app.use(express.static("panel"));
app.use(express.json());

// File upload setup
const upload = multer({ dest: "uploads/" });

// Bot status
let botOnline = true;
let logs = [];

// Status endpoint
app.get("/status.json", (req, res) => {
  res.json({ schemaVersion: 1, label: "Bot Status", message: botOnline ? "Online" : "Offline", color: botOnline ? "brightgreen" : "red" });
});

// Logs endpoint
app.get("/logs", (req, res) => {
  res.json({ logs });
});

// Upload session.json
app.post("/upload-session", upload.single("session"), (req, res) => {
  fs.rename(req.file.path, "session.json", (err) => {
    if (err) return res.status(500).json({ status: "error", error: err.message });
    logs.push(`Session uploaded: ${req.file.originalname}`);
    res.json({ status: "success", message: "session.json uploaded" });
  });
});

// Restart bot
app.post("/restart-bot", (req, res) => {
  botOnline = false;
  logs.push("Restarting bot...");
  exec("pm2 restart felix-md-tech || node index.js", (err, stdout) => {
    if (err) return res.status(500).json({ status: "error", error: err.message });
    botOnline = true;
    logs.push("Bot restarted successfully!");
    res.json({ status: "success", output: stdout });
  });
});

app.listen(PORT, () => console.log(`Panel running at http://localhost:${PORT}`));

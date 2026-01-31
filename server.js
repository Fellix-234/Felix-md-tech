import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Route for root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

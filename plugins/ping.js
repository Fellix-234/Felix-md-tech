const path = require("path");

// Load audio utility if available
let audio = null;
try {
  audio = require(path.join(__dirname, "..", "utils", "audio.js"));
} catch (err) {
  // Audio not available, continue without it
}

module.exports = {
  command: "ping",
  run: async (sock, msg, args, ctx) => {
    // Play quick beep on command
    if (audio) {
      try {
        audio.playSystemBeep(1, 100);
      } catch (err) {
        // Continue
      }
    }

    const start = Date.now();
    await sock.sendMessage(ctx.from, { text: "🏓 🎵 Pinging..." });
    
    const latency = Date.now() - start;
    
    await sock.sendMessage(ctx.from, {
      text: `🏓 Pong: ${latency}ms\n🎵 Response with sound effect`
    });

    // Play completion sound
    if (audio) {
      try {
        audio.playSystemBeep(2, 150);
      } catch (err) {
        // Continue
      }
    }
  }
};
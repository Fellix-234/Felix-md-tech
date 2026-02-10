const fs = require("fs")
const path = require("path")

// Try to load audio utility if available
let audio = null;
try {
  audio = require(path.join(__dirname, "..", "utils", "audio.js"));
} catch (err) {
  // Audio utility not available, continue without sound
}

module.exports = {
  command: "menu",
  run: async (sock, msg, args, ctx) => {
    // Play notification sound before menu
    if (audio) {
      try {
        await audio.playSound('menuOpen');
        audio.playSystemBeep(2, 150); // Additional beep feedback
      } catch (err) {
        // Continue even if sound fails
      }
    }

    // Send menu with GIF and options
    await sock.sendMessage(ctx.from, {
      video: fs.readFileSync("./media/peaky.gif"),
      gifPlayback: true,
      caption: `
🎵 *FELIX MD TECH* 🎵

👑 Owner: ᏇᎧᏁᎴᏋᏒᎥᏁᎶ ᏠᏋᏇ
📞 +254725391914
📧 warriorfelix5@gmail.com
🌐 https://elgringo.netlify.app/

🛠 Commands
!website !portfolio !dashboard
!inquiry !analytics
!ping !uptime !ram !fact !stats !botinfo
!sticker !stickerwm !togif !toimg !ocr !quotemaker
!add !kick !promote !demote !del !tagall !hidetag
!welcome !antilink !mute !unmute

⚡ GOD MODE ENABLED ⚡
🎵 Sound Effects: Enabled
`,
      footer: "By Order of the Peaky Blinders",
      buttons: [
        { buttonId: "!website", buttonText: { displayText: "🌐 Website" }, type: 1 },
        { buttonId: "!portfolio", buttonText: { displayText: "📁 Portfolio" }, type: 1 },
        { buttonId: "!inquiry", buttonText: { displayText: "📝 Inquiry" }, type: 1 },
        { buttonId: "!contact", buttonText: { displayText: "👑 Contact" }, type: 1 }
      ],
      headerType: 4
    })
  }
}
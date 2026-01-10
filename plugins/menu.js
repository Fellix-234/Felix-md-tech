const fs = require("fs")

module.exports = {
  command: "menu",
  run: async (sock, msg, args, ctx) => {
    await sock.sendMessage(ctx.from, {
      video: fs.readFileSync("./media/peaky.gif"),
      gifPlayback: true,
      caption: `
🤖 *FELIX MD TECH*

👑 Owner: ᏇᎧᏁᎴᏋᏒᎥᏁᎶ ᏠᏋᏇ
📞 +254725391914
📧 warriorfelix5@gmail.com
🌐 https://elgringo.netlify.app/

🛠 Commands
!website !portfolio !dashboard
!inquiry !analytics
!ping !uptime !ram !fact!stats !botinfo
!sticker !stickerwm !togif !toimg !ocr !quotemaker
!add !kick !promote !demote !del !tagall !hidetag
!welcome !antilink !mute !unmute

⚡ GOD MODE ENABLED
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
module.exports = {
  command: "owner",
  run: async (sock, msg, args, ctx) => {
    await sock.sendMessage(ctx.from, {
      text: `
👑 *BOT OWNER*

Name:
ᏇᎧᏁᎴᏋᏒᎥᏁᎶ ᏠᏋᏇ (ᏇᏗᏒᏒᎥᎧᏒ)

📞 WhatsApp:
+254725391914

📧 Email:
warriorfelix5@gmail.com

🌐 Website:
https://elgringo.netlify.app/

🖤 By Order of the Peaky Blinders
`
    })
  }
}
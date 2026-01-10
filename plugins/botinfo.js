module.exports = {
  command: "botinfo",
  run: async (sock, msg, args, ctx) => {
    await sock.sendMessage(ctx.from, {
        text:
            `🤖 Bot Name: FELIX MD TECH
            prefix: !
            mode:GOD MODE
            Owner: ᏇᎧᏁᎴᏋᏒᎥᏁᎶ ᏠᏋᏇ
            Contact: +254725391914
            Library: Baileys
            status: Online
            `
    })
    }   
}
module.exports = {
  command: "contact",
  run: async (sock, msg, args, ctx) => {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:Wondering Jew
ORG:FELIX MD TECH
TEL;waid=254725391914:+254725391914
EMAIL:warriorfelix5@gmail.com
URL:https://elgringo.netlify.app/
END:VCARD
`
    await sock.sendMessage(ctx.from, {
      contacts: {
        displayName: "FELIX MD TECH",
        contacts: [{ vcard }]
      }
    })
  }
}
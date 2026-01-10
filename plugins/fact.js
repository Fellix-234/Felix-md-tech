const facts = [
  "Honey never spoils 🍯",
  "Octopus has 3 hearts 🐙",
  "Lightning is hotter than the sun ⚡",
  "The Eiffel Tower can be 15 cm taller during the summer 🌞"
]
module.exports = {
  command: "fact",
  run: async (sock, msg, args, ctx) => {
    await sock.sendMessage(ctx.from, {
      text: facts[Math.floor(Math.random() * facts.length)]
    })
  }
}
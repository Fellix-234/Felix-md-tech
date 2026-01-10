const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "What do you call a fake noodle? An impasta!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "How does a penguin build its house? Igloos it together!",
  "Why did the math book look sad? Because it had too many problems."
];
module.exports = {
  command: "joke",
  run: async (sock, msg, args, ctx) => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await sock.sendMessage(ctx.from, {
      text: randomJoke
    });
  }
}
const replies = {
  hi:"Hello 👋",
  hello:"Hey there 😄",
  bot:"Yes? 🤖",
  owner:"My owner is ᏇᎧᏁᎴᏋᏒᎥᏁᎶ ᏠᏋᏇ 👑",
  bye:"Goodbye 👋"
}

module.exports = {
  command: "chat",
  run: async (sock,msg,args,ctx)=>{
    const q = args.join(" ").toLowerCase()
    const reply = replies[q] || "🤖 FELIX MD TECH is listening…"
    await sock.sendMessage(ctx.from,{text:reply})
  }
}
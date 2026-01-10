global.premiumUsers = ["254725391914"]

module.exports = {
  command: "premium",
  run: async (sock,msg,args,ctx)=>{
    await sock.sendMessage(ctx.from,{
      text:`⭐ Premium Users:\n${global.premiumUsers.join("\n")}`
    })
  }
}
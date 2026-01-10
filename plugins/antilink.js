global.antilink = true

module.exports = {
  command: "antilink",
  run: async (sock,msg,args,ctx)=>{
    global.antilink = !global.antilink
    await sock.sendMessage(ctx.from,{
      text:`🚫 AntiLink: ${global.antilink?"ON":"OFF"}`
    })
  }
}
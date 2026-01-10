module.exports = {
  command:"stats",
  run: async(sock,msg,args,ctx)=>{
    await sock.sendMessage(ctx.from,{
      text:`
📊 BOT STATS
Uptime: ${(process.uptime()/60).toFixed(2)} min
RAM: ${(process.memoryUsage().rss/1024/1024).toFixed(2)} MB
Prefix: !
`
    })
  }
}
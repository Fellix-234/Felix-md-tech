const yt = require('yt-dlp-exec');

module.exports = {
    command: "yt",
    run: async (sock, msg, args, ctx) => {
        const url = args[0];
        if (!url || !url.includes("youtube.com") && !url.includes("youtu.be")) {
            return sock.sendMessage(ctx.from, { text: "Please provide a valid YouTube link!" });
        }

        await sock.sendMessage(ctx.from, { text: "⏳ Processing YouTube video... please wait." });

        try {
            // This gets the direct download URL
            const output = await yt(url, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                preferFreeFormats: true,
            });

            await sock.sendMessage(ctx.from, { 
                video: { url: output.url }, 
                caption: `🎥 *${output.title}*` 
            });
        } catch (e) {
            await sock.sendMessage(ctx.from, { text: "❌ Error: Could not download the video." });
        }
    }
};
const { Downloader } = require("@tobyg74/tiktok-api-dl");

module.exports = {
    command: "tiktok",
    run: async (sock, msg, args, ctx) => {
        const url = args[0];
        if (!url || !url.includes("tiktok.com")) {
            return sock.sendMessage(ctx.from, { text: "Please provide a valid TikTok link!" });
        }

        await sock.sendMessage(ctx.from, { text: "⏳ Fetching TikTok video..." });

        try {
            const result = await Downloader(url, { version: "v1" });
            if (result.status === "success") {
                await sock.sendMessage(ctx.from, { 
                    video: { url: result.result.video }, 
                    caption: `🎵 *TikTok Download*` 
                });
            } else {
                throw new Error();
            }
        } catch (e) {
            await sock.sendMessage(ctx.from, { text: "❌ Failed to download TikTok video." });
        }
    }
};
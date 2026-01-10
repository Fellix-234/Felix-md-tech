module.exports = {
    command: "mute",
    run: async (sock, msg, args, ctx) => {
        // Check if it's a group
        if (!ctx.from.endsWith("@g.us")) {
            return sock.sendMessage(ctx.from, { text: "This command only works in groups!" });
        }

        const action = args[0]?.toLowerCase();

        if (action === "on" || action === "close") {
            await sock.groupSettingUpdate(ctx.from, "announcement");
            await sock.sendMessage(ctx.from, { text: "🔇 *Group Muted:* Only admins can send messages." });
        } else if (action === "off" || action === "open") {
            await sock.groupSettingUpdate(ctx.from, "not_announcement");
            await sock.sendMessage(ctx.from, { text: "🔊 *Group Unmuted:* Everyone can now send messages." });
        } else {
            await sock.sendMessage(ctx.from, { text: "Usage: `!mute on` or `!mute off`" });
        }
    }
}
module.exports = {
    command: "unmute",
    run: async (sock, msg, args, ctx) => {
        // Ensure the command is used in a group
        if (!ctx.from.endsWith("@g.us")) {
            return sock.sendMessage(ctx.from, { text: "This command only works in groups!" });
        }

        try {
            // Change group settings so everyone can send messages
            await sock.groupSettingUpdate(ctx.from, "not_announcement");
            await sock.sendMessage(ctx.from, { 
                text: "🔊 *Group Unmuted:* All participants can now send messages." 
            });
        } catch (err) {
            await sock.sendMessage(ctx.from, { text: "❌ Failed to unmute. Make sure I am an admin." });
        }
    }
}
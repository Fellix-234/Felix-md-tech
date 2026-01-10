// Welcome & Left Message Logic
sock.ev.on("group-participants.update", async (anu) => {
    try {
        let metadata = await sock.groupMetadata(anu.id);
        let participants = anu.participants;

        for (let num of participants) {
            // Get profile picture
            let ppuser;
            try {
                ppuser = await sock.profilePictureUrl(num, 'image');
            } catch {
                ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
            }

            if (anu.action == 'add') {
                let welcomeText = `Welcome to *${metadata.subject}*, @${num.split("@")[0]}! 👋\n\nHope you enjoy your stay here.`;
                await sock.sendMessage(anu.id, { 
                    image: { url: ppuser }, 
                    caption: welcomeText, 
                    mentions: [num] 
                });
            } else if (anu.action == 'remove') {
                let goodbyeText = `Goodbye @${num.split("@")[0]}... We'll miss you (maybe). 🏃💨`;
                await sock.sendMessage(anu.id, { 
                    image: { url: ppuser }, 
                    caption: goodbyeText, 
                    mentions: [num] 
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
});
// Audio/Sound Utility for Felix MD Bot
const soundPlay = require('sound-play');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, '..', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// System notifications (embeds simple beep patterns)
const audioPatterns = {
  // Menu opening sound - ascending beeps
  menuOpen: async () => {
    try {
      console.log(chalk.magenta('🎵 Playing menu sound...'));
      // Try to use system notification sound
      if (process.platform === 'linux') {
        await soundPlay.play('/usr/share/sounds/freedesktop/stereo/complete.oga').catch(() => {});
      } else if (process.platform === 'darwin') {
        await soundPlay.play('/System/Library/Sounds/Glass.aiff').catch(() => {});
      } else if (process.platform === 'win32') {
        await soundPlay.play('C:\\Windows\\Media\\notify.wav').catch(() => {});
      }
      console.log(chalk.green('✅ Sound played!'));
    } catch (err) {
      console.log(chalk.yellow('⚠️  Sound playback not available:', err.message));
    }
  },

  // Command executed sound
  commandSound: async () => {
    try {
      if (process.platform === 'linux') {
        await soundPlay.play('/usr/share/sounds/freedesktop/stereo/bell.oga').catch(() => {});
      }
    } catch (err) {
      // Silently fail
    }
  },

  // Error sound
  errorSound: async () => {
    try {
      if (process.platform === 'linux') {
        await soundPlay.play('/usr/share/sounds/freedesktop/stereo/dialog-error.oga').catch(() => {});
      }
    } catch (err) {
      // Silently fail
    }
  }
};

// Alternative: Console beep (works everywhere)
const consoleBeep = () => {
  console.log('\x07'); // ASCII bell character
};

// Play notification sound
async function playSound(soundType = 'menuOpen') {
  try {
    if (audioPatterns[soundType]) {
      await audioPatterns[soundType]();
    } else {
      consoleBeep();
    }
  } catch (err) {
    // Fail silently
  }
}

// Play multiple beeps (universal fallback)
function playSystemBeep(count = 3, delay = 200) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      process.stdout.write('\x07');
    }, i * delay);
  }
}

module.exports = {
  playSound,
  playSystemBeep,
  consoleBeep,
  audioPatterns
};

# 🎵 Felix MD Bot - Sound Effects Guide

## Overview

Felix MD Bot now includes integrated sound effects that play during various bot operations. This enhances the user experience with audio feedback.

## Features

### ✅ Sound Effects Enabled In:

1. **Menu Command** (`!menu`)
   - Plays notification sound when menu is loaded
   - System beep for feedback
   - Updates menu caption with 🎵 emoji

2. **Ping Command** (`!ping`)
   - Quick beep when command starts
   - Double beep when response sent
   - Latency measurements with audio feedback

3. **Bot Startup**
   - Single beep on successful initialization
   - "Sound Effects: Enabled" message

### 🎵 Sound Types

- **Menu Open**: Multiple beeps indicating menu is ready
- **Command Execute**: Single beep on command start
- **Completion**: Double beep on task completion
- **Error**: (Reserved for future error handling)

## System Requirements

### Audio on Linux
- **Default sounds used from freedesktop**:
  - Menu: `/usr/share/sounds/freedesktop/stereo/complete.oga`
  - Command: `/usr/share/sounds/freedesktop/stereo/bell.oga`

### Audio on macOS
- **System sounds**:
  - Menu: `/System/Library/Sounds/Glass.aiff`

### Audio on Windows
- **Notification sound**: `C:\Windows\Media\notify.wav`

### Fallback
- **Universal ASCII Bell** (`\x07`) - Works on all systems
- System beep patterns (multiple beeps)

## Usage

### For Users

Simply use commands normally - sounds will play automatically:

```bash
!menu        # Menu loads with sound effect
!ping        # Latency check with sound
!help        # Help command with sound
```

### For Developers - Adding Sound to Plugins

To add sound effects to your own plugins:

```javascript
const path = require("path");
const audio = require(path.join(__dirname, "..", "utils", "audio.js"));

module.exports = {
  command: "yourcommand",
  run: async (sock, msg, args, ctx) => {
    // Play startup sound
    await audio.playSound('menuOpen');
    
    // Or play system beeps
    audio.playSystemBeep(3, 200); // 3 beeps, 200ms apart
    
    // Your command logic here
    await sock.sendMessage(ctx.from, { text: "Done!" });
    
    // Play completion sound
    audio.playSystemBeep(2, 150);
  }
};
```

## Audio Utility API

### Functions

#### `playSound(soundType)`
Plays a named sound effect.

**Parameters:**
- `soundType` (string): Type of sound - `'menuOpen'`, `'commandSound'`, `'errorSound'`

**Example:**
```javascript
await audio.playSound('menuOpen');
```

#### `playSystemBeep(count, delay)`
Plays system beeps (universal fallback).

**Parameters:**
- `count` (number): Number of beeps (default: 1)
- `delay` (number): Milliseconds between beeps (default: 200)

**Example:**
```javascript
audio.playSystemBeep(3, 150); // 3 beeps, 150ms apart
```

#### `consoleBeep()`
Single ASCII bell beep.

**Example:**
```javascript
audio.consoleBeep();
```

## Configuration

### Disabling Sound

If you want to disable sound effects globally, modify `utils/audio.js`:

```javascript
// Comment out the playSound call in init.js
// Or set an environment variable:
// SOUND_EFFECTS=disabled
```

### Custom Sound Files

To add custom sound files:

1. Create a `sounds/` directory in the project root
2. Add your `.wav` or `.oga` files
3. Update `utils/audio.js` to reference them

```javascript
const customSound = path.join(soundsDir, 'your-sound.wav');
await soundPlay.play(customSound);
```

## Dependencies

- **sound-play**: Cross-platform audio playback library
- **chalk**: Terminal colors (already installed)

## Troubleshooting

### No Sound Playing

1. **Check audio system installation**:
   ```bash
   npm ls sound-play
   ```

2. **Verify system audio is enabled**:
   - Check system volume
   - Ensure speaker/headphones connected

3. **Check logs**:
   ```bash
   tail -f logs/bot.log | grep "Sound"
   ```

4. **Fallback is working**: If individual sounds fail, system beeps should still work

### Sound Distorted

- Adjust system volume
- Check for audio hardware issues
- Fallback to system beeps (less resource intensive)

## Future Enhancements

- [ ] Custom menu sound upload
- [ ] Per-command sound configuration
- [ ] Volume control
- [ ] Sound presets (silent, quiet, normal, loud)
- [ ] Different sound packs (default, minimal, gaming, etc.)

## Performance Impact

- **Minimal**: Sounds are played asynchronously
- **Non-blocking**: Doesn't interfere with bot operations
- **Graceful fallback**: Works without system audio

## Examples

### Example 1: Menu with Sound
```bash
User: !menu
Bot: 🎵 (plays sound) → Menu displayed with GIF
```

### Example 2: Ping with Sound
```bash
User: !ping
Bot: 🎵 (beep) → 🏓 Pinging...
Bot: 🎵 🎵 (double beep) → 🏓 Pong: 45ms
```

### Example 3: Custom Command with Sound
```javascript
// In your plugin
audio.playSystemBeep(1, 100);    // Start sound
// Process command
audio.playSystemBeep(2, 200);    // Done sound
```

## License

Sound effects use system default sounds provided by:
- FreeDesktop (Linux)
- Apple System Sounds (macOS)
- Windows Media (Windows)

---

**Sound Effects Module**: `utils/audio.js`
**Initialization**: `utils/init.js`
**Status**: ✅ Active & Ready

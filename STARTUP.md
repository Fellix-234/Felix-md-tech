# 🤖 Felix MD Bot - Startup & Usage Guide

## Quick Start

### Option 1: Using the Startup Script (Recommended)
```bash
./start.sh
```

This will:
- Start the web server on port 3000
- Start the WhatsApp bot
- Display all PIDs and confirmation messages
- Create log files in `logs/` directory

### Option 2: Manual Start

**In Terminal 1 - Start Web Server:**
```bash
node server.js
```

**In Terminal 2 - Start Bot:**
```bash
node index.js
```

## Access Points

### Web Interface
- **URL**: `http://localhost:3000`
- **Features**:
  - Live QR code generator for WhatsApp pairing
  - Session management
  - Bot status monitoring

### What to do:
1. Open `http://localhost:3000` in your browser
2. Scan the displayed QR code using WhatsApp on your phone
3. Select "Link to a phone" / "WhatsApp Web"
4. Wait for connection confirmation in the bot terminal

## File Structure

```
Felix-md-tech/
├── server.js              # Web server (Express)
├── index.js              # WhatsApp bot (Baileys)
├── start.sh              # Startup script
├── public/
│   └── index.html        # Web interface with QR code
├── session/              # Bot session files (auto-created)
├── logs/                 # Log files (auto-created)
├── plugins/              # Bot commands and features
└── config.js             # Bot configuration
```

## Available Routes

### Web Server Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main QR code pairing interface |
| `/paircode` | GET | Returns JSON with pairing data |
| `/session` | GET | Lists active sessions |
| `/session/download/:file` | GET | Download session file |

### Example API Calls

**Get Pairing Code:**
```bash
curl http://localhost:3000/paircode
```

**Get Sessions:**
```bash
curl http://localhost:3000/session
```

## Troubleshooting

### Server not starting
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill existing process
pkill -f "node server.js"
```

### Bot not responding
```bash
# Check bot log
tail -f logs/bot.log

# Restart bot
pkill -f "node index.js"
node index.js
```

### QR code not showing
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+F5)
- Check browser console for errors (F12)

### Session not connecting
- Delete old session: `rm -rf session/`
- Rescan QR code
- Check that WhatsApp is logged out from web

## Environment Variables

Edit `.env` file to customize:
```env
PORT=3000
PREFIX=.
PUBLIC_MODE=yes
AUTO_READ=yes
AUTO_REACT=no
# ... more options in .env file
```

## Stopping the System

```bash
# Stop web server
pkill -f "node server.js"

# Stop bot
pkill -f "node index.js"

# Or use shorthand
pkill -f "node" # ⚠️ Kills all Node processes
```

## Key Dependencies

- **Baileys** - WhatsApp API library
- **Express** - Web server framework
- **Socket.io** - Real-time communication
- **qrcode-terminal** - Terminal QR code display
- **chalk** - Terminal colors

## Performance Tips

1. **Run on dedicated terminal** to see logs
2. **Monitor logs** in separate terminals:
   ```bash
   tail -f logs/server.log   # Server logs
   tail -f logs/bot.log      # Bot logs
   ```

3. **Use the session file** to keep your connection persistent
4. **Back up session folder** before deleting

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `node server.js` | Start web server |
| `node index.js` | Start WhatsApp bot |
| `./start.sh` | Start both (recommended) |
| `pkill -f "node"` | Stop all Node processes |

## Network Access

- **Local Machine**: `http://localhost:3000`
- **Same Network**: `http://<your-ip>:3000`
- **With Port Forwarding**: Use your configured URL

## Getting Help

- Check logs: `logs/server.log` and `logs/bot.log`
- Verify WhatsApp is not connected elsewhere
- Ensure correct WhatsApp version on phone
- Try scanning QR code fresh (refresh page)

---

**Status**: ✅ Bot Ready
**Last Updated**: 2026-02-10

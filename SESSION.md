# 📱 Felix MD Bot - Session & WhatsApp Linking Guide

## What is a Session?

A **session** is the authentication data that keeps your bot connected to WhatsApp. Once you link your WhatsApp account to the bot, all connection credentials are saved in the `session/` folder.

## 📂 Session Folder Structure

After linking WhatsApp, your `session/` folder will look like this:

```
session/
├── creds.json              # Main credentials file (DO NOT SHARE!)
├── pre-keys.json           # Pre-encryption keys
├── sender-key-memory.json  # Chat key data
├── signal-store/           # Signal protocol folder
│   ├── app-state-sync-version.json
│   ├── app-stateSyncKey/
│   ├── chat-history-backup.json
│   ├── critical-unnotified-messages.json
│   ├── pre-keys/
│   ├── sender-keys/
│   └── sessions/
└── owner.json              # Session metadata
```

## 🔑 Key Session Files Explained

### 1. **creds.json** ⭐ (MOST IMPORTANT)
- Contains your WhatsApp authentication credentials
- Stores encryption keys and device tokens
- **NEVER share this file!**
- **NEVER commit to GitHub!**
- **NEVER send over internet unencrypted!**

```json
{
  "noiseKey": { "private": {...}, "public": {...} },
  "signedIdentityKey": { "private": {...}, "public": {...} },
  "signedPreKey": { "keyid": 1, "keyPair": {...}, "signature": {...} },
  "registrationId": 123456,
  ...
}
```

### 2. **pre-keys.json**
- Pre-generated encryption keys
- Used for initial message encryption
- System-managed (don't edit)

### 3. **sender-key-memory.json**
- Stores chat-specific encryption keys
- Maintains per-chat encryption state
- System-managed

### 4. **signal-store/** (Folder)
- Contains Signal protocol encryption state
- Multiple subfolders for different key types
- System-managed (don't modify)

### 5. **owner.json** 
- Session metadata
- Contains phone number and account info
- You can view this file

```json
{
  "phoneNumber": "254701881604",
  "jid": "254701881604@s.whatsapp.net",
  "timestamp": 1676234567890,
  "username": "Your WhatsApp Name"
}
```

## 📋 How Session Files Are Created

### Step 1: Pairing Code or QR Scan
1. User opens `http://localhost:3000`
2. Gets 9-digit pairing code OR scans QR
3. Enters code in WhatsApp or scans QR

### Step 2: Authentication
1. WhatsApp verifies the pairing/QR
2. Sends encryption credentials to bot
3. Bot receives and validates credentials

### Step 3: Session Saved
All session files are automatically created in `session/` folder:

```bash
session/
├── creds.json              ← Created automatically
├── pre-keys.json           ← Created automatically
├── sender-key-memory.json  ← Created automatically
└── signal-store/           ← Created automatically
```

## 🔗 Using SESSION_ID in .env

### What is SESSION_ID?

The `SESSION_ID` is an optional identifier you can set in `.env` for:
- Naming your session connection
- Identifying which device/account is linked
- Organizing multiple bot instances

### How to Set It

After WhatsApp is linked, update your `.env` file:

```env
# In .env file
SESSION_ID=MyBotSession

# Or with phone number
SESSION_ID=254701881604_FelixMD

# Or with description
SESSION_ID=Main_Bot_Production
```

### Finding Your Phone Number

1. **From WhatsApp**: Your account phone number (without +)
2. **From owner.json**:
   ```bash
   cat session/owner.json
   ```
   Shows your phone number in `phoneNumber` field

3. **From bot logs**:
   ```bash
   tail -f logs/bot.log | grep "phoneNumber"
   ```

## 🚀 Complete Linking Workflow

### Phase 1: Initial Setup
```bash
# 1. Start bot
./start.sh

# 2. Bot generates QR/pairing code
# Output: Shows 9-digit code or displays QR

# 3. Bot waits for connection
# Logs: "Attempting registration..."
```

### Phase 2: WhatsApp Connection
```bash
# 1. Open http://localhost:3000 in browser
# 2. See pairing code (9 digits) displayed
# 3. On phone WhatsApp:
#    - Settings → Linked Devices
#    - Link a Device
#    - Enter the 9-digit code
# 4. Or scan QR code if using that method
```

### Phase 3: Session Created
```bash
# Automatically created files:
✅ creds.json
✅ pre-keys.json
✅ sender-key-memory.json
✅ signal-store/

# Bot logs show:
# ✅ Felix MD connected successfully!
```

### Phase 4: Session Ready
```bash
# Update .env with session info
SESSION_ID=254701881604_Felix

# Now you can:
- Send messages
- Auto-reply
- Use all bot features
```

## 📍 Location of Session ID After Linking

### 1. **In session/owner.json** (Automatic)
```bash
cat session/owner.json
# Output:
# {
#   "phoneNumber": "254701881604",
#   "jid": "254701881604@s.whatsapp.net",
#   ...
# }
```

### 2. **Bot Terminal Output**
When bot connects, see logs like:
```
✅ Felix MD Bot connected successfully!
Connected with: +254701881604
Session saved to: ./session/creds.json
```

### 3. **In .env File** (Your Choice)
```env
SESSION_ID=254701881604
NUMERO_OWNER=254701881604
```

## 🔒 Session Security & Backup

### ⚠️ DO NOT:
```bash
# ❌ Never commit session to Git
git add session/creds.json      # NO!
git push                        # Could leak credentials!

# ❌ Never share session files
# ❌ Never share creds.json
# ❌ Never expose session folder publicly
# ❌ Never store in GitHub without encryption
```

### ✅ DO:
```bash
# ✅ Backup session securely
cp -r session/ session.backup.encrypted

# ✅ Use .gitignore (already configured)
session/                    # Ignored by default

# ✅ Back up to secure location
tar czf session_backup.tar.gz session/
# Store in secure cloud (encrypted)

# ✅ Rotate credentials periodically
rm -rf session/
# Rescan QR code to create new session
```

### Backup Steps
```bash
# 1. Create backup directory
mkdir -p backups

# 2. Archive session
tar czf backups/session_$(date +%Y%m%d).tar.gz session/

# 3. Verify backup
tar tzf backups/session_*.tar.gz

# 4. Store safely (not in Git!)
# Upload to secure cloud or external drive
```

## 🔄 Restoring Session

### If Bot Stops Working:

```bash
# 1. Check session files exist
ls -la session/

# 2. If creds.json corrupted:
rm session/creds.json

# 3. Rescan QR code
# Bot will create new session

# 4. Or restore from backup
tar xzf backups/session_20260210.tar.gz -C .
```

## 📊 Viewing Session Information

### Check Session Status
```bash
# View session owner info
cat session/owner.json | jq .

# See phone number
grep "phoneNumber" session/owner.json

# Check creds file exists
[ -f session/creds.json ] && echo "✅ Session exists" || echo "❌ No session"

# Size of session folder
du -sh session/
```

### Monitor Session in Real-Time
```bash
# Watch bot logs for session messages
tail -f logs/bot.log | grep -i "session\|connected\|creds"

# Check if specific files are being updated
watch -n 1 'ls -lt session/ | head -5'
```

## 🆘 Troubleshooting

### Session Not Created
```bash
# Problem: After linking, no session folder
# Solution:
1. Check bot logs: tail logs/bot.log
2. Verify bot is running: ps aux | grep "node index"
3. Check WhatsApp connection succeeded
4. Try linking again with fresh QR code
```

### Session.json Missing
```bash
# Problem: creds.json file gone
# Solution:
rm -rf session/           # Delete all session
# Bot will ask to rescan QR
# Scan fresh QR code from http://localhost:3000
```

### Wrong Phone Number
```bash
# Problem: Connected to wrong WhatsApp account
# Solution:
1. Logout from WhatsApp Web on your phone
2. Delete session: rm -rf session/
3. Rescan QR code
4. Use correct WhatsApp account
```

### Multiple Sessions/Accounts
```bash
# To run multiple bots with different sessions:

# Bot 1
SESSION_ID=bot1_254701881604
# Use session folder with symlink

# Bot 2  
SESSION_ID=bot2_254702881604
# Use different session folder

# Or use:
CUSTOM_SESSION_DIR=./sessions/bot1/
CUSTOM_SESSION_DIR=./sessions/bot2/
```

## 📞 Session & NUMERO_OWNER Setup

In `.env` file:

```env
# Your phone number (the account you linked)
NUMERO_OWNER=254701881604

# Session identifier (optional, for your reference)
SESSION_ID=MyBotMain

# Get these from session/owner.json after linking
```

## 🎯 Quick Reference

| Item | Location | Description |
|------|----------|-------------|
| Main Credentials | `session/creds.json` | Core auth data - ⚠️ KEEP SECURE |
| Session Info | `session/owner.json` | Phone number & metadata |
| Phone Number | `session/owner.json` | Your linked WhatsApp number |
| JID | `session/owner.json` | WhatsApp ID format |
| Session ID | `.env` > `SESSION_ID` | Your custom identifier |
| Encryption Keys | `session/signal-store/` | Automated encryption state |

## 📝 Complete .env Example

```env
# Bot Configuration
PREFIX="."
PORT=3000
SESSION_ID=Felix_Main_Bot

# Owner Info (From session/owner.json)
NUMERO_OWNER=254701881604
OWNER_NAME="Your Name"

# Features
PUBLIC_MODE=yes
AUTO_READ=yes
AUTO_REACT_STATUS=yes
ANTIDELETE=yes

# Database (Optional)
MONGO_URI=your_mongodb_uri
```

## ✅ Verification Checklist

After WhatsApp linking, verify:

- [ ] `session/creds.json` exists (shouldn't view, just verify)
- [ ] `session/owner.json` has your phone number
- [ ] Bot logs show "✅ Connected successfully"
- [ ] `.env` has `NUMERO_OWNER` set correctly
- [ ] SESSION_ID set in `.env` (optional but recommended)
- [ ] Can send/receive messages in WhatsApp
- [ ] Auto-features working (read receipts, reactions, etc.)

---

## 📚 Related Documentation

- [STARTUP.md](STARTUP.md) - How to start the bot
- [SOUND_EFFECTS.md](SOUND_EFFECTS.md) - Audio features
- [README.md](README.md) - General bot info

---

**Session Management**: Ready ✅
**Linking Status**: Click "Link a Device" in WhatsApp
**Session Location**: `/workspaces/Felix-md-tech/session/`

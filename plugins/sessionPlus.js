const fs = require('fs')
const path = require('path')

function safeList() {
  return fs.readdirSync('./session').filter(f => !f.startsWith('.'))
}

function readKeepList() {
  const p = path.join('session', 'keep_sessions.txt')
  try {
    const txt = fs.readFileSync(p, 'utf8')
    return txt
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'))
  } catch (e) {
    return []
  }
}

module.exports = {
  command: 'session',
  description: 'Extended session manager: list, info, delete, backup, cleanup',
  run: async (sock, msg, args, { from }) => {
    try {
      const sub = (args[0] || '').toLowerCase()

      if (sub === 'list') {
        const files = safeList()
        const text = files.length ? files.join('\n') : 'No session files found.'
        await sock.sendMessage(from, { text: `Sessions:\n${text}` })
        return
      }

      if (sub === 'info') {
        const name = args[1]
        if (!name) return await sock.sendMessage(from, { text: 'Usage: !session info <filename>' })
        try {
          const stat = fs.statSync(path.join('session', name))
          const out = `File: ${name}\nSize: ${stat.size} bytes\nModified: ${stat.mtime}`
          await sock.sendMessage(from, { text: out })
        } catch (e) {
          await sock.sendMessage(from, { text: 'Session file not found.' })
        }
        return
      }

      if (sub === 'delete') {
        const name = args[1]
        const confirm = args[2]
        if (!name) return await sock.sendMessage(from, { text: 'Usage: !session delete <filename> confirm' })
        if (confirm !== 'confirm') return await sock.sendMessage(from, { text: 'Destructive action. Add `confirm` as third argument to proceed.' })
        try {
          fs.unlinkSync(path.join('session', name))
          await sock.sendMessage(from, { text: `Deleted session file: ${name}` })
        } catch (e) {
          await sock.sendMessage(from, { text: 'Could not delete file (not found or error).' })
        }
        return
      }

      if (sub === 'backup') {
        const name = args[1]
        if (!name) return await sock.sendMessage(from, { text: 'Usage: !session backup <filename>' })
        try {
          const src = path.join('session', name)
          const backupsDir = path.join('session', 'backups')
          if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir)
          const dest = path.join(backupsDir, `${name}.${Date.now()}`)
          fs.copyFileSync(src, dest)
          await sock.sendMessage(from, { text: `Backed up ${name} -> backups/${path.basename(dest)}` })
        } catch (e) {
          await sock.sendMessage(from, { text: 'Backup failed (file may not exist).' })
        }
        return
      }

      if (sub === 'cleanup') {
        const confirm = args[1]
        if (confirm !== 'confirm') return await sock.sendMessage(from, { text: 'Destructive action. Add `confirm` as second argument to proceed.' })
        const keep = readKeepList()
        const files = safeList()
        const toDelete = files.filter(f => !keep.includes(f) && f !== 'keep_sessions.txt' && f !== 'session.json')
        let deleted = 0
        for (const f of toDelete) {
          try { fs.unlinkSync(path.join('session', f)); deleted++ } catch {}
        }
        await sock.sendMessage(from, { text: `Cleanup complete. Deleted ${deleted} files.` })
        return
      }

      await sock.sendMessage(from, { text: 'Usage: !session list | info <file> | delete <file> confirm | backup <file> | cleanup confirm' })
    } catch (err) {
      try { await sock.sendMessage(from, { text: 'Error handling session command.' }) } catch {}
    }
  }
}

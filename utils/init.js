// Bot initialization script - runs on startup
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = function initializeBot() {
  console.log(chalk.blue('\n🎵 Initializing Felix MD Bot Components...\n'));

  // Create necessary directories
  const dirs = [
    './session',
    './logs',
    './media',
    './sounds',
    './utils',
    './uploads'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`✅ Created directory: ${dir}`));
    }
  });

  // Initialize audio system
  try {
    const audio = require('./utils/audio.js');
    console.log(chalk.cyan('🎵 Audio system initialized'));
    
    // Play startup sound
    setTimeout(() => {
      audio.playSystemBeep(1, 100);
      console.log(chalk.green('✅ Bot startup sound played'));
    }, 1000);
  } catch (err) {
    console.log(chalk.yellow('⚠️  Audio system not available (optional)'));
  }

  console.log(chalk.green('\n✅ Initialization complete!\n'));
};

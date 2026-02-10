#!/bin/bash

# Felix MD Bot Startup Script
# This script starts both the web server and the WhatsApp bot

echo "🚀 Starting Felix MD Bot System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    exit 1
fi

# Kill any existing processes
echo "🛑 Stopping any existing Felix MD processes..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "node index.js" 2>/dev/null || true
sleep 1

# Create log directory
mkdir -p logs

# Start the web server
echo -e "${YELLOW}Starting web server...${NC}"
node server.js > logs/server.log 2>&1 &
SERVER_PID=$!
echo -e "${GREEN}✅ Web server started (PID: $SERVER_PID)${NC}"

# Start the bot
echo -e "${YELLOW}Starting WhatsApp bot...${NC}"
node index.js > logs/bot.log 2>&1 &
BOT_PID=$!
echo -e "${GREEN}✅ Bot started (PID: $BOT_PID)${NC}"

# Wait for servers to start
sleep 3

# Verify they're running
echo ""
echo "=== Verification ==="
if ps -p $SERVER_PID > /dev/null; then
    echo -e "${GREEN}✅ Web server running${NC}"
else
    echo -e "${RED}❌ Web server failed to start${NC}"
    exit 1
fi

if ps -p $BOT_PID > /dev/null; then
    echo -e "${GREEN}✅ Bot running${NC}"
else
    echo -e "${RED}❌ Bot failed to start${NC}"
    exit 1
fi

echo ""
echo "=== System Ready ==="
echo "🌐 Web Interface: http://localhost:3000"
echo "📱 Bot is ready for WhatsApp pairing"
echo ""
echo "📋 Logs:"
echo "   Server: logs/server.log"
echo "   Bot: logs/bot.log"
echo ""
echo "To stop the system, use: pkill -f 'node server.js' && pkill -f 'node index.js'"

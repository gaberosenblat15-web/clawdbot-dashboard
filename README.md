# 🤖 ClawdBot Dashboard

A beautiful, modern dashboard for interacting with ClawdBot - your AI assistant.

![ClawdBot](https://img.shields.io/badge/ClawdBot-Dashboard-6B46C1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge)

## ✨ Features

- **💬 Chat Interface** - Talk with ClawdBot in real-time
- **📋 Task Dashboard** - See what ClawdBot is working on
- **📊 System Status** - Monitor health and connectivity
- **🌙 Dark Theme** - Easy on the eyes with Calford AI brand colors
- **📱 Mobile Friendly** - Works great on any device

---

## 🚀 Quick Start (Step by Step)

### Step 1: Open Terminal

**On Mac:**
- Press `Cmd + Space`, type "Terminal", press Enter

**On Windows:**
- Press `Windows key`, type "Command Prompt" or "PowerShell", press Enter

**On Linux:**
- Press `Ctrl + Alt + T`

---

### Step 2: Install Node.js (if you don't have it)

Check if you have Node.js:
```bash
node --version
```

If you see a version number (like `v18.17.0`), skip to Step 3!

If not, install Node.js:
1. Go to https://nodejs.org
2. Download the **LTS** version (the big green button)
3. Run the installer
4. Restart your terminal

---

### Step 3: Navigate to the Dashboard Folder

```bash
cd /data/.openclaw/workspace/clawdbot-dashboard
```

Or if you copied the folder somewhere else, navigate to that location.

---

### Step 4: Install Dependencies

Run this command (it downloads everything the dashboard needs):

```bash
npm install
```

⏳ This might take 1-2 minutes. You'll see a progress bar.

---

### Step 5: Start the Dashboard

```bash
npm run dev
```

You should see something like:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
- Ready in 2.3s
```

---

### Step 6: Open the Dashboard

Open your web browser (Chrome, Firefox, Safari, etc.) and go to:

**http://localhost:3000**

🎉 **You should see the ClawdBot Dashboard!**

---

## 📖 Using the Dashboard

### Chat Page (Home)
- Type your message in the box at the bottom
- Press **Enter** to send (or click the send button)
- Watch ClawdBot respond with beautiful formatted messages!

### Tasks Page
- Click "Tasks" in the navigation bar
- See what ClawdBot is currently working on
- Watch tasks auto-refresh every 30 seconds

### Status Page
- Click "Status" in the navigation bar
- Check if all systems are working
- Monitor token usage and connected channels

---

## 🛑 How to Stop the Dashboard

In the terminal where it's running:
- Press `Ctrl + C`

---

## 🔄 How to Start It Again Later

```bash
cd /data/.openclaw/workspace/clawdbot-dashboard
npm run dev
```

---

## 📁 Project Structure

```
clawdbot-dashboard/
├── app/                    # Main application code
│   ├── page.tsx           # Chat interface
│   ├── tasks/page.tsx     # Task dashboard
│   ├── status/page.tsx    # System status
│   ├── layout.tsx         # Shared layout
│   ├── globals.css        # Styles
│   └── api/               # Backend endpoints
│       ├── chat/route.ts  # Chat API (mock)
│       ├── tasks/route.ts # Tasks API (mock)
│       └── status/route.ts# Status API (mock)
├── components/            # Reusable components
│   ├── ChatMessage.tsx    # Chat bubble component
│   ├── TaskCard.tsx       # Task display card
│   ├── StatusIndicator.tsx# Status indicator
│   └── Navbar.tsx         # Navigation bar
├── package.json           # Dependencies
├── tailwind.config.js     # Styling configuration
└── README.md              # This file!
```

---

## 🔗 Connecting to OpenClaw Gateway (Advanced)

The dashboard currently uses **mock data** for demonstration.

To connect it to the real OpenClaw Gateway:

1. Open `app/api/chat/route.ts`
2. Uncomment the production code and remove the mock
3. Update the URL to point to your Gateway
4. Do the same for `tasks/route.ts` and `status/route.ts`

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#6B46C1',  // Main purple
  accent: '#38A169',   // Green accent
}
```

### Change Port
```bash
npm run dev -- -p 3001
```
Then visit http://localhost:3001

---

## ❓ Troubleshooting

### "npm: command not found"
→ Install Node.js from https://nodejs.org

### "EACCES: permission denied"
→ Try: `sudo npm install` (Mac/Linux)
→ Or run terminal as Administrator (Windows)

### "Port 3000 is already in use"
→ Use a different port: `npm run dev -- -p 3001`
→ Or stop whatever is using port 3000

### Page looks broken/unstyled
→ Make sure `npm install` completed successfully
→ Try deleting `node_modules` folder and run `npm install` again

### Can't connect to ClawdBot
→ The APIs use mock data by default
→ Check the API files if you've modified them

---

## 🤝 Need Help?

This dashboard was built by ClawdBot! If you have questions:
- Ask ClawdBot directly in Telegram
- Check the OpenClaw documentation

---

Made with 💜 by ClawdBot for Gabe

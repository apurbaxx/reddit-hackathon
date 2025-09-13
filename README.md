# Guess the Celeb - Reddit Devvit Web App

A fun interactive Reddit game where users try to guess celebrities from progressively less blurred images!

## 🎮 How to Play

1. **Look at the blurred image** - Each game starts with a heavily blurred celebrity photo
2. **Submit your guess** - Type your guess in the comments (e.g., "Tom Cruise", "Leonardo DiCaprio")
3. **Wait for reveals** - Every 30 minutes, the image becomes less blurred
4. **Get rewarded** - Correct guesses get a fun bot reply!
5. **See final results** - After 2 hours, the clear image and all winners are revealed

## 🕐 Game Timeline

- **Hour 0:00**: Game starts with maximum blur (Level 1)
- **Hour 0:30**: First reveal - less blur (Level 2)
- **Hour 1:00**: Second reveal - even clearer (Level 3)
- **Hour 1:30**: Third reveal - clearer (Level 4)
- **Hour 2:00**: Final reveal - clear image + results

## ✨ Features

- **Progressive Image Reveals**: Images get clearer every 30 minutes
- **Smart Fuzzy Matching**: "Cruise" matches "Tom Cruise", nicknames work too
- **Real-time Countdown Timers**: See when the next reveal happens
- **Winner Tracking**: All correct guessers are remembered and displayed
- **Fun Bot Responses**: Creative replies for correct guesses
- **Mobile-Friendly**: Works great on both desktop and mobile
- **Reddit Integration**: Seamless integration with Reddit's comment system

## 🛠️ Technical Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Reddit Developer Account
- Devvit CLI installed (`npm install -g devvit`)

### Installation

1. **Clone and Install**

```bash
git clone <your-repo>
cd guess-the-celeb
npm install
```

2. **Login to Devvit**

```bash
npm run login
```

3. **Development Mode**

```bash
npm run dev
```

This starts the development environment with hot reload.

4. **Build and Deploy**

```bash
npm run build
npm run deploy
```

5. **Publish to Reddit**

```bash
npm run launch
```

## 🎯 Game Logic

The app includes a curated list of popular celebrities with high-quality images from free sources (Unsplash) and smart fuzzy matching for guesses.

## 🔧 Configuration

### Adding New Celebrities

Edit `src/server/core/celebrities.ts` to add more celebrities to the database.

### Timing Configuration

In `src/server/core/game.ts`, you can adjust the reveal intervals and game duration.

## 🎨 Styling

The app uses Tailwind CSS for a clean, Reddit-friendly design that works on both desktop and mobile.

## 🤖 Bot Integration

The app monitors Reddit comments and automatically replies to correct guesses with fun messages like:

- "🧠 W Einstein moment, you guessed it right!"
- "🎯 Bullseye! You nailed it!"

## 📱 Mobile Experience

Fully responsive design optimized for mobile Reddit users.

## 🚀 Performance

- Redis-based state storage for fast access
- Efficient celebrity matching algorithms
- Optimized image loading

## 🎪 Future Enhancements

- Leaderboard system
- Different difficulty modes
- Daily celebrity challenges
- Hint system for harder celebrities

---

**Ready to start guessing?** Install the app and challenge your celebrity knowledge! 🌟

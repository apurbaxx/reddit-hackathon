# 🏆 Guess the Celeb - Reddit Hackathon Entry

> **Reddit Devvit Hackathon 2025 Submission**  
> A fun interactive Reddit game where users try to guess celebrities from progressively less blurred images!

## � Hackathon Overview

This project was created for the **Reddit Devvit Hackathon 2025**, showcasing the power of Reddit's developer platform to create engaging, interactive experiences directly within Reddit posts.

### 🚀 What Makes This Special

- **Native Reddit Integration**: Seamlessly works within Reddit's ecosystem
- **Real-time Interactivity**: Live timers, instant feedback, and dynamic content updates
- **Community Engagement**: Brings users together through shared guessing games
- **Modern Web Technologies**: Built with React, TypeScript, and Tailwind CSS

## �🎮 How to Play

1. **Look at the blurred image** - Each game starts with a heavily blurred celebrity photo
2. **Submit your guess** - Use the built-in form to make your guess
3. **Wait for reveals** - Every 30 minutes, the image becomes less blurred
4. **Get rewarded** - Correct guesses are tracked and celebrated!
5. **See final results** - After 2 hours, the clear image and all winners are revealed

## 🕐 Game Timeline

- **Hour 0:00**: Game starts with maximum blur (Level 1)
- **Hour 0:30**: First reveal - less blur (Level 2)
- **Hour 1:00**: Second reveal - even clearer (Level 3)
- **Hour 1:30**: Third reveal - clearer (Level 4)
- **Hour 2:00**: Final reveal - clear image + results

## ✨ Hackathon Features

- **Progressive Image Reveals**: Images get clearer every 30 minutes with auto-refresh
- **Smart Fuzzy Matching**: "Cruise" matches "Tom Cruise", nicknames work too
- **Real-time Countdown Timers**: See when the next reveal happens
- **Winner Tracking**: All correct guessers are remembered and displayed
- **Dark Mode Toggle**: Integrated theme switcher for better UX
- **Mobile-Friendly**: Responsive design that works great on all devices
- **Auto-refresh Logic**: Seamless updates when timers expire or guesses are made

## 🏗️ Technical Implementation

### Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Reddit Devvit platform
- **State Management**: Custom React hooks with auto-refresh logic
- **Styling**: Clean, Reddit-native design system

### Key Technical Achievements

- **Real-time Timer System**: Auto-refresh when timers expire
- **Fuzzy String Matching**: Smart celebrity name recognition
- **Responsive Design**: Mobile-first approach
- **State Synchronization**: Seamless updates across game phases

## 🏗️ Technical Innovation

### Architecture Highlights

- **Frontend**: React + TypeScript + Tailwind CSS for modern, type-safe development
- **Backend**: Reddit Devvit platform integration
- **State Management**: Custom React hooks with intelligent auto-refresh logic
- **Real-time Features**: Live countdown timers with automatic game phase transitions

### Key Technical Achievements

- **Smart Auto-Refresh**: Automatically updates game state when timers expire
- **Fuzzy String Matching**: Advanced celebrity name recognition (handles nicknames, partial matches)
- **Responsive Design**: Mobile-first approach optimized for Reddit's diverse user base
- **Performance Optimization**: Efficient image loading and state synchronization

## 🎯 What Makes This Special

### Innovation in Reddit Gaming

This project pushes the boundaries of what's possible within Reddit's ecosystem:

- **Native Integration**: No external apps or websites needed
- **Community Focused**: Brings users together through shared challenges
- **Real-time Interactivity**: Live timers and instant feedback
- **Seamless UX**: Feels like a natural part of Reddit

### Technical Problem Solving

- **Timer Synchronization**: Auto-refresh when game phases change
- **State Consistency**: Reliable game state across all user sessions
- **User Experience**: Intuitive interface with clear visual feedback
- **Cross-Platform**: Works seamlessly on desktop and mobile Reddit

## 🏆 Hackathon Impact

### Judge Experience

- **Live Demo Ready**: Fully functional game available for immediate testing
- **User Engagement**: Real community interaction and participation
- **Technical Excellence**: Clean code architecture with modern best practices
- **Innovation Showcase**: Demonstrates Reddit platform's untapped potential

## 🎯 Hackathon Innovation

### What We Built

This project demonstrates the potential of Reddit as a platform for interactive gaming experiences. By leveraging Devvit's capabilities, we created a game that:

- **Lives natively in Reddit**: No external apps or websites needed
- **Engages communities**: Brings users together through shared challenges
- **Showcases modern web tech**: React, TypeScript, and real-time updates
- **Prioritizes UX**: Smooth interactions and responsive design

### Technical Challenges Solved

- **Timer synchronization**: Auto-refresh when game phases change
- **State management**: Consistent game state across user sessions
- **Performance optimization**: Efficient celebrity matching and image loading
- **User experience**: Intuitive interface with clear feedback

## 🔧 Configuration

### Adding New Celebrities

Edit `src/server/core/celebrities.ts` to add more celebrities to the database.

### Timing Configuration

In `src/server/core/game.ts`, you can adjust the reveal intervals and game duration.

## 🎨 Design Philosophy

The app uses Tailwind CSS for a clean, Reddit-friendly design that feels native to the platform while providing a modern, engaging user experience.

## 📱 Cross-Platform Experience

Fully responsive design optimized for:

- **Desktop Reddit**: Full-featured experience
- **Mobile Reddit**: Touch-optimized interactions
- **Reddit App**: Seamless integration

## 🏆 Hackathon Goals Achieved

✅ **Innovation**: Novel use of Reddit's platform for interactive gaming  
✅ **Technical Excellence**: Clean code, modern architecture, real-time features  
✅ **User Experience**: Intuitive design with smooth interactions  
✅ **Community Engagement**: Brings Reddit users together through shared challenges  
✅ **Platform Integration**: Native Reddit experience without external dependencies

---

## 🎪 Future Enhancements

- **Leaderboard System**: Track top performers across games
- **Difficulty Modes**: Easy, Medium, Hard celebrity categories
- **Daily Challenges**: Special themed celebrity rounds
- **Hint System**: Optional clues for harder celebrities
- **Social Features**: Share results, challenge friends

---

**🚀 Ready to experience the future of Reddit gaming?**  
This hackathon entry showcases what's possible when combining Reddit's community power with modern web technologies!

**Built with ❤️ for the Reddit Devvit Hackathon 2025** 🌟

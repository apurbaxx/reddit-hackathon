# Mystery Frame

**A fun celebrity guessing game built for Reddit!**

Users try to identify celebrities from progressively less blurred images. Every 30 minutes, the image gets clearer until someone guesses correctly or the 2-hour game ends. Built with React and integrated directly into Reddit posts using the Devvit platform.

## 🎮 How to Play

1. **Look at the blurred image** - Each game starts with a heavily blurred celebrity photo
2. **Submit your guess** - Use the built-in form to make your guess
3. **Wait for reveals** - Every 30 minutes, the image becomes less blurred
4. **Get rewarded** - Correct guesses are tracked and celebrated!
5. **See final results** - After 2 hours, the lightly blurred image and all winners are revealed

## 🕐 Game Timeline

- **Hour 0:00**: Game starts with maximum blur (Level 1)
- **Hour 0:30**: First reveal - less blur (Level 2)
- **Hour 1:00**: Second reveal - even clearer (Level 3)
- **Hour 1:30**: Third reveal - clearer (Level 4)
- **Hour 2:00**: Final reveal - lightly blurred image + results

## ✨Features

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

## 🎯 Why This Matters

This game showcases how Reddit can become a platform for interactive experiences beyond just comments and votes. It brings communities together through shared challenges while demonstrating the potential of Reddit's developer tools.

### Technical Problem Solving

- **Timer Synchronization**: Auto-refresh when game phases change
- **State Consistency**: Reliable game state across all user sessions
- **User Experience**: Intuitive interface with clear visual feedback
- **Cross-Platform**: Works seamlessly on desktop and mobile Reddit

## 🎯 Hackathon Innovation

### What We Built

This project demonstrates the potential of Reddit as a platform for interactive gaming experiences. By leveraging Devvit's capabilities, we created a game that:

- **Lives natively in Reddit**: No external apps or websites needed
- **Engages communities**: Brings users together through shared challenges
- **Showcases modern web tech**: React, TypeScript, and real-time updates
- **Prioritizes UX**: Smooth interactions and responsive design

---

## 🎪 Future Enhancements

- **Leaderboard System**: Track top performers across games
- **Difficulty Modes**: Easy, Medium, Hard celebrity categories
- **Hint System**: Optional clues for harder celebrities
- **Social Features**: Share results, challenge friends

---

**🚀 Ready to experience the future of Reddit gaming?**  
This hackathon entry showcases what's possible when combining Reddit's community power with modern web technologies!

**Built with ❤️ for the Reddit Devvit Hackathon 2025** 🌟

# 🌅 HunterX Mobile

> **HunterX** is a gamified habit and discipline app inspired by the progression system of **Solo Leveling**. Complete daily missions, earn XP, build streaks, level up, and transform consistency into a rewarding game.

Built with **React Native** and **Expo** for both **iOS** and **Android**.

---

## 📱 Overview

HunterX is designed to help users develop lasting habits through an engaging RPG-style experience. Instead of traditional to-do lists, users complete daily quests, gain experience, unlock achievements, maintain streaks, and earn rewards that keep them motivated every day.

---

## ✨ Features

### Core Features

- 🎯 Daily habit missions
- ⚡ Swipe-to-complete interactions
- 📈 XP and level progression
- 🔥 Daily streak tracking
- 🏆 Achievement system
- 🎁 Loot drop rewards
- 📊 Progress dashboard
- 👤 User profile and statistics
- 🌓 Dark theme inspired by Solo Leveling
- 🔔 Daily reminders and notifications

### Gamification

- Level progression
- Experience (XP) system
- Consecutive day streaks
- Daily quests
- Achievement badges
- Reward animations
- Scratch-card loot rewards
- Leaderboard rankings

### Phase 2

- 👥 Guild system
- 🤝 Resonance partner matching
- ❤️ Apple Health integration
- 💚 Google Fit integration
- 💎 Premium subscription (RevenueCat)
- 📱 Social sharing

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native | Cross-platform mobile development |
| Expo | Development framework |
| Expo Router | File-based navigation |
| TypeScript | Type safety |
| Supabase | Authentication & Database |
| React Native Reanimated | Smooth animations |
| Lottie | Achievement animations |
| Expo AV | Sound effects |
| RevenueCat | Subscription management *(Phase 2)* |

---

## 📂 Project Structure

```text
hunterx-mobile/
│
├── app/                # Expo Router screens
│   ├── (auth)/
│   ├── (onboarding)/
│   ├── (tabs)/
│   └── ...
│
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Helper functions
├── constants/          # App constants
├── assets/             # Images, animations & sounds
├── types/              # TypeScript definitions
└── app.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / yarn
- Expo CLI
- Android Studio or Xcode
- Expo Go (optional)

### Installation

```bash
git clone https://github.com/<your-org>/hunterx-mobile.git

cd hunterx-mobile

npm install
```

### Environment Variables

Create a `.env` file.

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=
```

### Start Development Server

```bash
npm start
```

or

```bash
npx expo start
```

Run on:

```bash
iOS
```

```bash
Android
```

```bash
Web
```

---

## 📦 Backend

This application communicates with the **HunterX Backend API** for:

- Authentication
- Habit management
- XP calculations
- Streak tracking
- Leaderboards
- Notifications
- User profiles

---

## 🌟 Related Repositories

| Repository | Description |
|------------|-------------|
| **hunterx-backend** | Node.js + Express API |
| **hunterx-admin** | Next.js Admin Dashboard |

---

## 👥 Team

| Name | Role |
|------|------|
| **Shakthi** | Product Management & Backend Development |
| **Dinesh** | Mobile Frontend Development |
| **Sunil** | UI/UX Design |
| **Kishore** | Quality Assurance |

---

## 🎯 Vision

HunterX transforms daily discipline into an immersive RPG experience. Every completed habit earns progress, every streak builds momentum, and every level represents real personal growth.

> **Discipline isn't built overnight. It levels up one day at a time.**

---

## 📄 License

This project is private and proprietary. Unauthorized copying, distribution, or modification is prohibited.

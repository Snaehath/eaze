# eaze

> **A tactile physical reset button for the 2 minutes before something important.**

`eaze` is a tiny, offline-first mobile app designed for moments of acute pre-event nervousness — right before a job interview, presentation, exam, performance, date, or difficult conversation.

Let's get you steady.

---

## ✨ Features

- **Kinetic Chrono-Horology Instrument:** High-detail SVG vector instrument with precision Guilloché dial indices, cardinal diamond markers, and 3 planetary satellite pinion gears that orbit and counter-rotate in real-time. Holding accelerates rotation speed with velocity-synchronized haptic ticks and realistic inertial coast-down.
- **1-Tap Instant Reset:** Open the app, tap `I'M NERVOUS`, discharge restless motor tension on the kinetic instrument, and tap `GO`. Zero decision fatigue.
- **30-Second Emergency Reset:** 10s sensory fidget discharge + 20s paced breathing (4s inhale / 6s exhale).
- **100% Offline & Private:** No sign-up, no login, no analytics, no remote APIs, and no ads. Works in airplane mode.
- **Automatic Dark & Light Mode:** Tailored warm-cream and deep charcoal palette.
- **Accessibility & Motion Controls:** Gracefully degrades to opacity transitions when Reduce Motion is enabled.

---

## 📱 Philosophy

When you are nervous, your cognitive bandwidth is low. Therefore:

- ❌ No onboarding questionnaires
- ❌ No account creation or logins
- ❌ No internet or cloud dependencies
- ❌ No ads, AI, or social features
- ❌ No giant exercise libraries
- ❌ No complicated multi-step forms

Just a direct, tactile sensory reset that gets you off your phone and into your real-world situation.

---

## 🛠️ Tech Stack

- **Framework:** React Native + Expo (SDK 54)
- **Language:** TypeScript
- **Graphics:** `react-native-svg` (pure vector math & native driver animation)
- **Navigation:** `@react-navigation/native` + `@react-navigation/native-stack`
- **Haptics:** `expo-haptics`
- **Storage:** `@react-native-async-storage/async-storage` (local session counter only)
- **Safe Area:** `react-native-safe-area-context`
- **Native Views:** `react-native-screens`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [Expo Go](https://expo.dev/go) app installed on your physical iOS or Android device (recommended for haptic feedback)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Snaehath/eaze.git
   cd eaze
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on your device:**
   - Scan the terminal QR code with the **Expo Go** app (Android) or **Camera** app (iOS).
   - Or press `a` for Android Emulator / `i` for iOS Simulator.

---

## 📂 Project Structure

```
src/
├── components/          # Reusable UI & sensory components
│   ├── FidgetTrigger.tsx# Kinetic SVG chrono-gear with planetary pinions
│   ├── BreathingCircle.tsx # 60fps breathing animation circle
│   ├── PrimaryButton.tsx# Tactile spring-press CTA button
│   └── SecondaryButton.tsx # Subtle action button
├── screens/             # Screen views
│   ├── HomeScreen.tsx   # Landing view & session stats badge
│   ├── ReleaseScreen.tsx# 1-screen tactile fidget reset
│   ├── QuickResetScreen.tsx # 30s timed sensory + breathing flow
│   ├── HistoryScreen.tsx# Minimal offline stats
│   └── AboutScreen.tsx  # Safety disclaimer & concept info
├── hooks/               # Headless logic & hardware facades
│   ├── useHaptics.ts    # Resilient device haptics wrapper
│   ├── useBreathing.ts  # Inhale/exhale state machine
│   ├── useSession.ts    # Offline session persistence
│   └── useReducedMotion.ts # Accessibility reduce-motion detector
├── navigation/          # React Navigation native stack
│   └── AppNavigator.tsx
├── theme/               # Design system tokens
│   ├── colors.ts        # Light & dark color tokens
│   ├── typography.ts    # Font sizing & line height scale
│   └── spacing.ts       # Spacing scale & touch targets
└── utils/               # Storage & timing utilities
    ├── storage.ts       # AsyncStorage helpers
    └── timing.ts        # Safe auto-cleanup timer hooks
```

---

## ⚠️ Disclaimer

`eaze` is a self-guided grounding tool for moments of everyday situational nervousness before important events. It is not a medical treatment, clinical diagnostic tool, or substitute for professional medical care.

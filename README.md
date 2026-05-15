# 🍽️ Intelligent Bistro

> **A full-stack AI-powered food ordering experience — order by voice, text, or tap.**

![CI](https://github.com/Soorya2201/Intelligent-Bistro/actions/workflows/ci.yml/badge.svg)
![Tests](https://img.shields.io/badge/tests-102%20passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-lightgrey)

---

## What is this?

Intelligent Bistro replaces the traditional tap-through food ordering UI with a **conversational AI waiter**. Users speak or type naturally — the AI parses intent, updates the cart in real time, handles edge cases like ambiguity and dietary conflicts, and reads its responses aloud.

It is a production-grade monorepo with a React Native mobile app, a Node.js streaming backend, real voice I/O, a custom streaming protocol, and a full unit test suite with CI.

---

## Screenshots

<div align="center">

| Desktop (Web) | Mobile (Android) |
|:---:|:---:|
| <img src="apps/mobile/assets/screenshot-desktop.png" width="480"/> | <img src="apps/mobile/assets/screenshot-mobile.png" width="220"/> |
| *Full conversation flow in browser* | *Live ordering on Android* |

</div>

---

## Core Features

### 🤖 Conversational AI Ordering
Say *"Add two spicy chicken sandwiches, remove the fries, and make it a combo"* — the AI parses the entire sentence and updates the cart with a single response. No button tapping required.

### 🎙️ End-to-End Voice I/O
- **Speech-to-text** via Groq's Whisper API (`whisper-large-v3-turbo`) — fast, accurate, free tier
- **Text-to-speech** via `expo-speech` — AI responses are spoken aloud, emoji-stripped automatically
- Live waveform animation and pulse ring give clear visual feedback while recording

### ⚡ Real-Time Streaming
The backend streams responses token-by-token over **Server-Sent Events**. Text appears character-by-character as the AI thinks — no waiting for a full response.

### 🧩 Custom Sentinel Protocol
Structured cart actions are embedded inside natural language using Unicode delimiters:
```
"I've added that! ✦ACTION✦{"op":"add","items":[{"id":"spicy-chicken","qty":2,"price":13.50}]}✦END✦ Great choice!"
```
The stream parser strips actions from visible text and dispatches them to the cart store **while the response is still streaming**. Supports 7 operations: `add`, `remove`, `update`, `clear`, `clarify`, `upsell`, `suggest`.

### 🛒 Smart Cart
- Add, remove, update quantities — via AI or the tap UI
- Animated cart badge with spring physics on every update
- Haptic feedback on every cart action
- Swipe-to-delete in the cart sheet

### 🥗 Dietary Intelligence
Tell Bistro *"I'm vegan"* or *"no nuts"* once — it remembers for the session and warns you before adding any conflicting item: *"Hey, just so you know, that contains dairy — want me to add it anyway?"*

### 💡 Upsells & Clarification
- Ambiguous orders trigger a `clarify` action with quick-reply chips
- After adding an item, Bistro naturally suggests a pairing: *"Most customers grab the truffle fries with it!"*
- Visual food card tiles appear inside the chat when browsing recommendations

### 📋 Checkout Narration
Before confirming, Bistro reads your entire order back to you conversationally — powered by the same streaming pipeline, so it streams in real time too.

### 📱 Polished UI
- Warm bistro-themed design system (custom colour tokens, spacing, radius constants)
- `react-native-reanimated` animations throughout — spring physics, fade-ins, wave bars
- `@shopify/flash-list` for buttery-smooth menu grid rendering
- Category tab bar with icon + label for quick browsing
- Full keyboard-avoiding layout with safe-area handling

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Mobile | Expo 54 + React Native | Cross-platform, managed workflow |
| Language | TypeScript (strict) | End-to-end type safety |
| State | Zustand | Minimal, composable slices |
| Backend | Node.js + Express | Lightweight, SSE-native |
| AI | Anthropic Claude (`claude-sonnet-4-5`) | Best-in-class instruction following |
| Voice STT | Groq Whisper | 2,000 min/day free, <1s latency |
| Voice TTS | `expo-speech` | Native on-device, no API cost |
| Navigation | React Navigation v7 | NativeStack + Tab navigator |
| Monorepo | Turborepo + npm workspaces | Parallel builds, shared config |
| CI | GitHub Actions | Tests on every push |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                 Expo App                    │
│                                             │
│  ChatScreen                                 │
│    ├── useVoiceInput  ──► Groq /transcribe  │
│    ├── useStreamParser ◄── SSE chunks       │
│    ├── useStore (Zustand)                   │
│    │     ├── cartSlice                      │
│    │     ├── chatSlice                      │
│    │     └── profileSlice                   │
│    └── useTTS  ──► expo-speech              │
│                                             │
│  HomeScreen ──► MenuGrid (FlashList)        │
│  CheckoutScreen ──► OrderRecap              │
└──────────────┬──────────────────────────────┘
               │ XHR / SSE  (LAN or tunnel)
┌──────────────▼──────────────────────────────┐
│              Node.js API (port 3001)         │
│                                             │
│  POST /chat  ──► Claude (streaming)         │
│  POST /transcribe ──► Groq Whisper          │
│  GET  /menu  ──► menu.json                  │
└─────────────────────────────────────────────┘
```

### Why XHR instead of fetch for SSE?
React Native's `fetch().body.getReader()` returns `null` on Android Hermes and drops partial chunks across platforms. The app uses `XMLHttpRequest.onprogress` to consume the SSE stream reliably on all targets.

---

## Project Structure

```
Intelligent-Bistro/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── routes/        # chat, menu, transcribe
│   │   │   ├── services/      # Anthropic client + system prompt
│   │   │   └── data/          # menu.json (single source of truth)
│   │   └── src/__tests__/     # API unit tests
│   └── mobile/
│       ├── src/
│       │   ├── screens/       # Home, Chat, Checkout, Profile
│       │   ├── components/    # Cart, Chat, Menu, Checkout UI
│       │   ├── hooks/         # useStreamParser, useVoiceInput, useTTS
│       │   ├── store/         # Zustand slices
│       │   ├── types/         # Shared TypeScript interfaces
│       │   └── utils/         # streamParser (pure, testable)
│       └── src/**/__tests__/  # Mobile unit tests
├── .github/workflows/ci.yml   # GitHub Actions CI
└── package.json               # Root workspace
```

---

## Test Suite

**102 tests across 6 suites — all passing.**

| Suite | Tests | What it covers |
|---|---|---|
| `menu.schema.test.ts` | 12 | Menu JSON structure, required fields, price validity |
| `anthropic.test.ts` | 17 | System prompt generation, cart/profile injection |
| `streamParser.test.ts` | 18 | Sentinel parsing, split-chunk edge cases, malformed JSON |
| `cartSlice.test.ts` | 22 | Add, remove, update, clear, quantity merge, totals |
| `chatSlice.test.ts` | 19 | Message append, streaming state, quick replies |
| `profileSlice.test.ts` | 14 | Dietary restrictions, liked items, toggles |

---

## Getting Started

### Prerequisites
- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com)
- A [Groq API key](https://console.groq.com) *(free — 2,000 min/day)*

### Setup

```bash
git clone https://github.com/Soorya2201/Intelligent-Bistro.git
cd Intelligent-Bistro
npm install

cp apps/api/.env.example apps/api/.env
# Fill in apps/api/.env:
#   ANTHROPIC_API_KEY=your_key
#   GROQ_API_KEY=your_key
```

### Run

```bash
npm run dev      # starts API on :3001 + Expo Metro simultaneously
```

**On a physical Android device:**
```bash
# Terminal 1
cd apps/api && npm run dev

# Terminal 2
cd apps/mobile && npx expo start --lan --clear
```

> Voice features require a custom dev client — they do not work in Expo Go.
> Build with `npx expo run:android` after installing Android Studio.

### Run Tests

```bash
cd apps/api    && npm test    # 29 tests
cd apps/mobile && npm test    # 73 tests
```

---

## Key Engineering Decisions

| Decision | Rationale |
|---|---|
| Sentinel protocol over function calling | Lets the AI mix natural language and structured actions in a single stream with no extra round-trip |
| XHR over fetch for SSE | `fetch` streaming is broken on Android Hermes — XHR `onprogress` is the only reliable option |
| Zustand over Redux | Slice composition without boilerplate; selector-based re-renders out of the box |
| Groq Whisper over OpenAI | 10× faster cold start, free tier sufficient for demos and development |
| Pure `createStreamParser` utility | Decoupled from React so it can be unit-tested without a DOM or native environment |

---

*Built by Soorya Narayanan*

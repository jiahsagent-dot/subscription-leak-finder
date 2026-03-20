# Subscription Leak Finder

**"Rocket Money for Australia — find your $600 in 5 minutes."**

A PWA that helps Australian consumers find, track, and cancel forgotten subscriptions. Built mobile-first, installable from the browser, works offline.

---

## Features

| Feature | Free | Premium ($4.99/mo) |
|---|---|---|
| Track subscriptions | Up to 5 | Unlimited |
| Quick-add 50 common AU subs | ✅ | ✅ |
| Dashboard + monthly total | ✅ | ✅ |
| Upcoming renewals (30 days) | ✅ | ✅ |
| Waste Calculator (unused 60+ days) | ❌ | ✅ |
| Category breakdown chart | ✅ | ✅ |
| Cancellation guides (10 major services) | ❌ | ✅ |
| CSV / bank statement import | ❌ | ✅ |
| Renewal reminder notifications | ❌ | ✅ |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React 18 + Vite | Fast DX, great PWA tooling |
| Styling | Tailwind CSS | Mobile-first utility classes |
| Auth | Firebase Auth | Email + Google, zero backend |
| Database | Firebase Firestore | Real-time, offline persistence |
| Charts | Recharts | Lightweight React chart library |
| CSV parsing | PapaParse | Fast, battle-tested, browser-native |
| Offline | Workbox (via vite-plugin-pwa) | Service Worker + cache strategies |
| Hosting | Vercel / Cloudflare Pages | Free global CDN |

---

## Local Setup

### 1. Clone the repo

```bash
git clone git@github.com:jiahsagent-dot/subscription-leak-finder.git
cd subscription-leak-finder
npm install
```

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g. `subleak-finder`)
3. Add a Web app → copy the config object
4. Enable **Authentication** → Sign-in methods → Email/Password + Google
5. Enable **Firestore Database** → Start in production mode
6. Set Firestore rules (see below)

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your Firebase values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=subleak-finder.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=subleak-finder
VITE_FIREBASE_STORAGE_BUCKET=subleak-finder.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_VAPID_KEY=BNm...  # For push notifications — from Firebase Cloud Messaging
```

### 4. Firestore security rules

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /subscriptions/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Build for Production

```bash
npm run build
# Output: dist/
```

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Set environment variables in the Vercel dashboard (Project → Settings → Environment Variables) — same keys as `.env`.

---

## Deploy to Cloudflare Pages

1. Push repo to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create application
3. Connect GitHub repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Add environment variables (same as `.env`)
6. Deploy

---

## Push Notifications (Renewals)

To enable push notification reminders:

1. In Firebase Console → Project Settings → Cloud Messaging
2. Copy the **VAPID key** → add as `VITE_FIREBASE_VAPID_KEY`
3. Set up a Firebase Cloud Function (or use a cron job service) to send FCM messages 3 days before renewals

---

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Login + Register screens
│   └── Layout/         # AppShell, BottomNav, PremiumGate
├── context/
│   └── AuthContext.jsx # Firebase auth + plan state
├── data/
│   ├── commonSubscriptions.js  # 50 pre-loaded AU subs
│   └── cancellationGuides.js   # 10 step-by-step guides
├── hooks/
│   └── useSubscriptions.js     # Subscription data + computed metrics
├── lib/
│   └── firebase.js             # Firebase init + helpers
├── pages/
│   ├── DashboardPage.jsx       # Hero: monthly total, chart, renewals
│   ├── SubscriptionsPage.jsx   # Full list with search/filter
│   ├── AddSubscriptionPage.jsx # Quick-add (50 subs) + custom form
│   ├── WastePage.jsx           # Unused subscriptions + waste $
│   ├── GuidesPage.jsx          # Cancellation step-by-step guides
│   ├── SettingsPage.jsx        # Account + plan upgrade
│   └── CSVImportPage.jsx       # Bank statement CSV import
└── utils/
    ├── subscriptionUtils.js    # Monthly/annual calc, waste, renewals
    └── csvParser.js            # PapaParse + subscription detection
```

---

## Revenue Model

- **Free tier:** 5 subscriptions
- **Premium:** $4.99/month or $34.99/year (saves 42%)
- Upgrade flow: Settings page → upgrades `plan` field in Firestore
- **Production:** Integrate Stripe Checkout for real payment processing

---

Built by Developer for Jai Smith / jiahsagent-dot · 2025

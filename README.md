# RealSlice — Frontend

RealSlice is a demo frontend for a fractional real-estate trading platform. It uses Next.js + React, Tailwind CSS, RainbowKit + wagmi for wallet integrations, and Chart.js for visualizations. This README explains how to set up and run the project locally and how to configure the WalletConnect project ID (from Reown).

## Prerequisites
- Node.js 18+ (recommended)
- npm (or yarn / pnpm)
- Git

## Quick start

1. Clone the repo
   ```
   git clone <repo-url>
   cd realslice-frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a .env.local in the project root with the WalletConnect project id (obtainable from Reown, see below)
   ```
   # .env.local
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_reown_project_id_here
   ```

4. Run the development server
   ```
   npm run dev
   ```
   Visit http://localhost:3000

## Building for production
```
npm run build
npm start
```

## Linting & types
- Run the linter:
  ```
  npm run lint
  ```
- If TypeScript complains about RainbowKit/wagmi types, the project includes a local declaration file at `src/types/rainbowkit-wagmi.d.ts` to avoid missing-type errors. Keep that file if you encounter ambient typing issues.

## Getting WalletConnect project ID from Reown
1. Login to your Reown dashboard (or the provider console you use).
2. Navigate to API / Integrations / WalletConnect (or similar).
3. Create or locate your WalletConnect v2 project and copy the `projectId`.
4. Paste the `projectId` into `.env.local` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.

> Note: Wagmi/RainbowKit will warn at runtime if no project ID is provided. A default placeholder is present in the code for local testing, but you should use your own project id for real WalletConnect sessions.

## Project structure (high level)
- `src/app` — Next.js app routes
- `src/sections` — page sections (Header, Hero, News, Testimonials, etc.)
- `src/components` — reusable components and UI primitives
- `src/providers` — Wagmi/RainbowKit provider (WagmiRainbowProvider.tsx)
- `src/types` — local type declarations
- `.next` — Next.js build output (do not commit)

## Common issues
- "Binding element 'account' implicitly has an 'any' type" — ensure TypeScript files include explicit types for RainbowKit render props (the project contains fixes).
- WalletConnect connection fails — confirm `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly and the network (chains) configuration matches the project settings.

## Contact / Next steps
- For production usage: secure env vars in your deployment platform, audit provider keys, and configure allowed origins in your WalletConnect/Reown console.
- Add tests and CI as needed.


# Ralph & Venilda (Cinematic 3D Wedding Invitation)

An elegant, interactive, and scroll-driven cinematic wedding invitation website created to celebrate the wedding of **Ralph & Venilda**.

---

## Overview

This website transforms a traditional wedding card into a modern, cinematic digital experience. As guests scroll, a seamless 174-frame high-definition 3D animation unfolds, guiding visitors through the couple's celebration, scripture, ceremony schedule, and venue details.

---

## Key Highlights & Features

- **✦ Scroll-Driven 3D Experience**: A fluid 174-frame sequence rendered on an optimized HTML5 Canvas, synchronizing animation frames directly with user scrolling for a smooth 60 FPS storybook progression.
- **✦ Wedding Preloader**: Displays the couple's custom gold monogram and wedding loading progress, caching all sequence frames ahead of time for zero-lag browsing on mobile and desktop.
- **✦ Ambient Soundtrack**: Built-in background audio player with a clean, icon-only toggle at the top of the screen featuring subtle animated equalizer waves.
- **✦ Scripture & Ceremony Details**: Displays sacred scripture (*Matthew 10:6*), ceremony timings (*5:30 PM, January 1st, 2027*), and reception information.
- **✦ Interactive Venue Directions**: Direct one-click navigation to St. Mary's Syrian (S.M.S) Community Hall, Varamballi, Brahmavara, Udupi via Google Maps.
- **✦ Livestream Integration**: Prepared for remote guests with dedicated broadcast notices and live wedding stream support.
- **✦ Lightweight & Privacy-First**: Zero tracking pixels, privacy-friendly, and optimized with modern WebP compression for lightning-fast load times.

---

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack React with SSR)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Cormorant Garamond, Jost, Pinyon Script
- **Build / Bundler**: Vite & Nitro
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/himanshiyenugupalli/RalphVenildaWeddingInvite.git

# Navigate into the project folder
cd RalphVenildaWeddingInvite

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Building for Production

```bash
# Build the production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Structure

```text
├── public/
│   ├── frames/             # 174 WebP animation frames
│   ├── favicon.ico         # Custom gold RV monogram favicon
│   ├── monogram.jpg        # High-resolution gold heart monogram
│   └── wedding-song.mp3    # Background soundtrack
├── src/
│   ├── components/
│   │   ├── audio/          # Ambient audio player & toggle
│   │   ├── invitation/     # Canvas scroll renderer & wedding preloader
│   │   └── sections/       # Venue, save-the-date, live stream & footer
│   ├── config/             # Single source of truth for wedding details & frames
│   └── routes/             # TanStack Start routing
└── vercel.json             # Vercel deployment configuration
```

---

## Wedding Details

- **Groom & Bride**: Ralph & Venilda
- **Date**: January 1st, 2027 · 5:30 PM IST
- **Venue**: St. Mary's Syrian (S.M.S) Community Hall, Varamballi, Brahmavara, Udupi – 576213

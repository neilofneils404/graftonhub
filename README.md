# GraftonHub - Community Hub Prototype

A warm, welcoming community information hub for Grafton, Oberlin, LaGrange, Carlisle Township, and Eaton Township.

## Design Philosophy

**Warm & Inviting** - Inspired by community centers and farmers markets, not tech startups. Terracotta, sage green, and cream colors create a friendly, approachable feel.

**Usefulness First** - Built for real people finding real information:
- Parents looking for youth sports registration
- New residents setting up utilities
- Community members checking events and news
- Families finding school calendars

**Fully Automated** - Designed to update twice daily with zero manual intervention.

## Current Status

✅ **Complete:**
- Warm, community-focused design system
- Homepage with weather, search, category navigation
- Responsive layout (mobile-friendly)
- Featured announcements section
- Base layout with header/footer

🚧 **In Progress:**
- Real NWS weather API integration
- Remaining pages (sports, schools, utilities, events, news)
- Search functionality
- Data fetching scripts
- Twice-daily automation

## Quick Start

```bash
cd ~/Projects/graftonhub
npm install
npm run dev
```

Visit http://localhost:4321 to see it live.

## Project Structure

```
graftonhub/
├── src/
│   ├── layouts/        # Base layout with header/footer
│   ├── pages/          # Homepage (more coming)
│   ├── components/     # Reusable UI components (coming)
│   ├── scripts/        # Data fetching scripts
│   └── styles/         # Global CSS with warm design system
├── data/               # JSON data files (weather, news, etc.)
└── public/             # Static assets
```

## Design System

**Colors:**
- Primary: Terracotta (#D4734B)
- Secondary: Sage Green (#7A9B76)
- Background: Warm Cream (#F5EFE6)
- Accents: Butter Yellow (#F2C94C), Sky Blue (#A8BFCE)

**Typography:**
- Font: Inter (clean, readable)
- Body: 16px with generous line-height (1.6)
- Headings: Bold, warm charcoal color

**Components:**
- Cards with soft shadows (not harsh)
- Pill-shaped search bar with terracotta border
- Large, friendly category cards
- Featured banners with yellow accent

## Next Steps

1. Wire up NWS API for real weather data
2. Build utilities guide page
3. Build sports registration directory
4. Add news feed (RSS from Chronicle-Telegram, Cleveland.com)
5. Create events calendar
6. Implement search with Pagefind
7. Set up automation (cron jobs for twice-daily updates)

## Philosophy

This is a **philanthropic project** - no ads, no tracking, no monetization. Just helpful information for our community, freely available to all residents and future residents.

The goal: Make it easy to find what you need, when you need it.

---

Built with ❤️ for our community

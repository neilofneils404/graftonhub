# Manual Deployment Guide

## What Happened (Feb 16, 2026)

The GitHub connection to Cloudflare Pages broke (likely expired token). When we tried to fix it by uninstalling/reinstalling the GitHub app, Cloudflare Pages lost its Git connection permanently with no way to reconnect in Settings.

**Decision:** Stick with manual deployments rather than deleting and recreating the project.

---

## How to Deploy Updates

### 1. Make your changes
Edit files in `src/` as needed.

### 2. Build the site
```bash
cd ~/Projects/graftonhub
npm run build
```

This creates/updates the `dist/` folder with the production site.

### 3. Commit to Git
```bash
git add .
git commit -m "Your commit message here"
git push origin master
```

This keeps GitHub up-to-date (even though it doesn't auto-deploy anymore).

### 4. Deploy to Cloudflare Pages
```bash
npx wrangler pages deploy dist --project-name graftonhub
```

**That's it!** Your changes are live in ~30 seconds.

---

## Quick Deploy (After Making Changes)

```bash
cd ~/Projects/graftonhub
npm run build
git add . && git commit -m "Update content" && git push
npx wrangler pages deploy dist --project-name graftonhub
```

---

## What Changed Today (Feb 16, 2026)

**User Feedback Fixes:**
1. ✅ Albert's Fresh Market hours: Mon-Sat 8AM-8PM (was 9PM)
2. ✅ Youth sports additions:
   - French Creek YMCA (ages 3-4+ basketball)
   - Hooptech (North Ridgeville training facility)
   - JBC at Grafton Health & Fitness Center
   - Elyria Recreation / Little League (t-ball age 4+)
   - Made Grafton Hot Stove age description more general
3. ✅ LaGrange Pharmacy address: 116 Public Square (was 540 N Center St)
   - They relocated in August 2025 when LaGrange IGA closed

---

## Troubleshooting

**If `wrangler` command not found:**
```bash
npm install -g wrangler
```

**If deploy fails:**
- Make sure you're in the graftonhub directory
- Make sure `npm run build` completed successfully
- Check that `dist/` folder exists and has content

---

## Future: Reconnecting Git (Optional)

If you ever want automatic deploys from GitHub pushes again:

1. Delete the current graftonhub Pages project in Cloudflare
2. Create new Pages project via "Connect to Git"
3. Select neilofneils404/graftonhub repo
4. Build command: `npm run build`
5. Output directory: `dist`
6. Re-add custom domain: graftonhub.com

**Cost:** ~15 minutes of setup + need to re-add the domain.

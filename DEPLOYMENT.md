# 🚀 Quick Deployment Guide for Vercel

## Fastest Way to Deploy (3 Steps)

### Option 1: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Navigate to the project folder
cd cricket-scoreboard

# 3. Deploy!
vercel

# For production:
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# 2. Go to vercel.com
# 3. Click "New Project"
# 4. Import your GitHub repository
# 5. Click "Deploy" (Vercel auto-detects settings)
```

### Option 3: Drag & Drop (No Code!)

1. Go to https://vercel.com
2. Sign in or create account
3. Drag and drop the `cricket-scoreboard` folder
4. Done! 🎉

---

## What You'll Get

✅ Live URL (e.g., `your-app.vercel.app`)
✅ Automatic HTTPS
✅ Global CDN
✅ Instant updates on push
✅ Free hosting

---

## Environment Details

- **Framework:** None (Pure HTML/CSS/JS)
- **Build Command:** None needed
- **Output Directory:** Root directory
- **Node.js:** Not required

---

## After Deployment

Your cricket scoreboard will be live at:
- `https://your-project-name.vercel.app`

You can:
- Share the link with anyone
- Use it on mobile devices
- Access it from anywhere
- It works offline after first load

---

## Troubleshooting

**Q: My styles aren't loading**
A: Make sure all files (index.html, styles.css, script.js) are in the root directory

**Q: How do I update my deployed app?**
A: Just run `vercel --prod` again, or push to GitHub if connected

**Q: Can I use a custom domain?**
A: Yes! Go to your project settings in Vercel dashboard → Domains

---

## File Structure (What You're Deploying)

```
cricket-scoreboard/
├── index.html       ← Main app file
├── styles.css       ← All styling
├── script.js        ← All functionality
├── vercel.json      ← Vercel configuration
├── README.md        ← Full documentation
└── .gitignore       ← Git exclusions
```

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- This project: Check README.md for full details

---

**Your cricket scoreboard is ready to deploy! 🏏**

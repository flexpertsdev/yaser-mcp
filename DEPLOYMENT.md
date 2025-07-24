# 🚀 Auto-Deploy Setup

Your SEO Analyzer will auto-deploy on every push to GitHub! Here's how to set it up:

## 📋 Quick Setup (5 minutes)

### 1. **Deploy to Netlify** (First time only)
- Go to [netlify.com](https://netlify.com)
- Click "Add new site" → "Import from Git"
- Select your `yaser-mcp` repository
- Use these settings:
  - **Build command:** `npm run generate`
  - **Publish directory:** `.output/public`

### 2. **Add Environment Variables** (In Netlify dashboard)
Go to Site Settings → Environment Variables and add:
```
FIRECRAWL_API_KEY=fc-01d6aab24be54f51bd3202069e7ca44d
```

### 3. **Set GitHub Secrets** (For GitHub Actions - Optional)
Go to your GitHub repo → Settings → Secrets and variables → Actions:

Add these secrets:
- `FIRECRAWL_API_KEY`: `fc-01d6aab24be54f51bd3202069e7ca44d`
- `NETLIFY_AUTH_TOKEN`: Get from [Netlify User Settings](https://app.netlify.com/user/applications#personal-access-tokens)
- `NETLIFY_SITE_ID`: Found in Site Settings → General → Site details

## ✅ That's It!

Now every time you push to GitHub:
1. Code pushes to `main` branch
2. GitHub Actions builds the project
3. Netlify automatically deploys the latest version
4. Your site updates within 1-2 minutes

## 🔗 One-Click Deploy Button

For instant deployment:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/flexpertsdev/yaser-mcp)

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run generate
```

## 📱 Features

- **Auto-deploy**: Push to GitHub = instant deployment
- **Preview builds**: Pull requests get preview URLs
- **Environment management**: Production and preview environments
- **Fast builds**: Optimized Nuxt.js static generation
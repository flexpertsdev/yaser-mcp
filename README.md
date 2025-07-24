# 🔍 SEO Analyzer

A powerful SEO analysis tool with a modern web interface, powered by Firecrawl MCP integration. Analyze any website for SEO optimization opportunities with detailed reports and actionable recommendations.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/flexpertsdev/yaser-mcp)

## ✨ Features

- 🚀 **Modern Web Interface** - Clean Nuxt.js frontend with real-time analysis
- 📊 **Comprehensive SEO Scoring** - 15+ metrics with actionable recommendations  
- 🔄 **Auto-Deploy** - Push to GitHub = instant deployment to Netlify
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast Analysis** - Powered by Firecrawl for reliable web scraping
- 📈 **Batch Processing** - Analyze multiple URLs at once
- 💾 **Report Generation** - JSON reports with detailed insights

## 🚀 Quick Start

### Option 1: One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/flexpertsdev/yaser-mcp)

### Option 2: Manual Setup
```bash
# Clone the repository
git clone https://github.com/flexpertsdev/yaser-mcp.git
cd yaser-mcp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Firecrawl API key

# Start development server
npm run dev
```

Visit `http://localhost:3000` to use the web interface.

## 🛠️ Command Line Usage

### Full SEO Analysis
```bash
npm run analyze https://example.com
# or
node src/seo-analyzer.js https://example.com
```

### Quick Check
```bash
npm run quick https://example.com
# or
node src/quick-check.js https://example.com
```

### Batch Analysis
```bash
npm run batch urls-to-analyze.txt
# or
node src/batch-analyzer.js urls-to-analyze.txt
```

## 📊 What Gets Analyzed

### SEO Fundamentals
- ✅ Page title optimization (length, uniqueness)
- ✅ Meta description analysis
- ✅ Heading structure (H1-H6 hierarchy)
- ✅ Content quality and word count
- ✅ Image optimization and alt text

### Technical SEO
- ✅ Internal/external link analysis
- ✅ URL structure assessment
- ✅ Social media meta tags (Open Graph, Twitter)
- ✅ Structured data validation
- ✅ Mobile responsiveness indicators

### Performance Insights
- ✅ Page load considerations
- ✅ Content accessibility
- ✅ SEO score calculation (0-100)
- ✅ Prioritized recommendations

## 🎯 SEO Score Breakdown

| Score Range | Grade | Meaning |
|-------------|-------|---------|
| 80-100 | 🟢 Excellent | Well optimized, minor improvements only |
| 60-79 | 🟡 Good | Some optimization needed |
| 0-59 | 🔴 Needs Work | Significant SEO improvements required |

## 📁 Project Structure

```
yaser-mcp/
├── 🌐 Frontend (Nuxt.js)
│   ├── pages/index.vue          # Main SEO analyzer interface
│   ├── server/api/analyze.post.ts # API endpoint for analysis
│   └── assets/css/main.css      # Styling
├── 🔧 Backend Analysis Tools
│   ├── src/seo-analyzer.js      # Main analyzer
│   ├── src/quick-check.js       # Quick SEO check
│   ├── src/batch-analyzer.js    # Batch URL analysis
│   └── src/utils/report-generator.js # Report generation
├── 📋 Configuration
│   ├── netlify.toml            # Netlify deployment config
│   ├── nuxt.config.ts          # Nuxt configuration
│   └── .github/workflows/      # Auto-deploy setup
└── 📊 Reports
    └── reports/                # Generated analysis reports
```

## 🚀 Auto-Deploy Setup

Every push to the `main` branch automatically deploys to Netlify:

1. **First Time Setup:**
   - Deploy to Netlify using the button above
   - Add `FIRECRAWL_API_KEY` to Netlify environment variables

2. **Continuous Deployment:**
   - Push code to GitHub
   - GitHub Actions builds the project  
   - Netlify deploys automatically
   - Live site updates in 1-2 minutes

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

## 🔑 Environment Variables

```bash
# Required
FIRECRAWL_API_KEY=your_firecrawl_api_key

# Optional
NUXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/flexpertsdev/yaser-mcp/issues)
- 💬 [Discussions](https://github.com/flexpertsdev/yaser-mcp/discussions)

---

**Built with ❤️ using Nuxt.js and Firecrawl MCP**
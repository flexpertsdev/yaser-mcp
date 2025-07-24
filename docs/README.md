# Firecrawl MCP SEO Analysis Tools

This directory contains optimized Firecrawl MCP configurations for comprehensive SEO analysis.

## Project Structure
```
yaser-mcp/
├── docs/
│   ├── README.md (this file)
│   └── firecrawl-seo-configs.js
├── src/
│   ├── seo-analyzer.js
│   └── utils/
│       └── report-generator.js
├── reports/
│   └── (generated SEO reports)
├── package.json
└── .env
```

## Setup Instructions

1. **Install Dependencies**
```bash
npm init -y
npm install @firecrawl/mcp dotenv
```

2. **Configure Environment**
Create a `.env` file in your project root:
```
FIRECRAWL_API_KEY=your_api_key_here
```

3. **Run SEO Analysis**
```bash
node src/seo-analyzer.js https://example.com
```

## Usage Examples

### Basic SEO Analysis
```javascript
const analyzer = require('./src/seo-analyzer');
analyzer.analyze('https://example.com');
```

### Batch Analysis
```javascript
const urls = [
  'https://example.com',
  'https://example.com/about',
  'https://example.com/services'
];
analyzer.batchAnalyze(urls);
```

### Custom Analysis
```javascript
const customConfig = {
  url: 'https://example.com',
  checks: ['meta', 'headings', 'images', 'performance']
};
analyzer.customAnalyze(customConfig);
```

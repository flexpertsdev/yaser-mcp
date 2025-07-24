// Quick SEO Check Script
const SEOAnalyzer = require('./seo-analyzer');
require('dotenv').config();

async function quickCheck(url) {
  const analyzer = new SEOAnalyzer(process.env.FIRECRAWL_API_KEY);
  
  try {
    const result = await analyzer.quickCheck(url);
    
    console.log('\n⚡ Quick SEO Check Results:');
    console.log('========================');
    console.log(`URL: ${url}`);
    console.log(`Title: ${result.title}`);
    console.log(`Meta Description: ${result.metaDescription}`);
    console.log(`H1 Tags: ${result.h1Count}`);
    console.log(`Images: ${result.imageCount}`);
    console.log(`Word Count: ${result.wordCount}`);
    console.log(`Quick Score: ${result.quickScore}/100`);
    
  } catch (error) {
    console.error('Quick check failed:', error);
  }
}

// CLI usage
const url = process.argv[2];
if (!url) {
  console.error('Usage: node quick-check.js <url>');
  process.exit(1);
}

quickCheck(url);
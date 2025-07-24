// Batch SEO Analyzer Script
const SEOAnalyzer = require('./seo-analyzer');
const fs = require('fs').promises;
require('dotenv').config();

async function batchAnalyze(urlsFile) {
  const analyzer = new SEOAnalyzer(process.env.FIRECRAWL_API_KEY);
  
  try {
    // Read URLs from file (one per line)
    const urlsContent = await fs.readFile(urlsFile, 'utf-8');
    const urls = urlsContent.split('\n').filter(url => url.trim());
    
    console.log(`📋 Found ${urls.length} URLs to analyze`);
    
    const report = await analyzer.batchAnalyze(urls, {
      includePerformance: false // Set to true if you want performance analysis
    });
    
    console.log('\n📊 Batch Analysis Complete:');
    console.log('==========================');
    console.log(`Total URLs: ${report.summary.totalAnalyzed}`);
    console.log(`Successful: ${report.summary.successful}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Average Score: ${report.comparison.averageScore.toFixed(1)}/100`);
    
    console.log('\n🔍 Most Common Issues:');
    report.comparison.commonIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.type} (${issue.percentage}% of pages)`);
    });
    
    console.log('\n⭐ Best Performer:');
    console.log(`URL: ${report.comparison.bestPractices.topPerformer}`);
    console.log(`Score: ${report.comparison.bestPractices.score}/100`);
    
  } catch (error) {
    console.error('Batch analysis failed:', error);
  }
}

// CLI usage
const urlsFile = process.argv[2];
if (!urlsFile) {
  console.error('Usage: node batch-analyzer.js <urls-file>');
  console.error('Create a text file with one URL per line');
  process.exit(1);
}

batchAnalyze(urlsFile);
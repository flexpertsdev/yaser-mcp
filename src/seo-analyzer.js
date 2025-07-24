// Main SEO Analyzer Implementation
const firecrawl = require('@firecrawl/mcp');
const configs = require('../docs/firecrawl-seo-configs');
const ReportGenerator = require('./utils/report-generator');
const fs = require('fs').promises;
const path = require('path');

class SEOAnalyzer {
  constructor(apiKey) {
    this.firecrawl = new firecrawl.FirecrawlApp({ apiKey });
    this.reportGenerator = new ReportGenerator();
  }

  async analyze(url, options = {}) {
    console.log(`🔍 Starting SEO analysis for: ${url}`);
    
    try {
      // Step 1: Initial comprehensive scrape
      console.log('📊 Extracting SEO metadata...');
      const initialConfig = { ...configs.initialScrapeConfig, url };
      const seoData = await this.firecrawl.scrape(initialConfig);
      
      // Step 2: Performance analysis (if requested)
      let performanceData = null;
      if (options.includePerformance) {
        console.log('⚡ Analyzing performance...');
        const perfConfig = { ...configs.performanceConfig, url };
        performanceData = await this.firecrawl.scrape(perfConfig);
      }
      
      // Step 3: Content quality analysis
      console.log('📝 Analyzing content quality...');
      const contentConfig = { ...configs.contentQualityConfig, url };
      const contentData = await this.firecrawl.scrape(contentConfig);
      
      // Step 4: Structured data extraction
      console.log('🏗️ Extracting structured data...');
      const structuredConfig = { ...configs.structuredDataConfig, url };
      const structuredData = await this.firecrawl.scrape(structuredConfig);
      
      // Compile results
      const results = this.compileResults(seoData, performanceData, contentData, structuredData);
      
      // Generate report
      const report = this.reportGenerator.generate(results, url);
      
      // Save report
      await this.saveReport(report, url);
      
      console.log('✅ SEO analysis complete!');
      return report;
      
    } catch (error) {
      console.error('❌ Error during SEO analysis:', error);
      throw error;
    }
  }

  async batchAnalyze(urls, options = {}) {
    console.log(`🔍 Starting batch SEO analysis for ${urls.length} URLs...`);
    
    const results = [];
    for (const url of urls) {
      try {
        const result = await this.analyze(url, options);
        results.push(result);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to analyze ${url}:`, error);
        results.push({ url, error: error.message });
      }
    }
    
    // Generate comparative report
    const comparativeReport = this.reportGenerator.generateComparative(results);
    await this.saveReport(comparativeReport, 'batch-analysis');
    
    return comparativeReport;
  }

  async quickCheck(url) {
    console.log(`⚡ Running quick SEO check for: ${url}`);
    
    const quickConfig = {
      url,
      formats: ['extract'],
      extract: {
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            metaDescription: { type: 'string' },
            h1: { type: 'array', items: { type: 'string' } },
            imageCount: { type: 'number' },
            wordCount: { type: 'number' }
          }
        },
        prompt: 'Extract basic SEO elements: title, meta description, H1 tags, image count, and word count'
      }
    };
    
    const result = await this.firecrawl.scrape(quickConfig);
    return this.reportGenerator.generateQuickReport(result.extract);
  }

  compileResults(seoData, performanceData, contentData, structuredData) {
    return {
      metadata: seoData.extract?.seo || {},
      social: seoData.extract?.social || {},
      headings: seoData.extract?.headings || {},
      images: seoData.extract?.images || [],
      links: seoData.extract?.links || {},
      content: {
        ...(seoData.extract?.content || {}),
        ...(contentData.extract?.contentQuality || {})
      },
      technical: {
        ...(seoData.extract?.technical || {}),
        ...(performanceData?.extract?.performance || {}),
        structuredData: structuredData.extract?.structuredData || []
      },
      timestamp: new Date().toISOString()
    };
  }

  async saveReport(report, identifier) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `seo-report-${identifier.replace(/[^a-z0-9]/gi, '-')}-${timestamp}.json`;
    const filepath = path.join(__dirname, '..', 'reports', filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Report saved: ${filename}`);
    return filepath;
  }
}

// CLI interface
if (require.main === module) {
  const url = process.argv[2];
  
  if (!url) {
    console.error('Usage: node seo-analyzer.js <url>');
    process.exit(1);
  }
  
  require('dotenv').config();
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    console.error('Error: FIRECRAWL_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  const analyzer = new SEOAnalyzer(apiKey);
  
  analyzer.analyze(url, { includePerformance: true })
    .then(report => {
      console.log('\n📊 SEO Analysis Summary:');
      console.log('========================');
      console.log(`Title: ${report.metadata.title || 'Missing'}`);
      console.log(`Meta Description: ${report.metadata.metaDescription ? '✓' : '✗'}`);
      console.log(`Images without alt: ${report.issues.images.withoutAlt || 0}`);
      console.log(`Total issues found: ${report.issues.total}`);
      console.log('\nFull report saved to reports directory');
    })
    .catch(error => {
      console.error('Analysis failed:', error);
      process.exit(1);
    });
}

module.exports = SEOAnalyzer;
// Simplified SEO Analyzer using standard Firecrawl
const FirecrawlApp = require('@mendable/firecrawl-js').default;
require('dotenv').config();

class SEOAnalyzer {
  constructor(apiKey) {
    this.firecrawl = new FirecrawlApp({ apiKey });
  }

  async analyze(url) {
    console.log(`🔍 Starting SEO analysis for: ${url}`);
    
    try {
      // Scrape with both markdown and extract formats
      const scrapeResult = await this.firecrawl.scrapeUrl(url, {
        formats: ['markdown', 'extract'],
        extract: {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              metaDescription: { type: 'string' },
              h1Tags: { type: 'array', items: { type: 'string' } },
              h2Tags: { type: 'array', items: { type: 'string' } },
              images: { 
                type: 'array', 
                items: { 
                  type: 'object',
                  properties: {
                    src: { type: 'string' },
                    alt: { type: 'string' }
                  }
                }
              },
              links: {
                type: 'array',
                items: {
                  type: 'object', 
                  properties: {
                    text: { type: 'string' },
                    url: { type: 'string' }
                  }
                }
              },
              wordCount: { type: 'number' },
              ogTags: { type: 'object' },
              twitterTags: { type: 'object' }
            }
          },
          prompt: 'Extract comprehensive SEO data including title, meta description, headings, images with alt text, links, word count, and social media tags'
        }
      });

      // Process and score the results
      const analysis = this.processResults(scrapeResult, url);
      
      console.log('✅ SEO analysis complete!');
      return analysis;
      
    } catch (error) {
      console.error('❌ Error during SEO analysis:', error);
      throw error;
    }
  }

  processResults(scrapeResult, url) {
    const extracted = scrapeResult.extract || {};
    const markdown = scrapeResult.markdown || '';
    
    // Calculate word count from markdown if not extracted
    const wordCount = extracted.wordCount || markdown.split(/\s+/).filter(word => word.length > 0).length;
    
    // Count elements
    const h1Count = (extracted.h1Tags || []).length;
    const h2Count = (extracted.h2Tags || []).length;
    const imageCount = (extracted.images || []).length;
    const linkCount = (extracted.links || []).length;
    
    // Calculate SEO score
    let score = 0;
    const recommendations = [];
    
    // Title analysis (20 points)
    if (extracted.title) {
      score += 20;
      const titleLength = extracted.title.length;
      if (titleLength < 30 || titleLength > 60) {
        recommendations.push(`Title length (${titleLength} chars) should be between 30-60 characters`);
      }
    } else {
      recommendations.push('Missing page title');
    }
    
    // Meta description analysis (20 points)
    if (extracted.metaDescription) {
      score += 20;
      const descLength = extracted.metaDescription.length;
      if (descLength < 120 || descLength > 160) {
        recommendations.push(`Meta description length (${descLength} chars) should be between 120-160 characters`);
      }
    } else {
      recommendations.push('Missing meta description');
    }
    
    // H1 analysis (20 points)
    if (h1Count === 1) {
      score += 20;
    } else if (h1Count === 0) {
      recommendations.push('Missing H1 tag');
    } else {
      recommendations.push(`Multiple H1 tags found (${h1Count}). Should have exactly one.`);
      score += 10; // Partial credit
    }
    
    // Content length analysis (20 points)
    if (wordCount >= 300) {
      score += 20;
    } else {
      recommendations.push(`Content too short (${wordCount} words). Aim for at least 300 words.`);
    }
    
    // Image analysis (20 points)
    if (imageCount > 0) {
      const imagesWithoutAlt = (extracted.images || []).filter(img => !img.alt || img.alt.trim() === '').length;
      if (imagesWithoutAlt === 0) {
        score += 20;
      } else {
        score += 10; // Partial credit
        recommendations.push(`${imagesWithoutAlt} images missing alt text`);
      }
    } else {
      recommendations.push('No images found. Consider adding relevant images.');
    }
    
    return {
      url,
      title: extracted.title || 'No title found',
      metaDescription: extracted.metaDescription || 'No meta description found',
      h1Count,
      h2Count,
      imageCount,
      linkCount,
      wordCount,
      overallScore: score,
      recommendations,
      details: {
        h1Tags: extracted.h1Tags || [],
        h2Tags: extracted.h2Tags || [],
        images: extracted.images || [],
        ogTags: extracted.ogTags || {},
        twitterTags: extracted.twitterTags || {}
      },
      analyzedAt: new Date().toISOString()
    };
  }

  async quickCheck(url) {
    console.log(`⚡ Running quick SEO check for: ${url}`);
    
    try {
      const result = await this.firecrawl.scrapeUrl(url, {
        formats: ['extract'],
        extract: {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              metaDescription: { type: 'string' },
              h1Count: { type: 'number' },
              imageCount: { type: 'number' },
              wordCount: { type: 'number' }
            }
          },
          prompt: 'Extract basic SEO metrics: title, meta description, number of H1 tags, number of images, and word count'
        }
      });

      const extracted = result.extract || {};
      let quickScore = 0;

      if (extracted.title) quickScore += 25;
      if (extracted.metaDescription) quickScore += 25;
      if (extracted.h1Count === 1) quickScore += 25;
      if (extracted.wordCount >= 300) quickScore += 25;

      return {
        url,
        title: extracted.title || 'No title',
        metaDescription: extracted.metaDescription || 'No meta description', 
        h1Count: extracted.h1Count || 0,
        imageCount: extracted.imageCount || 0,
        wordCount: extracted.wordCount || 0,
        quickScore,
        analyzedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Quick check failed:', error);
      throw error;
    }
  }
}

// Export for use as module
function analyzeSEO(url) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY not found in environment variables');
  }
  
  const analyzer = new SEOAnalyzer(apiKey);
  return analyzer.analyze(url);
}

// CLI interface
if (require.main === module) {
  const url = process.argv[2];
  
  if (!url) {
    console.error('Usage: node seo-analyzer-simple.js <url>');
    process.exit(1);
  }
  
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.error('Error: FIRECRAWL_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  const analyzer = new SEOAnalyzer(apiKey);
  
  analyzer.analyze(url)
    .then(report => {
      console.log('\n📊 SEO Analysis Summary:');
      console.log('========================');
      console.log(`URL: ${report.url}`);
      console.log(`Title: ${report.title}`);
      console.log(`Meta Description: ${report.metaDescription ? '✓' : '✗'}`);
      console.log(`H1 Count: ${report.h1Count}`);
      console.log(`Images: ${report.imageCount}`);
      console.log(`Word Count: ${report.wordCount}`);
      console.log(`Overall Score: ${report.overallScore}/100`);
      
      if (report.recommendations.length > 0) {
        console.log('\n⚠️  Recommendations:');
        report.recommendations.forEach((rec, i) => {
          console.log(`${i + 1}. ${rec}`);
        });
      }
    })
    .catch(error => {
      console.error('Analysis failed:', error);
      process.exit(1);
    });
}

module.exports = { SEOAnalyzer, analyzeSEO };
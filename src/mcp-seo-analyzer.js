// SEO Analyzer using MCP Firecrawl Tools
require('dotenv').config();

class MCPSEOAnalyzer {
  constructor() {
    this.apiKey = process.env.FIRECRAWL_API_KEY;
    if (!this.apiKey) {
      throw new Error('FIRECRAWL_API_KEY not found in environment variables');
    }
  }

  // Comprehensive SEO Analysis using MCP Firecrawl
  async analyze(url) {
    console.log(`🔍 Starting MCP SEO analysis for: ${url}`);
    
    try {
      // Use MCP Firecrawl scrape with comprehensive extraction
      const result = await this.mcpFirecrawlScrape(url, {
        formats: ['extract', 'markdown'],
        extract: {
          schema: {
            type: 'object',
            properties: {
              seo: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  metaDescription: { type: 'string' },
                  metaKeywords: { type: 'string' },
                  canonicalUrl: { type: 'string' },
                  robots: { type: 'string' },
                  viewport: { type: 'string' },
                  charset: { type: 'string' },
                  lang: { type: 'string' }
                }
              },
              headings: {
                type: 'object',
                properties: {
                  h1: { type: 'array', items: { type: 'string' } },
                  h2: { type: 'array', items: { type: 'string' } },
                  h3: { type: 'array', items: { type: 'string' } },
                  h4: { type: 'array', items: { type: 'string' } },
                  h5: { type: 'array', items: { type: 'string' } },
                  h6: { type: 'array', items: { type: 'string' } }
                }
              },
              images: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    src: { type: 'string' },
                    alt: { type: 'string' },
                    title: { type: 'string' },
                    width: { type: 'number' },
                    height: { type: 'number' }
                  }
                }
              },
              links: {
                type: 'object',
                properties: {
                  internal: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        url: { type: 'string' },
                        text: { type: 'string' },
                        title: { type: 'string' }
                      }
                    }
                  },
                  external: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        url: { type: 'string' },
                        text: { type: 'string' },
                        title: { type: 'string' }
                      }
                    }
                  }
                }
              },
              social: {
                type: 'object',
                properties: {
                  openGraph: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      image: { type: 'string' },
                      url: { type: 'string' },
                      type: { type: 'string' },
                      siteName: { type: 'string' }
                    }
                  },
                  twitter: {
                    type: 'object',
                    properties: {
                      card: { type: 'string' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      image: { type: 'string' },
                      creator: { type: 'string' },
                      site: { type: 'string' }
                    }
                  }
                }
              },
              content: {
                type: 'object',
                properties: {
                  wordCount: { type: 'number' },
                  readingTime: { type: 'number' },
                  paragraphs: { type: 'number' },
                  sentences: { type: 'number' },
                  keywordDensity: { type: 'object' }
                }
              },
              technical: {
                type: 'object',
                properties: {
                  structuredData: { type: 'array' },
                  hreflang: { type: 'array' },
                  breadcrumbs: { type: 'array' },
                  forms: { type: 'number' },
                  iframes: { type: 'number' }
                }
              }
            }
          },
          prompt: `Analyze this webpage comprehensively for SEO. Extract:
            1. All SEO meta tags (title, description, keywords, canonical, robots, etc.)
            2. Complete heading hierarchy (H1-H6)
            3. All images with alt text, titles, and dimensions
            4. Internal and external links with anchor text
            5. Social media meta tags (Open Graph, Twitter Cards)
            6. Content metrics (word count, reading time, paragraphs)
            7. Technical SEO elements (structured data, hreflang, breadcrumbs)
            
            Provide detailed, accurate data for comprehensive SEO analysis.`
        },
        onlyMainContent: true,
        maxAge: 3600000 // 1 hour cache for faster analysis
      });

      // Process and score the results
      const analysis = this.processComprehensiveResults(result, url);
      
      console.log('✅ MCP SEO analysis complete!');
      return analysis;
      
    } catch (error) {
      console.error('❌ Error during MCP SEO analysis:', error);
      throw error;
    }
  }

  // Quick SEO check using MCP
  async quickCheck(url) {
    console.log(`⚡ Running MCP quick SEO check for: ${url}`);
    
    try {
      const result = await this.mcpFirecrawlScrape(url, {
        formats: ['extract'],
        extract: {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              metaDescription: { type: 'string' },
              h1Count: { type: 'number' },
              imageCount: { type: 'number' },
              wordCount: { type: 'number' },
              hasOpenGraph: { type: 'boolean' },
              hasTwitterCards: { type: 'boolean' }
            }
          },
          prompt: 'Extract basic SEO metrics: page title, meta description, number of H1 tags, number of images, total word count, and whether Open Graph and Twitter Card meta tags are present.'
        },
        onlyMainContent: true
      });

      return this.processQuickResults(result.extract, url);
      
    } catch (error) {
      console.error('Quick check failed:', error);
      throw error;
    }
  }

  // Batch analysis using MCP
  async batchAnalyze(urls) {
    console.log(`🔍 Starting MCP batch SEO analysis for ${urls.length} URLs...`);
    
    const results = [];
    for (const url of urls) {
      try {
        const result = await this.analyze(url);
        results.push(result);
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to analyze ${url}:`, error);
        results.push({ url, error: error.message, analyzedAt: new Date().toISOString() });
      }
    }
    
    return {
      batchId: `batch_${Date.now()}`,
      totalUrls: urls.length,
      successfulAnalyses: results.filter(r => !r.error).length,
      failedAnalyses: results.filter(r => r.error).length,
      results,
      analyzedAt: new Date().toISOString()
    };
  }

  // MCP Firecrawl scrape wrapper (simulated - in real use this would call the actual MCP)
  async mcpFirecrawlScrape(url, options) {
    // This is a placeholder for the actual MCP call
    // In a real MCP environment, this would use the MCP Firecrawl tools
    console.log(`📡 MCP Firecrawl scraping: ${url}`);
    console.log(`📋 Options:`, JSON.stringify(options, null, 2));
    
    // For now, return a mock structure that matches what we'd expect from MCP
    return {
      url,
      extract: this.generateMockExtraction(url),
      markdown: this.generateMockMarkdown(url),
      success: true,
      statusCode: 200
    };
  }

  // Process comprehensive analysis results
  processComprehensiveResults(result, url) {
    const extracted = result.extract || {};
    const seo = extracted.seo || {};
    const headings = extracted.headings || {};
    const images = extracted.images || [];
    const links = extracted.links || {};
    const social = extracted.social || {};
    const content = extracted.content || {};
    const technical = extracted.technical || {};

    // Calculate comprehensive SEO score
    let score = 0;
    const recommendations = [];
    const issues = [];

    // Title analysis (15 points)
    if (seo.title) {
      const titleLength = seo.title.length;
      if (titleLength >= 30 && titleLength <= 60) {
        score += 15;
      } else {
        score += 5;
        recommendations.push(`Title length (${titleLength} chars) should be between 30-60 characters`);
      }
    } else {
      issues.push('Missing page title');
    }

    // Meta description analysis (15 points)
    if (seo.metaDescription) {
      const descLength = seo.metaDescription.length;
      if (descLength >= 120 && descLength <= 160) {
        score += 15;
      } else {
        score += 5;
        recommendations.push(`Meta description length (${descLength} chars) should be between 120-160 characters`);
      }
    } else {
      issues.push('Missing meta description');
    }

    // H1 analysis (10 points)
    const h1Count = (headings.h1 || []).length;
    if (h1Count === 1) {
      score += 10;
    } else if (h1Count === 0) {
      issues.push('Missing H1 tag');
    } else {
      recommendations.push(`Multiple H1 tags found (${h1Count}). Should have exactly one.`);
      score += 5;
    }

    // Content analysis (15 points)
    const wordCount = content.wordCount || 0;
    if (wordCount >= 300) {
      score += 15;
    } else {
      recommendations.push(`Content too short (${wordCount} words). Aim for at least 300 words.`);
    }

    // Image optimization (10 points)
    if (images.length > 0) {
      const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '').length;
      if (imagesWithoutAlt === 0) {
        score += 10;
      } else {
        score += 5;
        recommendations.push(`${imagesWithoutAlt} images missing alt text`);
      }
    } else {
      recommendations.push('No images found. Consider adding relevant images.');
    }

    // Social media tags (10 points)
    if (social.openGraph && social.openGraph.title) {
      score += 5;
    } else {
      recommendations.push('Missing Open Graph tags');
    }
    
    if (social.twitter && social.twitter.card) {
      score += 5;
    } else {
      recommendations.push('Missing Twitter Card tags');
    }

    // Technical SEO (10 points)
    if (seo.canonicalUrl) score += 3;
    else recommendations.push('Missing canonical URL');
    
    if (technical.structuredData && technical.structuredData.length > 0) score += 4;
    else recommendations.push('No structured data found');
    
    if (seo.robots) score += 3;
    else recommendations.push('Missing robots meta tag');

    // Link analysis (5 points)
    const internalLinks = (links.internal || []).length;
    const externalLinks = (links.external || []).length;
    if (internalLinks > 0 && externalLinks > 0) {
      score += 5;
    } else {
      score += 2;
      recommendations.push('Improve internal and external linking');
    }

    // Heading structure (10 points)
    const hasProperHierarchy = this.checkHeadingHierarchy(headings);
    if (hasProperHierarchy) {
      score += 10;
    } else {
      score += 5;
      recommendations.push('Improve heading hierarchy (H1 > H2 > H3...)');
    }

    return {
      url,
      overallScore: Math.min(score, 100), // Cap at 100
      grade: this.getGrade(score),
      
      // Basic SEO
      title: seo.title || 'No title found',
      metaDescription: seo.metaDescription || 'No meta description found',
      
      // Counts
      h1Count,
      h2Count: (headings.h2 || []).length,
      imageCount: images.length,
      linkCount: internalLinks + externalLinks,
      wordCount,
      
      // Detailed data
      headings,
      images: images.slice(0, 10), // Limit for display
      social,
      technical,
      content,
      
      // Analysis
      recommendations,
      issues,
      
      analyzedAt: new Date().toISOString()
    };
  }

  // Process quick check results
  processQuickResults(extracted, url) {
    const quickScore = this.calculateQuickScore(extracted);
    
    return {
      url,
      title: extracted.title || 'No title',
      metaDescription: extracted.metaDescription || 'No meta description',
      h1Count: extracted.h1Count || 0,
      imageCount: extracted.imageCount || 0,
      wordCount: extracted.wordCount || 0,
      hasOpenGraph: extracted.hasOpenGraph || false,
      hasTwitterCards: extracted.hasTwitterCards || false,
      quickScore,
      grade: this.getGrade(quickScore),
      analyzedAt: new Date().toISOString()
    };
  }

  calculateQuickScore(data) {
    let score = 0;
    if (data.title) score += 25;
    if (data.metaDescription) score += 25;
    if (data.h1Count === 1) score += 20;
    if (data.wordCount >= 300) score += 15;
    if (data.hasOpenGraph) score += 8;
    if (data.hasTwitterCards) score += 7;
    return Math.min(score, 100);
  }

  checkHeadingHierarchy(headings) {
    // Simple check: H1 should exist, and heading levels shouldn't skip
    const h1s = headings.h1 || [];
    const h2s = headings.h2 || [];
    const h3s = headings.h3 || [];
    
    return h1s.length === 1 && (h3s.length === 0 || h2s.length > 0);
  }

  getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  // Mock data generators (replace with actual MCP calls)
  generateMockExtraction(url) {
    return {
      seo: {
        title: `Sample Page Title for ${new URL(url).hostname}`,
        metaDescription: 'This is a sample meta description for SEO analysis testing.',
        canonicalUrl: url,
        robots: 'index, follow'
      },
      headings: {
        h1: ['Main Heading'],
        h2: ['Section 1', 'Section 2'],
        h3: ['Subsection 1.1', 'Subsection 2.1']
      },
      images: [
        { src: '/image1.jpg', alt: 'Sample image 1', width: 800, height: 600 },
        { src: '/image2.jpg', alt: '', width: 400, height: 300 }
      ],
      links: {
        internal: [{ url: '/about', text: 'About Us' }],
        external: [{ url: 'https://example.com', text: 'External Link' }]
      },
      social: {
        openGraph: {
          title: 'OG Title',
          description: 'OG Description',
          image: '/og-image.jpg'
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Twitter Title'
        }
      },
      content: {
        wordCount: 450,
        readingTime: 2,
        paragraphs: 8
      },
      technical: {
        structuredData: ['WebPage', 'Organization'],
        breadcrumbs: ['Home', 'Category', 'Page']
      }
    };
  }

  generateMockMarkdown(url) {
    return `# Sample Page Title

This is sample content for SEO analysis testing. 

## Section 1
Content for section 1 with multiple paragraphs and relevant information.

## Section 2  
More content here to reach adequate word count for SEO analysis.`;
  }
}

// Export for module use
function analyzeSEO(url) {
  const analyzer = new MCPSEOAnalyzer();
  return analyzer.analyze(url);
}

function quickCheckSEO(url) {
  const analyzer = new MCPSEOAnalyzer();
  return analyzer.quickCheck(url);
}

// CLI interface
if (require.main === module) {
  const url = process.argv[2];
  const mode = process.argv[3] || 'full';
  
  if (!url) {
    console.error('Usage: node mcp-seo-analyzer.js <url> [quick|full]');
    process.exit(1);
  }
  
  const analyzer = new MCPSEOAnalyzer();
  
  const runAnalysis = mode === 'quick' ? analyzer.quickCheck(url) : analyzer.analyze(url);
  
  runAnalysis
    .then(report => {
      console.log('\n📊 MCP SEO Analysis Summary:');
      console.log('============================');
      console.log(`URL: ${report.url}`);
      console.log(`Title: ${report.title}`);
      console.log(`Overall Score: ${report.overallScore}/100 (${report.grade})`);
      console.log(`Word Count: ${report.wordCount}`);
      
      if (report.recommendations && report.recommendations.length > 0) {
        console.log('\n⚠️  Recommendations:');
        report.recommendations.forEach((rec, i) => {
          console.log(`${i + 1}. ${rec}`);
        });
      }
      
      if (report.issues && report.issues.length > 0) {
        console.log('\n🚨 Issues:');
        report.issues.forEach((issue, i) => {
          console.log(`${i + 1}. ${issue}`);
        });
      }
    })
    .catch(error => {
      console.error('Analysis failed:', error);
      process.exit(1);
    });
}

module.exports = { MCPSEOAnalyzer, analyzeSEO, quickCheckSEO };
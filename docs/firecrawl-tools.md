// Optimized Firecrawl MCP configurations for comprehensive SEO analysis

// 1. INITIAL SCRAPE - Extract all SEO metadata and structure
const initialScrapeConfig = {
  url: "https://www.greshamtech.com/solutions/reconciliations",
  formats: ["markdown", "html", "links", "screenshot", "extract"],
  onlyMainContent: false, // Get full page for SEO analysis
  waitFor: 3000, // Wait for dynamic content
  includeTags: ["title", "meta", "h1", "h2", "h3", "h4", "h5", "h6", "img", "a", "script", "link", "nav", "header", "footer"],
  extract: {
    schema: {
      type: "object",
      properties: {
        // Core SEO Elements
        seo: {
          type: "object",
          properties: {
            title: { type: "string" },
            metaDescription: { type: "string" },
            metaKeywords: { type: "string" },
            canonicalUrl: { type: "string" },
            robots: { type: "string" },
            viewport: { type: "string" },
            lang: { type: "string" },
            favicon: { type: "string" }
          }
        },
        
        // Open Graph & Social
        social: {
          type: "object",
          properties: {
            ogTitle: { type: "string" },
            ogDescription: { type: "string" },
            ogImage: { type: "string" },
            ogType: { type: "string" },
            ogUrl: { type: "string" },
            twitterCard: { type: "string" },
            twitterTitle: { type: "string" },
            twitterDescription: { type: "string" },
            twitterImage: { type: "string" }
          }
        },
        
        // Heading Structure
        headings: {
          type: "object",
          properties: {
            h1: { type: "array", items: { type: "object", properties: { text: { type: "string" }, count: { type: "number" } } } },
            h2: { type: "array", items: { type: "object", properties: { text: { type: "string" }, hasKeywords: { type: "boolean" } } } },
            h3: { type: "array", items: { type: "object", properties: { text: { type: "string" }, parent: { type: "string" } } } },
            hierarchy: { type: "boolean" }
          }
        },
        
        // Image Optimization
        images: {
          type: "array",
          items: {
            type: "object",
            properties: {
              src: { type: "string" },
              alt: { type: "string" },
              title: { type: "string" },
              width: { type: "string" },
              height: { type: "string" },
              loading: { type: "string" },
              format: { type: "string" },
              fileSize: { type: "string" }
            }
          }
        },
        
        // Link Analysis
        links: {
          type: "object",
          properties: {
            internal: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  text: { type: "string" },
                  isNavigation: { type: "boolean" },
                  hasTitle: { type: "boolean" }
                }
              }
            },
            external: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  text: { type: "string" },
                  rel: { type: "string" },
                  target: { type: "string" }
                }
              }
            },
            stats: {
              type: "object",
              properties: {
                totalInternal: { type: "number" },
                totalExternal: { type: "number" },
                brokenLinks: { type: "array", items: { type: "string" } }
              }
            }
          }
        },
        
        // Content Analysis
        content: {
          type: "object",
          properties: {
            wordCount: { type: "number" },
            avgWordsPerParagraph: { type: "number" },
            readingTime: { type: "number" },
            keywordDensity: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  count: { type: "number" },
                  density: { type: "number" }
                }
              }
            }
          }
        },
        
        // Technical SEO
        technical: {
          type: "object",
          properties: {
            hasSchema: { type: "boolean" },
            schemaTypes: { type: "array", items: { type: "string" } },
            hasAMP: { type: "boolean" },
            hasSitemap: { type: "boolean" },
            hasRobotsTxt: { type: "boolean" },
            pageSpeed: { type: "object" },
            mobileOptimized: { type: "boolean" },
            https: { type: "boolean" },
            compression: { type: "boolean" }
          }
        }
      }
    },
    prompt: "Extract comprehensive SEO data including all meta tags, heading structure, image optimization details, link analysis, content metrics, and technical SEO elements. Analyze keyword usage and density. Check for structured data implementation."
  }
};

// 2. PERFORMANCE ANALYSIS - Check page speed and core web vitals
const performanceConfig = {
  url: "https://www.greshamtech.com/solutions/reconciliations",
  formats: ["screenshot@fullPage", "extract"],
  mobile: true, // Test mobile version
  timeout: 30000,
  actions: [
    { type: "wait", milliseconds: 5000 }, // Wait for full load
    { type: "screenshot", fullPage: true }
  ],
  extract: {
    schema: {
      type: "object",
      properties: {
        performance: {
          type: "object",
          properties: {
            loadTime: { type: "number" },
            domContentLoaded: { type: "number" },
            firstContentfulPaint: { type: "number" },
            largestContentfulPaint: { type: "number" },
            cumulativeLayoutShift: { type: "number" },
            totalBlockingTime: { type: "number" },
            resourceCount: { type: "number" },
            totalSize: { type: "string" }
          }
        }
      }
    },
    prompt: "Analyze page performance metrics including load times and resource usage"
  }
};

// 3. COMPETITOR ANALYSIS - Compare with competitor pages
const competitorAnalysisConfig = {
  urls: [
    "https://www.greshamtech.com/solutions/reconciliations",
    // Add competitor URLs here
  ],
  extract: {
    schema: {
      type: "object",
      properties: {
        comparison: {
          type: "array",
          items: {
            type: "object",
            properties: {
              url: { type: "string" },
              title: { type: "string" },
              metaDescription: { type: "string" },
              h1Count: { type: "number" },
              wordCount: { type: "number" },
              imageCount: { type: "number" },
              uniqueSellingPoints: { type: "array", items: { type: "string" } }
            }
          }
        }
      }
    },
    prompt: "Compare SEO elements across pages, identifying unique selling points and content gaps"
  }
};

// 4. CONTENT QUALITY ANALYSIS
const contentQualityConfig = {
  url: "https://www.greshamtech.com/solutions/reconciliations",
  formats: ["markdown", "extract"],
  onlyMainContent: true,
  extract: {
    schema: {
      type: "object",
      properties: {
        contentQuality: {
          type: "object",
          properties: {
            readabilityScore: { type: "string" },
            sentimentAnalysis: { type: "string" },
            topicRelevance: { type: "number" },
            contentFreshness: { type: "string" },
            userEngagement: {
              type: "object",
              properties: {
                hasCTA: { type: "boolean" },
                ctaCount: { type: "number" },
                interactiveElements: { type: "number" }
              }
            }
          }
        }
      }
    },
    prompt: "Analyze content quality, readability, relevance, and user engagement elements"
  }
};

// 5. STRUCTURED DATA & RICH SNIPPETS
const structuredDataConfig = {
  url: "https://www.greshamtech.com/solutions/reconciliations",
  formats: ["html", "extract"],
  includeTags: ["script"],
  extract: {
    schema: {
      type: "object",
      properties: {
        structuredData: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              properties: { type: "object" },
              isValid: { type: "boolean" }
            }
          }
        },
        richSnippetPotential: {
          type: "object",
          properties: {
            faq: { type: "boolean" },
            howTo: { type: "boolean" },
            product: { type: "boolean" },
            review: { type: "boolean" },
            breadcrumb: { type: "boolean" }
          }
        }
      }
    },
    prompt: "Extract and validate all structured data (JSON-LD, microdata) and identify rich snippet opportunities"
  }
};

// 6. BATCH ANALYSIS - Analyze multiple pages for site-wide SEO
const batchAnalysisConfig = {
  urls: [
    "https://www.greshamtech.com/solutions/reconciliations",
    "https://www.greshamtech.com/solutions/data-management",
    "https://www.greshamtech.com/solutions/regulatory-reporting"
  ],
  extract: {
    schema: {
      type: "object",
      properties: {
        siteWideSEO: {
          type: "object",
          properties: {
            consistentBranding: { type: "boolean" },
            internalLinkingStructure: { type: "string" },
            contentCannibalization: { type: "array", items: { type: "string" } },
            keywordTargeting: { type: "object" }
          }
        }
      }
    },
    prompt: "Analyze site-wide SEO consistency, internal linking, and keyword targeting across pages"
  }
};

// USAGE FUNCTION
async function performCompleteSEOAnalysis(url) {
  console.log("Starting comprehensive SEO analysis...");
  
  // Step 1: Initial comprehensive scrape
  const initialData = await firecrawl.scrape(initialScrapeConfig);
  
  // Step 2: Performance analysis
  const performanceData = await firecrawl.scrape(performanceConfig);
  
  // Step 3: Content quality
  const contentData = await firecrawl.scrape(contentQualityConfig);
  
  // Step 4: Structured data
  const structuredData = await firecrawl.scrape(structuredDataConfig);
  
  // Compile results
  return {
    seo: initialData.extract.seo,
    social: initialData.extract.social,
    headings: initialData.extract.headings,
    images: initialData.extract.images,
    links: initialData.extract.links,
    content: {
      ...initialData.extract.content,
      ...contentData.extract.contentQuality
    },
    technical: {
      ...initialData.extract.technical,
      ...performanceData.extract.performance,
      ...structuredData.extract
    },
    recommendations: generateSEORecommendations(initialData, performanceData, contentData, structuredData)
  };
}

// Helper function to generate recommendations
function generateSEORecommendations(initial, performance, content, structured) {
  const recommendations = [];
  
  // Check meta descriptions
  if (!initial.extract.seo.metaDescription || initial.extract.seo.metaDescription.length < 120) {
    recommendations.push({
      priority: "high",
      category: "meta",
      issue: "Meta description missing or too short",
      recommendation: "Add a compelling meta description between 150-160 characters"
    });
  }
  
  // Check H1 tags
  if (!initial.extract.headings.h1 || initial.extract.headings.h1.length === 0) {
    recommendations.push({
      priority: "high",
      category: "headings",
      issue: "No H1 tag found",
      recommendation: "Add a single H1 tag with primary keyword"
    });
  }
  
  // Check images
  const imagesWithoutAlt = initial.extract.images.filter(img => !img.alt);
  if (imagesWithoutAlt.length > 0) {
    recommendations.push({
      priority: "medium",
      category: "images",
      issue: `${imagesWithoutAlt.length} images without alt text`,
      recommendation: "Add descriptive alt text to all images"
    });
  }
  
  // Add more recommendation logic...
  
  return recommendations;
}

// Export configurations
module.exports = {
  initialScrapeConfig,
  performanceConfig,
  competitorAnalysisConfig,
  contentQualityConfig,
  structuredDataConfig,
  batchAnalysisConfig,
  performCompleteSEOAnalysis
};
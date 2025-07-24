export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  
  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required'
    })
  }

  try {
    console.log(`🔍 Starting MCP SEO analysis for: ${url}`)
    
    // Use the MCP Firecrawl scrape tool with comprehensive extraction
    const firecrawlResult = await $fetch('/api/mcp/firecrawl-scrape', {
      method: 'POST',
      body: {
        url,
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
                  sentences: { type: 'number' }
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
          prompt: `Analyze this webpage comprehensively for SEO. Extract all SEO meta tags, heading hierarchy, images with alt text, internal/external links, social media tags, content metrics, and technical SEO elements. Provide detailed, accurate data for comprehensive SEO analysis.`
        },
        onlyMainContent: true,
        maxAge: 3600000 // 1 hour cache
      }
    }).catch(error => {
      console.error('MCP Firecrawl call failed:', error)
      throw error
    })

    // Process the MCP result
    const analysis = processFirecrawlMCPResult(firecrawlResult, url)
    
    console.log('✅ MCP SEO analysis complete!')
    return analysis
    
  } catch (error) {
    console.error('❌ MCP SEO analysis error:', error)
    
    // Return fallback analysis
    return createFallbackAnalysis(url, error.message || 'Analysis failed')
  }
})

function processFirecrawlMCPResult(result: any, url: string) {
  const extracted = result.extract || {}
  const markdown = result.markdown || ''
  
  const seo = extracted.seo || {}
  const headings = extracted.headings || {}
  const images = extracted.images || []
  const links = extracted.links || {}
  const social = extracted.social || {}
  const content = extracted.content || {}
  const technical = extracted.technical || {}

  // Calculate comprehensive SEO score
  let score = 0
  const recommendations = []
  const issues = []

  // Title analysis (15 points)
  if (seo.title) {
    const titleLength = seo.title.length
    if (titleLength >= 30 && titleLength <= 60) {
      score += 15
    } else {
      score += 5
      recommendations.push(`Title length (${titleLength} chars) should be between 30-60 characters`)
    }
  } else {
    issues.push('Missing page title')
  }

  // Meta description analysis (15 points)
  if (seo.metaDescription) {
    const descLength = seo.metaDescription.length
    if (descLength >= 120 && descLength <= 160) {
      score += 15
    } else {
      score += 5
      recommendations.push(`Meta description length (${descLength} chars) should be between 120-160 characters`)
    }
  } else {
    issues.push('Missing meta description')
  }

  // H1 analysis (10 points)
  const h1Count = (headings.h1 || []).length
  if (h1Count === 1) {
    score += 10
  } else if (h1Count === 0) {
    issues.push('Missing H1 tag')
  } else {
    recommendations.push(`Multiple H1 tags found (${h1Count}). Should have exactly one.`)
    score += 5
  }

  // Content analysis (15 points)
  const wordCount = content.wordCount || getWordCountFromMarkdown(markdown)
  if (wordCount >= 300) {
    score += 15
  } else {
    recommendations.push(`Content too short (${wordCount} words). Aim for at least 300 words.`)
  }

  // Image optimization (10 points)
  if (images.length > 0) {
    const imagesWithoutAlt = images.filter((img: any) => !img.alt || img.alt.trim() === '').length
    if (imagesWithoutAlt === 0) {
      score += 10
    } else {
      score += 5
      recommendations.push(`${imagesWithoutAlt} images missing alt text`)
    }
  } else {
    recommendations.push('No images found. Consider adding relevant images.')
  }

  // Social media tags (10 points)
  if (social.openGraph && social.openGraph.title) {
    score += 5
  } else {
    recommendations.push('Missing Open Graph tags')
  }
  
  if (social.twitter && social.twitter.card) {
    score += 5
  } else {
    recommendations.push('Missing Twitter Card tags')
  }

  // Technical SEO (15 points)
  if (seo.canonicalUrl) score += 5
  else recommendations.push('Missing canonical URL')
  
  if (technical.structuredData && technical.structuredData.length > 0) score += 5
  else recommendations.push('No structured data found')
  
  if (seo.robots) score += 5
  else recommendations.push('Missing robots meta tag')

  // Link analysis (10 points)
  const internalLinks = (links.internal || []).length
  const externalLinks = (links.external || []).length
  if (internalLinks > 0 && externalLinks > 0) {
    score += 10
  } else {
    score += 5
    recommendations.push('Improve internal and external linking')
  }

  return {
    url,
    overallScore: Math.min(score, 100),
    grade: getGrade(score),
    
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
    links: {
      internal: (links.internal || []).slice(0, 5),
      external: (links.external || []).slice(0, 5)
    },
    
    // Analysis
    recommendations,
    issues,
    
    // Metadata
    mcpPowered: true,
    extractionSchema: 'comprehensive-seo-v1',
    analyzedAt: new Date().toISOString()
  }
}

function createFallbackAnalysis(url: string, errorMessage: string) {
  return {
    url,
    title: 'Analysis unavailable',
    metaDescription: 'Could not analyze this URL with MCP tools',
    overallScore: 0,
    grade: 'F',
    h1Count: 0,
    h2Count: 0,
    imageCount: 0,
    linkCount: 0,
    wordCount: 0,
    recommendations: [`Unable to analyze this website: ${errorMessage}`, 'Please check the URL and try again'],
    issues: ['MCP analysis failed'],
    headings: {},
    images: [],
    social: {},
    technical: {},
    content: {},
    links: { internal: [], external: [] },
    mcpPowered: false,
    analyzedAt: new Date().toISOString()
  }
}

function getWordCountFromMarkdown(markdown: string): number {
  if (!markdown) return 0
  return markdown.split(/\s+/).filter(word => word.length > 0).length
}

function getGrade(score: number): string {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}
import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  
  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required'
    })
  }

  try {
    // Use the MCP Firecrawl scrape function
    const firecrawlData = await $fetch('http://localhost:3001/mcp/firecrawl_scrape', {
      method: 'POST',
      body: {
        url,
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        maxAge: 3600000 // 1 hour cache
      }
    }).catch(() => {
      // Fallback: use the existing analyzer
      return useFirecrawlAnalyzer(url)
    })

    // Process the data using our existing analyzer logic
    const analysis = await processFirecrawlData(firecrawlData, url)
    
    return analysis
  } catch (error) {
    console.error('Analysis error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to analyze the website'
    })
  }
})

async function useFirecrawlAnalyzer(url: string) {
  // Import and use our existing analyzer
  const analyzerPath = join(process.cwd(), 'src', 'seo-analyzer.js')
  
  try {
    // Dynamic import of the analyzer
    const { analyzeSEO } = await import(analyzerPath)
    return await analyzeSEO(url)
  } catch (error) {
    // Basic fallback analysis
    return {
      url,
      title: 'Analysis unavailable',
      metaDescription: 'Could not analyze this URL',
      overallScore: 0,
      recommendations: ['Unable to analyze this website. Please check the URL and try again.']
    }
  }
}

async function processFirecrawlData(data: any, url: string) {
  const content = data.markdown || data.content || ''
  const html = data.html || ''
  
  // Extract basic SEO information
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : ''
  
  const metaDescMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : ''
  
  // Count elements
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length
  const imageCount = (html.match(/<img[^>]*>/gi) || []).length
  const linkCount = (html.match(/<a[^>]*href/gi) || []).length
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
  
  // Calculate score
  let score = 0
  const recommendations = []
  
  if (title) {
    score += 20
    if (title.length < 30 || title.length > 60) {
      recommendations.push(`Title length (${title.length} chars) should be between 30-60 characters`)
    }
  } else {
    recommendations.push('Missing page title')
  }
  
  if (metaDescription) {
    score += 20
    if (metaDescription.length < 120 || metaDescription.length > 160) {
      recommendations.push(`Meta description length (${metaDescription.length} chars) should be between 120-160 characters`)
    }
  } else {
    recommendations.push('Missing meta description')
  }
  
  if (h1Count === 1) {
    score += 20
  } else if (h1Count === 0) {
    recommendations.push('Missing H1 tag')
  } else {
    recommendations.push(`Multiple H1 tags found (${h1Count}). Should have exactly one.`)
  }
  
  if (wordCount > 300) {
    score += 20
  } else {
    recommendations.push(`Content too short (${wordCount} words). Aim for at least 300 words.`)
  }
  
  if (imageCount > 0) {
    score += 20
  } else {
    recommendations.push('No images found. Consider adding relevant images.')
  }
  
  return {
    url,
    title,
    metaDescription,
    h1Count,
    imageCount,
    linkCount,
    wordCount,
    overallScore: score,
    recommendations,
    analyzedAt: new Date().toISOString()
  }
}
// Report Generator Utility
class ReportGenerator {
  generate(data, url) {
    const issues = this.identifyIssues(data);
    const score = this.calculateSEOScore(data, issues);
    const recommendations = this.generateRecommendations(data, issues);
    
    return {
      url,
      timestamp: data.timestamp,
      score: {
        overall: score.overall,
        breakdown: score.breakdown
      },
      metadata: data.metadata,
      social: data.social,
      headings: this.analyzeHeadings(data.headings),
      images: this.analyzeImages(data.images),
      links: data.links,
      content: data.content,
      technical: data.technical,
      issues: {
        critical: issues.critical,
        warnings: issues.warnings,
        suggestions: issues.suggestions,
        total: issues.critical.length + issues.warnings.length + issues.suggestions.length
      },
      recommendations: recommendations
    };
  }

  generateQuickReport(data) {
    return {
      title: data.title || 'Missing',
      metaDescription: data.metaDescription || 'Missing',
      h1Count: data.h1?.length || 0,
      imageCount: data.imageCount || 0,
      wordCount: data.wordCount || 0,
      quickScore: this.calculateQuickScore(data)
    };
  }

  generateComparative(results) {
    const validResults = results.filter(r => !r.error);
    
    return {
      summary: {
        totalAnalyzed: results.length,
        successful: validResults.length,
        failed: results.length - validResults.length
      },
      comparison: {
        averageScore: this.calculateAverageScore(validResults),
        commonIssues: this.findCommonIssues(validResults),
        bestPractices: this.identifyBestPractices(validResults)
      },
      pages: results
    };
  }

  identifyIssues(data) {
    const issues = {
      critical: [],
      warnings: [],
      suggestions: []
    };

    // Critical issues
    if (!data.metadata.title) {
      issues.critical.push({
        type: 'missing_title',
        message: 'Page title is missing',
        impact: 'high'
      });
    }

    if (!data.metadata.metaDescription) {
      issues.critical.push({
        type: 'missing_meta_description',
        message: 'Meta description is missing',
        impact: 'high'
      });
    }

    if (!data.headings.h1 || data.headings.h1.length === 0) {
      issues.critical.push({
        type: 'missing_h1',
        message: 'No H1 tag found on the page',
        impact: 'high'
      });
    }

    // Warnings
    if (data.metadata.metaDescription && data.metadata.metaDescription.length < 120) {
      issues.warnings.push({
        type: 'short_meta_description',
        message: `Meta description too short (${data.metadata.metaDescription.length} chars)`,
        impact: 'medium'
      });
    }

    if (data.headings.h1 && data.headings.h1.length > 1) {
      issues.warnings.push({
        type: 'multiple_h1',
        message: `Multiple H1 tags found (${data.headings.h1.length})`,
        impact: 'medium'
      });
    }

    // Image issues
    const imagesWithoutAlt = data.images.filter(img => !img.alt).length;
    if (imagesWithoutAlt > 0) {
      issues.warnings.push({
        type: 'missing_alt_text',
        message: `${imagesWithoutAlt} images missing alt text`,
        impact: 'medium'
      });
    }

    // Suggestions
    if (data.content.wordCount < 300) {
      issues.suggestions.push({
        type: 'thin_content',
        message: `Content is thin (${data.content.wordCount} words)`,
        impact: 'low'
      });
    }

    if (!data.technical.structuredData || data.technical.structuredData.length === 0) {
      issues.suggestions.push({
        type: 'no_structured_data',
        message: 'No structured data found',
        impact: 'low'
      });
    }

    return issues;
  }

  calculateSEOScore(data, issues) {
    let score = 100;
    const breakdown = {
      metadata: 25,
      content: 25,
      technical: 25,
      user_experience: 25
    };

    // Deduct for critical issues
    score -= issues.critical.length * 10;
    breakdown.metadata -= issues.critical.filter(i => i.type.includes('meta') || i.type.includes('title')).length * 5;

    // Deduct for warnings
    score -= issues.warnings.length * 5;
    
    // Deduct for suggestions
    score -= issues.suggestions.length * 2;

    // Content score adjustments
    if (data.content.wordCount < 300) breakdown.content -= 10;
    if (data.content.wordCount < 100) breakdown.content -= 15;

    // Technical score adjustments
    if (!data.technical.https) breakdown.technical -= 10;
    if (!data.technical.mobileOptimized) breakdown.technical -= 10;

    return {
      overall: Math.max(0, score),
      breakdown: {
        metadata: Math.max(0, breakdown.metadata),
        content: Math.max(0, breakdown.content),
        technical: Math.max(0, breakdown.technical),
        userExperience: Math.max(0, breakdown.user_experience)
      }
    };
  }

  generateRecommendations(data, issues) {
    const recommendations = [];

    // Priority 1: Critical fixes
    issues.critical.forEach(issue => {
      switch(issue.type) {
        case 'missing_title':
          recommendations.push({
            priority: 1,
            action: 'Add a unique, descriptive page title (50-60 characters)',
            impact: 'Critical for search visibility'
          });
          break;
        case 'missing_meta_description':
          recommendations.push({
            priority: 1,
            action: 'Write a compelling meta description (150-160 characters)',
            impact: 'Improves click-through rates from search results'
          });
          break;
        case 'missing_h1':
          recommendations.push({
            priority: 1,
            action: 'Add a single H1 tag with your primary keyword',
            impact: 'Essential for content hierarchy and SEO'
          });
          break;
      }
    });

    // Priority 2: Important improvements
    if (data.images.filter(img => !img.alt).length > 0) {
      recommendations.push({
        priority: 2,
        action: 'Add descriptive alt text to all images',
        impact: 'Improves accessibility and image search visibility'
      });
    }

    if (data.content.wordCount < 300) {
      recommendations.push({
        priority: 2,
        action: 'Expand content to at least 300-500 words',
        impact: 'Provides more context for search engines'
      });
    }

    // Priority 3: Nice to have
    if (!data.technical.structuredData || data.technical.structuredData.length === 0) {
      recommendations.push({
        priority: 3,
        action: 'Implement structured data (Schema.org)',
        impact: 'Enables rich snippets in search results'
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  analyzeHeadings(headings) {
    return {
      h1: headings.h1 || [],
      h2: headings.h2 || [],
      h3: headings.h3 || [],
      hierarchy: this.checkHeadingHierarchy(headings),
      keywordUsage: this.analyzeKeywordUsageInHeadings(headings)
    };
  }

  analyzeImages(images) {
    const analysis = {
      total: images.length,
      withoutAlt: images.filter(img => !img.alt).length,
      withoutDimensions: images.filter(img => !img.width || !img.height).length,
      lazyLoaded: images.filter(img => img.loading === 'lazy').length,
      formats: {}
    };

    images.forEach(img => {
      const format = img.format || 'unknown';
      analysis.formats[format] = (analysis.formats[format] || 0) + 1;
    });

    return analysis;
  }

  checkHeadingHierarchy(headings) {
    // Check if headings follow proper hierarchy (H1 -> H2 -> H3)
    return {
      isValid: true, // Simplified for now
      issues: []
    };
  }

  analyzeKeywordUsageInHeadings(headings) {
    // Analyze keyword usage in headings
    return {
      primaryKeywordInH1: false, // Would need keyword input
      keywordDistribution: {}
    };
  }

  calculateQuickScore(data) {
    let score = 0;
    if (data.title) score += 25;
    if (data.metaDescription) score += 25;
    if (data.h1 && data.h1.length === 1) score += 25;
    if (data.wordCount >= 300) score += 25;
    return score;
  }

  calculateAverageScore(results) {
    const scores = results.map(r => r.score?.overall || 0);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  findCommonIssues(results) {
    const issueMap = {};
    
    results.forEach(result => {
      if (result.issues) {
        [...result.issues.critical, ...result.issues.warnings].forEach(issue => {
          issueMap[issue.type] = (issueMap[issue.type] || 0) + 1;
        });
      }
    });

    return Object.entries(issueMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count, percentage: (count / results.length * 100).toFixed(1) }));
  }

  identifyBestPractices(results) {
    const bestScore = Math.max(...results.map(r => r.score?.overall || 0));
    const bestPage = results.find(r => r.score?.overall === bestScore);
    
    return {
      topPerformer: bestPage?.url,
      score: bestScore,
      strengths: this.extractStrengths(bestPage)
    };
  }

  extractStrengths(page) {
    if (!page) return [];
    
    const strengths = [];
    if (page.metadata?.title && page.metadata?.metaDescription) {
      strengths.push('Complete metadata');
    }
    if (page.headings?.h1?.length === 1) {
      strengths.push('Proper H1 usage');
    }
    if (page.technical?.structuredData?.length > 0) {
      strengths.push('Structured data implementation');
    }
    return strengths;
  }
}

module.exports = ReportGenerator;
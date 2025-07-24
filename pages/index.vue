<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="hero-gradient text-white py-20">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-5xl font-bold mb-6">
          SEO Analyzer
        </h1>
        <p class="text-xl mb-8 opacity-90">
          Analyze any website for SEO optimization opportunities with Firecrawl
        </p>
        
        <!-- URL Input Form -->
        <div class="max-w-2xl mx-auto">
          <UForm @submit="analyzeUrl" class="flex gap-4">
            <UInput
              v-model="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              size="lg"
              class="flex-1"
              :loading="isLoading"
            />
            <UButton 
              type="submit" 
              size="lg" 
              :loading="isLoading"
              :disabled="!url || isLoading"
            >
              Analyze
            </UButton>
          </UForm>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="container mx-auto px-6 py-12">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="pulse-animation mb-4">
          🔍
        </div>
        <p class="text-lg text-gray-600">Analyzing your website...</p>
      </div>

      <!-- Error State -->
      <UAlert
        v-if="error"
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="solid"
        :title="error"
        class="mb-8"
      />

      <!-- Results -->
      <div v-if="results && !isLoading" class="space-y-8">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <UCard class="card-hover">
            <div class="text-center">
              <div class="text-3xl font-bold" :class="getScoreColor(results.overallScore)">
                {{ results.overallScore }}/100
              </div>
              <div class="text-gray-600 mt-2">Overall Score</div>
            </div>
          </UCard>
          
          <UCard class="card-hover">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">
                {{ results.wordCount || 0 }}
              </div>
              <div class="text-gray-600 mt-2">Words</div>
            </div>
          </UCard>
          
          <UCard class="card-hover">
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">
                {{ results.imageCount || 0 }}
              </div>
              <div class="text-gray-600 mt-2">Images</div>
            </div>
          </UCard>
          
          <UCard class="card-hover">
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">
                {{ results.linkCount || 0 }}
              </div>
              <div class="text-gray-600 mt-2">Links</div>
            </div>
          </UCard>
        </div>

        <!-- SEO Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Basic SEO -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Basic SEO</h3>
            </template>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p class="text-gray-900 bg-gray-50 p-3 rounded">{{ results.title || 'No title found' }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ (results.title || '').length }} characters</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <p class="text-gray-900 bg-gray-50 p-3 rounded">{{ results.metaDescription || 'No meta description found' }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ (results.metaDescription || '').length }} characters</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">H1 Tags</label>
                <div v-if="results.h1Count">
                  <p class="text-green-600">✓ {{ results.h1Count }} H1 tag(s) found</p>
                </div>
                <div v-else>
                  <p class="text-red-600">⚠ No H1 tags found</p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Recommendations -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold">Recommendations</h3>
            </template>
            
            <div class="space-y-3">
              <div v-for="(recommendation, index) in results.recommendations" :key="index" class="flex items-start space-x-3">
                <div class="text-yellow-500 mt-1">⚠</div>
                <p class="text-gray-700">{{ recommendation }}</p>
              </div>
              
              <div v-if="!results.recommendations || results.recommendations.length === 0">
                <div class="flex items-center space-x-3">
                  <div class="text-green-500">✓</div>
                  <p class="text-gray-700">Great job! No major issues found.</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Raw Data (Collapsible) -->
        <UCard>
          <template #header>
            <button 
              @click="showRawData = !showRawData"
              class="flex items-center justify-between w-full text-left"
            >
              <h3 class="text-xl font-semibold">Raw Analysis Data</h3>
              <UIcon :name="showRawData ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
            </button>
          </template>
          
          <div v-if="showRawData">
            <pre class="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto max-h-96">{{ JSON.stringify(results, null, 2) }}</pre>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const url = ref('')
const isLoading = ref(false)
const results = ref(null)
const error = ref('')
const showRawData = ref(false)

const analyzeUrl = async () => {
  if (!url.value) return
  
  isLoading.value = true
  error.value = ''
  results.value = null
  
  try {
    const response = await $fetch('/api/analyze', {
      method: 'POST',
      body: { url: url.value }
    })
    
    results.value = response
  } catch (err) {
    error.value = err.data?.message || 'Failed to analyze the website. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const getScoreColor = (score) => {
  if (score >= 80) return 'seo-score-excellent'
  if (score >= 60) return 'seo-score-good'
  return 'seo-score-poor'
}

// SEO Meta
useHead({
  title: 'SEO Analyzer - Optimize Your Website',
  meta: [
    { name: 'description', content: 'Analyze any website for SEO optimization opportunities with our powerful Firecrawl-powered tool.' }
  ]
})
</script>
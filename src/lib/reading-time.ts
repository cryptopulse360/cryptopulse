import readingTime from 'reading-time'

export interface ReadingTimeResult {
  minutes: number
  words: number
  text: string
}

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(content: string): ReadingTimeResult {
  const result = readingTime(content)
  
  return {
    minutes: Math.ceil(result.minutes),
    words: result.words,
    text: result.text
  }
}

/**
 * Calculate reading time with custom words per minute
 */
export function calculateReadingTimeCustom(
  content: string, 
  wordsPerMinute: number = 200
): ReadingTimeResult {
  const result = readingTime(content, { wordsPerMinute })
  
  return {
    minutes: Math.ceil(result.minutes),
    words: result.words,
    text: result.text
  }
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return 'Less than 1 min read'
  }
  
  if (minutes === 1) {
    return '1 min read'
  }
  
  return `${minutes} min read`
}

/**
 * Get reading time category
 */
export function getReadingTimeCategory(minutes: number): 'quick' | 'medium' | 'long' {
  if (minutes <= 3) return 'quick'
  if (minutes <= 10) return 'medium'
  return 'long'
}

/**
 * Calculate reading time for multiple content sections
 */
export function calculateTotalReadingTime(contentSections: string[]): ReadingTimeResult {
  const totalContent = contentSections.join(' ')
  return calculateReadingTime(totalContent)
}

/**
 * Estimate reading time based on word count
 */
export function estimateReadingTimeFromWordCount(
  wordCount: number,
  wordsPerMinute: number = 200
): ReadingTimeResult {
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  const text = formatReadingTime(minutes)
  
  return {
    minutes,
    words: wordCount,
    text
  }
}
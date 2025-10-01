import { describe, it, expect } from 'vitest'
import {
  calculateReadingTime,
  calculateReadingTimeCustom,
  formatReadingTime,
  getReadingTimeCategory,
  calculateTotalReadingTime,
  estimateReadingTimeFromWordCount
} from '../reading-time'

describe('Reading Time Utilities', () => {
  describe('calculateReadingTime', () => {
    it('should calculate reading time for short content', () => {
      const content = 'This is a short piece of content with just a few words.'
      
      const result = calculateReadingTime(content)
      
      expect(result.minutes).toBe(1)
      expect(result.words).toBe(12)
      expect(result.text).toContain('1 min read')
    })

    it('should calculate reading time for longer content', () => {
      // Create content with approximately 400 words (2 minutes at 200 wpm)
      const words = Array(400).fill('word').join(' ')
      
      const result = calculateReadingTime(words)
      
      expect(result.minutes).toBe(2)
      expect(result.words).toBe(400)
    })

    it('should round up partial minutes', () => {
      // Create content with approximately 250 words (1.25 minutes at 200 wpm)
      const words = Array(250).fill('word').join(' ')
      
      const result = calculateReadingTime(words)
      
      expect(result.minutes).toBe(2) // Should round up from 1.25
    })
  })

  describe('calculateReadingTimeCustom', () => {
    it('should use custom words per minute', () => {
      const words = Array(300).fill('word').join(' ')
      
      const result = calculateReadingTimeCustom(words, 300) // 300 wpm instead of default 200
      
      expect(result.minutes).toBe(1) // 300 words at 300 wpm = 1 minute
    })

    it('should default to 200 wpm when not specified', () => {
      const words = Array(200).fill('word').join(' ')
      
      const result = calculateReadingTimeCustom(words)
      
      expect(result.minutes).toBe(1)
    })
  })

  describe('formatReadingTime', () => {
    it('should format less than 1 minute', () => {
      expect(formatReadingTime(0)).toBe('Less than 1 min read')
      expect(formatReadingTime(0.5)).toBe('Less than 1 min read')
    })

    it('should format exactly 1 minute', () => {
      expect(formatReadingTime(1)).toBe('1 min read')
    })

    it('should format multiple minutes', () => {
      expect(formatReadingTime(2)).toBe('2 min read')
      expect(formatReadingTime(5)).toBe('5 min read')
      expect(formatReadingTime(15)).toBe('15 min read')
    })
  })

  describe('getReadingTimeCategory', () => {
    it('should categorize quick reads', () => {
      expect(getReadingTimeCategory(1)).toBe('quick')
      expect(getReadingTimeCategory(3)).toBe('quick')
    })

    it('should categorize medium reads', () => {
      expect(getReadingTimeCategory(4)).toBe('medium')
      expect(getReadingTimeCategory(7)).toBe('medium')
      expect(getReadingTimeCategory(10)).toBe('medium')
    })

    it('should categorize long reads', () => {
      expect(getReadingTimeCategory(11)).toBe('long')
      expect(getReadingTimeCategory(20)).toBe('long')
    })
  })

  describe('calculateTotalReadingTime', () => {
    it('should calculate total reading time for multiple sections', () => {
      const sections = [
        Array(100).fill('word').join(' '), // ~0.5 minutes
        Array(100).fill('word').join(' '), // ~0.5 minutes
        Array(100).fill('word').join(' ')  // ~0.5 minutes
      ]
      
      const result = calculateTotalReadingTime(sections)
      
      expect(result.words).toBe(300)
      expect(result.minutes).toBe(2) // Should round up from 1.5
    })

    it('should handle empty sections', () => {
      const sections = ['', 'Some content here', '']
      
      const result = calculateTotalReadingTime(sections)
      
      expect(result.words).toBe(3)
      expect(result.minutes).toBe(1)
    })
  })

  describe('estimateReadingTimeFromWordCount', () => {
    it('should estimate reading time from word count', () => {
      const result = estimateReadingTimeFromWordCount(400)
      
      expect(result.minutes).toBe(2)
      expect(result.words).toBe(400)
      expect(result.text).toBe('2 min read')
    })

    it('should use custom words per minute', () => {
      const result = estimateReadingTimeFromWordCount(300, 300)
      
      expect(result.minutes).toBe(1)
      expect(result.words).toBe(300)
    })

    it('should round up partial minutes', () => {
      const result = estimateReadingTimeFromWordCount(250) // 1.25 minutes at 200 wpm
      
      expect(result.minutes).toBe(2)
    })

    it('should handle very small word counts', () => {
      const result = estimateReadingTimeFromWordCount(10)
      
      expect(result.minutes).toBe(1) // Should be at least 1 minute
    })
  })
})
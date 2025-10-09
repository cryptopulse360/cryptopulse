import { describe, it, expect } from 'vitest'
import { extractTableOfContents, generateHeadingId, shouldShowTableOfContents } from '../toc'

describe('toc utilities', () => {
  describe('generateHeadingId', () => {
    it('should convert text to URL-friendly ID', () => {
      expect(generateHeadingId('Introduction to Bitcoin')).toBe('introduction-to-bitcoin')
      expect(generateHeadingId('What is DeFi?')).toBe('what-is-defi')
      expect(generateHeadingId('Market Analysis & Trends')).toBe('market-analysis-trends')
      expect(generateHeadingId('  Spaced   Text  ')).toBe('spaced-text')
    })

    it('should handle special characters', () => {
      expect(generateHeadingId('Price: $50,000+')).toBe('price-50000')
      expect(generateHeadingId('100% Gains!')).toBe('100-gains')
      expect(generateHeadingId('(Important) Note')).toBe('important-note')
    })

    it('should handle empty or whitespace-only text', () => {
      expect(generateHeadingId('')).toBe('')
      expect(generateHeadingId('   ')).toBe('')
    })
  })

  describe('extractTableOfContents', () => {
    it('should extract headings from MDX content', () => {
      const content = `
# Introduction

Some content here.

## Market Overview

More content.

### Bitcoin Analysis

Detailed analysis.

## Conclusion

Final thoughts.
      `

      const toc = extractTableOfContents(content)
      
      expect(toc).toHaveLength(4)
      expect(toc[0]).toEqual({
        id: 'introduction',
        title: 'Introduction',
        level: 1,
      })
      expect(toc[1]).toEqual({
        id: 'market-overview',
        title: 'Market Overview',
        level: 2,
      })
      expect(toc[2]).toEqual({
        id: 'bitcoin-analysis',
        title: 'Bitcoin Analysis',
        level: 3,
      })
      expect(toc[3]).toEqual({
        id: 'conclusion',
        title: 'Conclusion',
        level: 2,
      })
    })

    it('should handle content without headings', () => {
      const content = 'Just some regular content without headings.'
      const toc = extractTableOfContents(content)
      expect(toc).toHaveLength(0)
    })

    it('should handle mixed heading levels', () => {
      const content = `
#### Deep Dive
## Overview
##### Details
# Main Topic
      `

      const toc = extractTableOfContents(content)
      
      expect(toc).toHaveLength(4)
      expect(toc[0].level).toBe(4)
      expect(toc[1].level).toBe(2)
      expect(toc[2].level).toBe(5)
      expect(toc[3].level).toBe(1)
    })
  })

  describe('shouldShowTableOfContents', () => {
    it('should return true for 3 or more headings', () => {
      const toc = [
        { id: '1', title: 'One', level: 1 },
        { id: '2', title: 'Two', level: 2 },
        { id: '3', title: 'Three', level: 2 },
      ]
      expect(shouldShowTableOfContents(toc)).toBe(true)
    })

    it('should return false for less than 3 headings', () => {
      const toc = [
        { id: '1', title: 'One', level: 1 },
        { id: '2', title: 'Two', level: 2 },
      ]
      expect(shouldShowTableOfContents(toc)).toBe(false)
    })

    it('should return false for empty TOC', () => {
      expect(shouldShowTableOfContents([])).toBe(false)
    })
  })
})
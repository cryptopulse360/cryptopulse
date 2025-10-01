import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { mdxComponents } from '../MDXComponents'

describe('MDX Components', () => {
  describe('Heading components', () => {
    it('should render h1 with generated ID', () => {
      const H1 = mdxComponents.h1
      render(<H1>Introduction to Bitcoin</H1>)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveAttribute('id', 'introduction-to-bitcoin')
      expect(heading).toHaveTextContent('Introduction to Bitcoin')
    })

    it('should render h2 with generated ID', () => {
      const H2 = mdxComponents.h2
      render(<H2>Market Analysis</H2>)
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveAttribute('id', 'market-analysis')
      expect(heading).toHaveTextContent('Market Analysis')
    })

    it('should handle special characters in heading text', () => {
      const H3 = mdxComponents.h3
      render(<H3>What is DeFi?</H3>)
      
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveAttribute('id', 'what-is-defi')
    })
  })

  describe('Link component', () => {
    it('should render internal links normally', () => {
      const Link = mdxComponents.a
      render(<Link href="/internal-page">Internal Link</Link>)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/internal-page')
      expect(link).not.toHaveAttribute('target')
      expect(link).not.toHaveAttribute('rel')
    })

    it('should render external links with target and rel attributes', () => {
      const Link = mdxComponents.a
      render(<Link href="https://example.com">External Link</Link>)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Blockquote component', () => {
    it('should render blockquote with custom styling', () => {
      const Blockquote = mdxComponents.blockquote
      render(<Blockquote>This is a quote</Blockquote>)
      
      const blockquote = screen.getByText('This is a quote')
      expect(blockquote.tagName).toBe('BLOCKQUOTE')
      expect(blockquote).toHaveClass('border-l-4', 'border-blue-500')
    })
  })

  describe('Code components', () => {
    it('should render inline code with styling', () => {
      const Code = mdxComponents.code
      render(<Code>const x = 1</Code>)
      
      const code = screen.getByText('const x = 1')
      expect(code.tagName).toBe('CODE')
      expect(code).toHaveClass('rounded', 'bg-gray-100', 'text-pink-600')
    })

    it('should render code blocks with styling', () => {
      const Pre = mdxComponents.pre
      render(
        <Pre>
          <code>console.log('Hello World')</code>
        </Pre>
      )
      
      const pre = screen.getByText("console.log('Hello World')").parentElement
      expect(pre?.tagName).toBe('PRE')
      expect(pre).toHaveClass('overflow-x-auto', 'rounded-lg', 'bg-gray-900')
    })
  })

  describe('Image component', () => {
    it('should render image with Next.js Image component', () => {
      const Img = mdxComponents.img
      render(<Img src="/test-image.jpg" alt="Test image" />)
      
      // Next.js Image component renders as img tag in test environment
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'Test image')
    })

    it('should handle missing src gracefully', () => {
      const Img = mdxComponents.img
      const { container } = render(<Img alt="Test image" />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should provide default alt text when missing', () => {
      const Img = mdxComponents.img
      render(<Img src="/test-image.jpg" />)
      
      const image = screen.getByRole('presentation')
      expect(image).toHaveAttribute('alt', '')
    })
  })
})
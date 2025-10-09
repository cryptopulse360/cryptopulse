import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TableOfContents } from '../TableOfContents'
import { TocItem } from '@/lib/toc'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})
window.IntersectionObserver = mockIntersectionObserver

// Mock scrollIntoView
const mockScrollIntoView = vi.fn()
Element.prototype.scrollIntoView = mockScrollIntoView

describe('TableOfContents', () => {
  const mockTocItems: TocItem[] = [
    { id: 'introduction', title: 'Introduction', level: 1 },
    { id: 'market-overview', title: 'Market Overview', level: 2 },
    { id: 'bitcoin-analysis', title: 'Bitcoin Analysis', level: 3 },
    { id: 'conclusion', title: 'Conclusion', level: 2 },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock getElementById
    document.getElementById = vi.fn((id) => {
      const mockElement = document.createElement('div')
      mockElement.id = id
      return mockElement
    })
  })

  it('should render table of contents with all items', () => {
    render(<TableOfContents items={mockTocItems} />)
    
    expect(screen.getByText('Table of Contents')).toBeInTheDocument()
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Market Overview')).toBeInTheDocument()
    expect(screen.getByText('Bitcoin Analysis')).toBeInTheDocument()
    expect(screen.getByText('Conclusion')).toBeInTheDocument()
  })

  it('should render nothing when items array is empty', () => {
    const { container } = render(<TableOfContents items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should handle click events and scroll to sections', () => {
    render(<TableOfContents items={mockTocItems} />)
    
    const introductionButton = screen.getByText('Introduction')
    fireEvent.click(introductionButton)
    
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })

  it('should apply correct indentation classes based on heading level', () => {
    render(<TableOfContents items={mockTocItems} />)
    
    const buttons = screen.getAllByRole('button')
    
    // Level 1 heading (Introduction) should have no left padding
    expect(buttons[0]).toHaveClass('pl-0')
    
    // Level 2 headings should have pl-3
    expect(buttons[1]).toHaveClass('pl-3') // Market Overview
    expect(buttons[3]).toHaveClass('pl-3') // Conclusion
    
    // Level 3 heading should have pl-6
    expect(buttons[2]).toHaveClass('pl-6') // Bitcoin Analysis
  })

  it('should set up IntersectionObserver for all headings', () => {
    render(<TableOfContents items={mockTocItems} />)
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    )
  })

  it('should apply custom className when provided', () => {
    const { container } = render(
      <TableOfContents items={mockTocItems} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle missing DOM elements gracefully', () => {
    document.getElementById = vi.fn(() => null)
    
    expect(() => {
      render(<TableOfContents items={mockTocItems} />)
    }).not.toThrow()
  })
})
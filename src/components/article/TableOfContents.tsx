'use client'

import React, { useState, useEffect } from 'react'
import { TocItem } from '@/lib/toc'
import { cn } from '@/lib/utils'

interface TableOfContentsProps {
  items: TocItem[]
  className?: string
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    )

    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [items])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <nav className={cn('space-y-1', className)} aria-label="Table of contents">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Table of Contents
      </h3>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                'block w-full text-left transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                activeId === item.id 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400',
                item.level === 1 && 'pl-0',
                item.level === 2 && 'pl-3',
                item.level === 3 && 'pl-6',
                item.level === 4 && 'pl-9',
                item.level === 5 && 'pl-12',
                item.level === 6 && 'pl-15'
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
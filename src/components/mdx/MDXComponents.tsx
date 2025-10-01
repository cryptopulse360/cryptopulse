import React from 'react'
import Image from 'next/image'
import { generateHeadingId } from '@/lib/toc'

// Custom heading components that automatically add IDs
const createHeading = (level: number) => {
  const HeadingComponent = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof children === 'string' ? children : ''
    const id = generateHeadingId(text)
    
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    
    return React.createElement(
      Tag,
      { id, ...props },
      children
    )
  }
  
  HeadingComponent.displayName = `Heading${level}`
  return HeadingComponent
}

// Custom image component with Next.js optimization
const MDXImage = ({ src, alt, width, height, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  if (!src) return null
  
  return (
    <Image
      src={src}
      alt={alt || ''}
      width={typeof width === 'string' ? parseInt(width) : width || 800}
      height={typeof height === 'string' ? parseInt(height) : height || 450}
      className="rounded-lg shadow-md"
      {...props}
    />
  )
}

// Custom link component
const MDXLink = ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isExternal = href?.startsWith('http')
  
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

// Custom blockquote component
const MDXBlockquote = ({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
  return (
    <blockquote
      className="border-l-4 border-blue-500 bg-blue-50 py-2 px-4 italic dark:border-blue-400 dark:bg-blue-900/20"
      {...props}
    >
      {children}
    </blockquote>
  )
}

// Custom code block component
const MDXPre = ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
  return (
    <pre
      className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100"
      {...props}
    >
      {children}
    </pre>
  )
}

// Custom inline code component
const MDXCode = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <code
      className="rounded bg-gray-100 px-1 py-0.5 text-pink-600 dark:bg-gray-800 dark:text-pink-400"
      {...props}
    >
      {children}
    </code>
  )
}

export const mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: MDXImage,
  a: MDXLink,
  blockquote: MDXBlockquote,
  pre: MDXPre,
  code: MDXCode,
}
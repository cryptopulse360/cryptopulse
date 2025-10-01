export interface TocItem {
  id: string
  title: string
  level: number
}

/**
 * Extract table of contents from MDX content
 */
export function extractTableOfContents(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = generateHeadingId(title)

    toc.push({
      id,
      title,
      level,
    })
  }

  return toc
}

/**
 * Generate a URL-friendly ID from heading text
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Check if content has enough headings to warrant a TOC
 */
export function shouldShowTableOfContents(toc: TocItem[]): boolean {
  return toc.length >= 3
}
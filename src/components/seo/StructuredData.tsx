import React from 'react';

interface StructuredDataProps {
  data: object;
}

/**
 * Component to render JSON-LD structured data
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}
'use client';

import Image from 'next/image';
import { useState } from 'react';
// Remove unused import - we handle errors internally

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else if (hasError && imgSrc === fallbackSrc) {
      setFallbackFailed(true);
    }
  };

  // If both original and fallback failed, show placeholder
  if (fallbackFailed || (hasError && imgSrc === fallbackSrc)) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-gray-400 dark:text-gray-500 text-center p-4">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Image unavailable</span>
        </div>
      </div>
    );
  }

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    priority,
    onError: handleError,
    ...(fill ? { fill: true, sizes } : { width, height }),
  };

  return <Image {...imageProps} />;
}

// Default export for backward compatibility
export default SafeImage;
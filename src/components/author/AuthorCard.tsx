import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Author } from '@/types/author';

interface AuthorCardProps {
  author: Author;
  className?: string;
}

export function AuthorCard({ author, className = '' }: AuthorCardProps) {
  const { name, slug, title, specialty, profilePic } = author;
  
  // Short excerpt from specialty
  const excerpt = specialty.length > 100 ? `${specialty.substring(0, 100)}...` : specialty;

  return (
    <Link href={`/authors/${slug}`} className="group no-underline">
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1 border border-gray-200 dark:border-gray-700 ${className}`}>
        {/* Profile Picture */}
        <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={profilePic}
            alt={`${name}, ${title}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {name}
          </h3>
          
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
            {title}
          </p>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {excerpt}
          </p>
          
          <div className="mt-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              View Profile →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

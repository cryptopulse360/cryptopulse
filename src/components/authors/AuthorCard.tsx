'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Author } from '@/types/author';

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link
      href={`/authors/${author.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
    >
      <div className="p-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all">
          {!imageError ? (
            <img
              src={author.profilePic}
              alt={author.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {author.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {author.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {author.title}
        </p>
      </div>
    </Link>
  );
}
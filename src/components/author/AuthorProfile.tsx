import React from 'react';
import Image from 'next/image';
import { Author } from '@/types/author';
import { cn } from '@/lib/utils';

interface AuthorProfileProps {
  author: Author;
  className?: string;
}

export function AuthorProfile({ author, className = '' }: AuthorProfileProps) {
  const { name, title, specialty, background, contentFocus, profilePic } = author;

  return (
    <section className={cn('mb-12', className)}>
      {/* Hero Section */}
      <div className={cn(
        'relative aspect-[2/1] overflow-hidden rounded-xl mb-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
      )}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-center h-full max-w-6xl mx-auto px-4">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0 mb-4 md:mb-0 md:mr-8 mx-auto md:mx-0">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-white/20 dark:ring-gray-900/50 shadow-xl">
              <Image
                src={profilePic}
                alt={name}
                width={192}
                height={192}
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Bio Header */}
          <div className="flex-1 text-center md:text-left max-w-md md:max-w-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {name}
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 mb-6 font-medium">
              {title}
            </p>
          </div>
        </div>
      </div>

      {/* Bio Sections */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Specialty */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Specialty
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {specialty}
          </p>
        </div>

        {/* Background */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Background
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {background}
          </p>
        </div>

        {/* Content Focus */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Content Focus
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {contentFocus}
          </p>
        </div>
      </div>
    </section>
  );
}

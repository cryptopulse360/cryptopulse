import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildOGImages, cleanOGImages, getStaticOGImagePath, staticOGImageExists } from '../build-og-images';
import fs from 'fs/promises';
import path from 'path';

// Mock dependencies
vi.mock('../mdx', () => ({
  getAllArticles: vi.fn(() => Promise.resolve([
    {
      slug: 'test-article-1',
      title: 'Test Bitcoin Article',
      description: 'A test article about Bitcoin',
      author: 'John Doe',
      tags: ['bitcoin', 'crypto'],
    },
    {
      slug: 'test-article-2',
      title: 'Ethereum Analysis',
      description: 'Deep dive into Ethereum',
      author: 'Jane Smith',
      tags: ['ethereum', 'defi'],
    },
  ])),
}));

vi.mock('../constants', () => ({
  siteConfig: {
    name: 'CryptoPulse',
    description: 'Test description',
    url: 'https://test.com',
    author: 'Test Author',
  },
}));

// No canvas mocking needed for SVG generation

// Mock fs operations
vi.mock('fs/promises', () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  readdir: vi.fn(() => Promise.resolve(['old-image.png'])),
  unlink: vi.fn(),
  access: vi.fn(),
}));

describe('Build OG Images', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildOGImages', () => {
    it('should generate OG images for all articles and pages', async () => {
      await buildOGImages();

      // Should create output directory
      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining(path.join('public', 'images', 'og')),
        { recursive: true }
      );

      // Should write image files for articles and pages
      expect(fs.writeFile).toHaveBeenCalledTimes(5); // 2 articles + 3 pages
      
      // Check specific files
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test-article-1.svg'),
        expect.any(String)
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test-article-2.svg'),
        expect.any(String)
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('home.svg'),
        expect.any(String)
      );
    });

    it('should handle errors gracefully', async () => {
      const mockError = new Error('Canvas error');
      vi.mocked(fs.mkdir).mockRejectedValueOnce(mockError);

      await expect(buildOGImages()).rejects.toThrow('Canvas error');
    });
  });

  describe('cleanOGImages', () => {
    it('should remove existing SVG and PNG files from OG directory', async () => {
      await cleanOGImages();

      expect(fs.readdir).toHaveBeenCalledWith(
        expect.stringContaining(path.join('public', 'images', 'og'))
      );
      expect(fs.unlink).toHaveBeenCalledWith(
        expect.stringContaining('old-image.png')
      );
    });

    it('should handle missing directory gracefully', async () => {
      vi.mocked(fs.readdir).mockRejectedValueOnce(new Error('Directory not found'));

      // Should not throw
      await expect(cleanOGImages()).resolves.toBeUndefined();
    });
  });

  describe('getStaticOGImagePath', () => {
    it('should return correct static image path', () => {
      const path = getStaticOGImagePath('test-article');
      expect(path).toBe('/images/og/test-article.svg');
    });
  });

  describe('staticOGImageExists', () => {
    it('should return true when image exists', async () => {
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);

      const exists = await staticOGImageExists('test-article');
      expect(exists).toBe(true);
    });

    it('should return false when image does not exist', async () => {
      vi.mocked(fs.access).mockRejectedValueOnce(new Error('File not found'));

      const exists = await staticOGImageExists('test-article');
      expect(exists).toBe(false);
    });
  });
});
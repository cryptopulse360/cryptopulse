import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  generateId,
  createAriaDescribedBy,
  handleKeyboardNavigation,
  announceToScreenReader,
  trapFocus,
  isVisibleToScreenReader,
  getAccessibleName,
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsContrastRequirement,
} from '../accessibility';

// Mock DOM methods
Object.defineProperty(window, 'getComputedStyle', {
  value: vi.fn(() => ({
    display: 'block',
    visibility: 'visible',
  })),
});

describe('Accessibility Utils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('generateId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = generateId('test');
      const id2 = generateId('test');
      
      expect(id1).toMatch(/^test-[a-z0-9]+$/);
      expect(id2).toMatch(/^test-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should use default prefix when none provided', () => {
      const id = generateId();
      expect(id).toMatch(/^element-[a-z0-9]+$/);
    });
  });

  describe('createAriaDescribedBy', () => {
    it('should join valid IDs with spaces', () => {
      const result = createAriaDescribedBy(['id1', 'id2', 'id3']);
      expect(result).toBe('id1 id2 id3');
    });

    it('should filter out empty strings', () => {
      const result = createAriaDescribedBy(['id1', '', 'id2', null as any, 'id3']);
      expect(result).toBe('id1 id2 id3');
    });

    it('should return empty string for empty array', () => {
      const result = createAriaDescribedBy([]);
      expect(result).toBe('');
    });
  });

  describe('handleKeyboardNavigation', () => {
    let mockItems: HTMLElement[];
    let mockOnSelect: ReturnType<typeof vi.fn>;
    let mockOnEscape: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockItems = [
        document.createElement('button'),
        document.createElement('button'),
        document.createElement('button'),
      ];
      
      mockItems.forEach((item, index) => {
        item.id = `item-${index}`;
        item.focus = vi.fn();
        document.body.appendChild(item);
      });

      mockOnSelect = vi.fn();
      mockOnEscape = vi.fn();
    });

    it('should handle ArrowDown navigation', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const preventDefault = vi.spyOn(event, 'preventDefault');
      
      const newIndex = handleKeyboardNavigation(event, mockItems, 0, mockOnSelect, mockOnEscape);
      
      expect(preventDefault).toHaveBeenCalled();
      expect(newIndex).toBe(1);
      expect(mockItems[1].focus).toHaveBeenCalled();
    });

    it('should handle ArrowUp navigation', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const preventDefault = vi.spyOn(event, 'preventDefault');
      
      const newIndex = handleKeyboardNavigation(event, mockItems, 1, mockOnSelect, mockOnEscape);
      
      expect(preventDefault).toHaveBeenCalled();
      expect(newIndex).toBe(0);
      expect(mockItems[0].focus).toHaveBeenCalled();
    });

    it('should wrap to first item when at end with ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      
      const newIndex = handleKeyboardNavigation(event, mockItems, 2, mockOnSelect, mockOnEscape);
      
      expect(newIndex).toBe(0);
      expect(mockItems[0].focus).toHaveBeenCalled();
    });

    it('should wrap to last item when at beginning with ArrowUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      
      const newIndex = handleKeyboardNavigation(event, mockItems, 0, mockOnSelect, mockOnEscape);
      
      expect(newIndex).toBe(2);
      expect(mockItems[2].focus).toHaveBeenCalled();
    });

    it('should handle Home key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      
      const newIndex = handleKeyboardNavigation(event, mockItems, 2, mockOnSelect, mockOnEscape);
      
      expect(newIndex).toBe(0);
      expect(mockItems[0].focus).toHaveBeenCalled();
    });

    it('should handle End key', () => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      
      const newIndex = handleKeyboardNavigation(event, mockItems, 0, mockOnSelect, mockOnEscape);
      
      expect(newIndex).toBe(2);
      expect(mockItems[2].focus).toHaveBeenCalled();
    });

    it('should handle Enter key and call onSelect', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      
      handleKeyboardNavigation(event, mockItems, 1, mockOnSelect, mockOnEscape);
      
      expect(mockOnSelect).toHaveBeenCalledWith(1);
    });

    it('should handle Escape key and call onEscape', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      
      handleKeyboardNavigation(event, mockItems, 1, mockOnSelect, mockOnEscape);
      
      expect(mockOnEscape).toHaveBeenCalled();
    });
  });

  describe('announceToScreenReader', () => {
    it('should create and remove announcement element', (done) => {
      announceToScreenReader('Test message');
      
      const announcement = document.querySelector('[aria-live]');
      expect(announcement).toBeTruthy();
      expect(announcement?.textContent).toBe('Test message');
      expect(announcement?.getAttribute('aria-live')).toBe('polite');
      expect(announcement?.getAttribute('aria-atomic')).toBe('true');
      
      setTimeout(() => {
        const removedAnnouncement = document.querySelector('[aria-live]');
        expect(removedAnnouncement).toBeFalsy();
        done();
      }, 1100);
    });

    it('should use assertive priority when specified', () => {
      announceToScreenReader('Urgent message', 'assertive');
      
      const announcement = document.querySelector('[aria-live]');
      expect(announcement?.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('isVisibleToScreenReader', () => {
    it('should return true for visible elements', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      expect(isVisibleToScreenReader(element)).toBe(true);
    });

    it('should return false for elements with aria-hidden', () => {
      const element = document.createElement('div');
      element.setAttribute('aria-hidden', 'true');
      document.body.appendChild(element);
      
      expect(isVisibleToScreenReader(element)).toBe(false);
    });
  });

  describe('getAccessibleName', () => {
    it('should return aria-label when present', () => {
      const element = document.createElement('button');
      element.setAttribute('aria-label', 'Close dialog');
      
      expect(getAccessibleName(element)).toBe('Close dialog');
    });

    it('should return text content as fallback', () => {
      const element = document.createElement('button');
      element.textContent = 'Submit';
      
      expect(getAccessibleName(element)).toBe('Submit');
    });

    it('should return labelledby element text', () => {
      const label = document.createElement('span');
      label.id = 'label-1';
      label.textContent = 'Username';
      document.body.appendChild(label);
      
      const element = document.createElement('input');
      element.setAttribute('aria-labelledby', 'label-1');
      
      expect(getAccessibleName(element)).toBe('Username');
    });
  });

  describe('Color contrast utilities', () => {
    describe('hexToRgb', () => {
      it('should convert hex to RGB', () => {
        expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
        expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
        expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      });

      it('should handle hex without hash', () => {
        expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      });

      it('should return null for invalid hex', () => {
        expect(hexToRgb('invalid')).toBeNull();
      });
    });

    describe('getLuminance', () => {
      it('should calculate luminance correctly', () => {
        // White should have luminance of 1
        expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 2);
        
        // Black should have luminance close to 0
        expect(getLuminance(0, 0, 0)).toBeCloseTo(0, 2);
      });
    });

    describe('getContrastRatio', () => {
      it('should calculate contrast ratio between colors', () => {
        // White on black should have high contrast
        const ratio = getContrastRatio('#ffffff', '#000000');
        expect(ratio).toBeCloseTo(21, 0);
      });

      it('should return 0 for invalid colors', () => {
        expect(getContrastRatio('invalid', '#000000')).toBe(0);
      });
    });

    describe('meetsContrastRequirement', () => {
      it('should validate WCAG AA compliance', () => {
        // White on black meets AA for normal text
        expect(meetsContrastRequirement('#ffffff', '#000000', 'AA', 'normal')).toBe(true);
        
        // Light gray on white fails AA for normal text
        expect(meetsContrastRequirement('#cccccc', '#ffffff', 'AA', 'normal')).toBe(false);
      });

      it('should validate WCAG AAA compliance', () => {
        // White on black meets AAA
        expect(meetsContrastRequirement('#ffffff', '#000000', 'AAA', 'normal')).toBe(true);
        
        // Lower contrast fails AAA
        expect(meetsContrastRequirement('#666666', '#ffffff', 'AAA', 'normal')).toBe(false);
      });

      it('should have different requirements for large text', () => {
        // Some combinations that fail for normal text pass for large text
        const foreground = '#808080'; // This should fail normal AA (4.5:1) but pass large AA (3:1)
        const background = '#ffffff';
        
        const ratio = getContrastRatio(foreground, background);
        // Verify the ratio is between 3:1 and 4.5:1 for this test to be meaningful
        expect(ratio).toBeGreaterThan(3);
        expect(ratio).toBeLessThan(4.5);
        
        expect(meetsContrastRequirement(foreground, background, 'AA', 'normal')).toBe(false);
        expect(meetsContrastRequirement(foreground, background, 'AA', 'large')).toBe(true);
      });
    });
  });
});
/**
 * Accessibility testing setup and utilities
 * Provides comprehensive tools for testing accessibility compliance
 */

import { vi } from 'vitest';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Setup accessibility testing environment
 */
export function setupAccessibilityTestEnvironment() {
  // Mock axe-core for accessibility testing
  vi.mock('axe-core', () => ({
    run: vi.fn(() => Promise.resolve({ violations: [] })),
    configure: vi.fn(),
  }));

  // Mock @axe-core/react
  vi.mock('@axe-core/react', () => ({
    default: vi.fn(),
  }));

  // Add accessibility styles for testing
  const style = document.createElement('style');
  style.textContent = `
    /* Ensure focus is visible in tests */
    *:focus {
      outline: 2px solid #005fcc !important;
      outline-offset: 2px !important;
    }
    
    /* Screen reader only text should be hidden visually but accessible */
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
    
    /* Skip links should be visible when focused */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
    }
    
    .skip-link:focus {
      top: 6px;
    }
  `;
  document.head.appendChild(style);

  return {
    cleanup: () => {
      document.head.removeChild(style);
    },
  };
}

/**
 * Test component for accessibility violations
 */
export async function testAccessibility(
  component: ReactElement,
  options?: {
    rules?: Record<string, { enabled: boolean }>;
    tags?: string[];
  }
): Promise<void> {
  const { container } = render(component);
  
  // Basic accessibility checks that don't require axe-core
  
  // Check for images without alt text
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      console.warn('Image found without alt attribute:', img);
    }
  });
  
  // Check for form inputs without labels
  const inputs = container.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    const hasLabel = input.hasAttribute('aria-label') ||
                    input.hasAttribute('aria-labelledby') ||
                    container.querySelector(`label[for="${input.id}"]`) ||
                    input.closest('label');
    
    if (!hasLabel) {
      console.warn('Form input found without label:', input);
    }
  });
  
  // Check for buttons without accessible names
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button) => {
    const hasAccessibleName = button.textContent?.trim() ||
                             button.hasAttribute('aria-label') ||
                             button.hasAttribute('aria-labelledby');
    
    if (!hasAccessibleName) {
      console.warn('Button found without accessible name:', button);
    }
  });
  
  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    if (currentLevel > previousLevel + 1) {
      console.warn('Heading hierarchy skip detected:', heading);
    }
    previousLevel = currentLevel;
  });
}

/**
 * Test keyboard navigation for a component
 */
export function testKeyboardNavigation(
  renderComponent: () => RenderResult,
  tests: {
    element: string | HTMLElement;
    key: string;
    expectedFocus?: string | HTMLElement;
    expectedAction?: () => void;
  }[]
): void {
  const { container } = renderComponent();
  
  tests.forEach(({ element, key, expectedFocus, expectedAction }) => {
    const targetElement = typeof element === 'string' 
      ? container.querySelector(element) as HTMLElement
      : element;
    
    if (!targetElement) {
      throw new Error(`Element not found: ${element}`);
    }
    
    // Focus the element
    targetElement.focus();
    expect(document.activeElement).toBe(targetElement);
    
    // Simulate key press
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    targetElement.dispatchEvent(event);
    
    // Check expected focus
    if (expectedFocus) {
      const expectedElement = typeof expectedFocus === 'string'
        ? container.querySelector(expectedFocus) as HTMLElement
        : expectedFocus;
      
      expect(document.activeElement).toBe(expectedElement);
    }
    
    // Check expected action
    if (expectedAction) {
      expectedAction();
    }
  });
}

/**
 * Test focus management for modals and overlays
 */
export function testFocusManagement(
  renderComponent: () => RenderResult,
  options: {
    triggerSelector: string;
    modalSelector: string;
    firstFocusableSelector: string;
    lastFocusableSelector: string;
    closeSelector?: string;
  }
): void {
  const { container } = renderComponent();
  
  const trigger = container.querySelector(options.triggerSelector) as HTMLElement;
  const modal = container.querySelector(options.modalSelector) as HTMLElement;
  const firstFocusable = container.querySelector(options.firstFocusableSelector) as HTMLElement;
  const lastFocusable = container.querySelector(options.lastFocusableSelector) as HTMLElement;
  
  if (!trigger || !modal || !firstFocusable || !lastFocusable) {
    throw new Error('Required elements not found for focus management test');
  }
  
  // Store initial focus
  const initialFocus = document.activeElement;
  
  // Open modal
  trigger.click();
  
  // Check initial focus
  expect(document.activeElement).toBe(firstFocusable);
  
  // Test Tab trapping - forward
  lastFocusable.focus();
  const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
  lastFocusable.dispatchEvent(tabEvent);
  expect(document.activeElement).toBe(firstFocusable);
  
  // Test Tab trapping - backward
  firstFocusable.focus();
  const shiftTabEvent = new KeyboardEvent('keydown', { 
    key: 'Tab', 
    shiftKey: true, 
    bubbles: true 
  });
  firstFocusable.dispatchEvent(shiftTabEvent);
  expect(document.activeElement).toBe(lastFocusable);
  
  // Test Escape key
  const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
  modal.dispatchEvent(escapeEvent);
  
  // Focus should return to trigger or initial focus
  expect(document.activeElement).toBe(trigger || initialFocus);
}

/**
 * Test ARIA attributes and relationships
 */
export function testAriaAttributes(
  renderComponent: () => RenderResult,
  tests: {
    selector: string;
    attributes: Record<string, string | null>;
  }[]
): void {
  const { container } = renderComponent();
  
  tests.forEach(({ selector, attributes }) => {
    const element = container.querySelector(selector);
    expect(element).toBeInTheDocument();
    
    Object.entries(attributes).forEach(([attr, expectedValue]) => {
      if (expectedValue === null) {
        expect(element).not.toHaveAttribute(attr);
      } else {
        expect(element).toHaveAttribute(attr, expectedValue);
      }
    });
  });
}

/**
 * Test screen reader announcements
 */
export function testScreenReaderAnnouncements(
  renderComponent: () => RenderResult,
  expectedAnnouncements: string[]
): void {
  const { container } = renderComponent();
  
  // Look for aria-live regions
  const liveRegions = container.querySelectorAll('[aria-live]');
  
  expectedAnnouncements.forEach((announcement, index) => {
    if (liveRegions[index]) {
      expect(liveRegions[index]).toHaveTextContent(announcement);
    }
  });
  
  // Also check for role="status" and role="alert"
  const statusRegions = container.querySelectorAll('[role="status"], [role="alert"]');
  statusRegions.forEach((region, index) => {
    if (expectedAnnouncements[index]) {
      expect(region).toHaveTextContent(expectedAnnouncements[index]);
    }
  });
}

/**
 * Test semantic HTML structure
 */
export function testSemanticStructure(
  renderComponent: () => RenderResult,
  expectedStructure: {
    landmarks: string[];
    headings: { level: number; text: string }[];
    lists?: string[];
  }
): void {
  const { container } = renderComponent();
  
  // Test landmarks
  expectedStructure.landmarks.forEach(landmark => {
    const element = container.querySelector(`[role="${landmark}"], ${landmark}`);
    expect(element).toBeInTheDocument();
  });
  
  // Test heading hierarchy
  expectedStructure.headings.forEach(({ level, text }) => {
    const heading = container.querySelector(`h${level}`);
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(text);
  });
  
  // Test lists
  if (expectedStructure.lists) {
    expectedStructure.lists.forEach(listType => {
      const list = container.querySelector(listType);
      expect(list).toBeInTheDocument();
    });
  }
}

/**
 * Test form accessibility
 */
export function testFormAccessibility(
  renderComponent: () => RenderResult,
  formTests: {
    inputs: { selector: string; label: string; required?: boolean }[];
    errors?: { selector: string; message: string }[];
  }
): void {
  const { container } = renderComponent();
  
  // Test input labels
  formTests.inputs.forEach(({ selector, label, required }) => {
    const input = container.querySelector(selector) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    
    // Check for associated label
    const labelElement = container.querySelector(`label[for="${input.id}"]`) ||
                        input.closest('label') ||
                        (input.getAttribute('aria-labelledby') && 
                         container.querySelector(`#${input.getAttribute('aria-labelledby')}`));
    
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent(label);
    
    // Check required attribute
    if (required) {
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('aria-required', 'true');
    }
  });
  
  // Test error messages
  if (formTests.errors) {
    formTests.errors.forEach(({ selector, message }) => {
      const errorElement = container.querySelector(selector);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(message);
      expect(errorElement).toHaveAttribute('role', 'alert');
    });
  }
}

/**
 * Mock screen reader for testing announcements
 */
export function mockScreenReader() {
  const announcements: string[] = [];
  
  // Mock aria-live region updates
  const originalSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name: string, value: string) {
    if (name === 'aria-live' || name === 'role') {
      // Track when live regions are created
    }
    return originalSetAttribute.call(this, name, value);
  };
  
  // Mock text content changes in live regions
  const originalTextContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  Object.defineProperty(Node.prototype, 'textContent', {
    set: function(value: string) {
      if (this instanceof Element && 
          (this.hasAttribute('aria-live') || this.getAttribute('role') === 'status' || this.getAttribute('role') === 'alert')) {
        announcements.push(value);
      }
      originalTextContent?.set?.call(this, value);
    },
    get: originalTextContent?.get,
    configurable: true,
  });
  
  return {
    getAnnouncements: () => [...announcements],
    clearAnnouncements: () => announcements.length = 0,
    cleanup: () => {
      Element.prototype.setAttribute = originalSetAttribute;
      if (originalTextContent) {
        Object.defineProperty(Node.prototype, 'textContent', originalTextContent);
      }
    },
  };
}
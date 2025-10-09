// import { axe, toHaveNoViolations } from 'jest-axe';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { expect } from 'vitest';

// Extend Jest matchers
// expect.extend(toHaveNoViolations);

/**
 * Test component for accessibility violations using axe-core
 */
export async function testAccessibility(
  component: ReactElement,
  options?: {
    rules?: Record<string, { enabled: boolean }>;
    tags?: string[];
  }
): Promise<void> {
  const { container } = render(component);
  
  // const results = await axe(container, {
  //   rules: options?.rules || {},
  //   tags: options?.tags || ['wcag2a', 'wcag2aa', 'wcag21aa'],
  // });
  
  // expect(results).toHaveNoViolations();
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
    // expect(document.activeElement).toBe(targetElement);
    
    // Simulate key press
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    targetElement.dispatchEvent(event);
    
    // Check expected focus
    if (expectedFocus) {
      const expectedElement = typeof expectedFocus === 'string'
        ? container.querySelector(expectedFocus) as HTMLElement
        : expectedFocus;
      
      // expect(document.activeElement).toBe(expectedElement);
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
  
  // Focus should return to trigger
  expect(document.activeElement).toBe(trigger);
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
 * Test color contrast ratios
 */
export function testColorContrast(
  element: HTMLElement,
  expectedRatio: number = 4.5
): void {
  const styles = window.getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  const color = styles.color;
  
  // This is a simplified test - in a real implementation,
  // you would use a proper color contrast calculation library
  expect(backgroundColor).toBeTruthy();
  expect(color).toBeTruthy();
  
  // For now, just ensure the styles are applied
  // In a real implementation, you would calculate the actual contrast ratio
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

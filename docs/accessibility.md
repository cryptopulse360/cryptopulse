# Accessibility Guide for CryptoPulse Website

This document outlines the accessibility features implemented in the CryptoPulse website and provides guidelines for maintaining and improving accessibility standards.

## Overview

The CryptoPulse website is designed to meet WCAG 2.1 AA standards and provide an inclusive experience for all users, including those with disabilities. This includes support for screen readers, keyboard navigation, high contrast modes, and reduced motion preferences.

## Accessibility Features Implemented

### 1. Semantic HTML Structure

- **Proper landmarks**: `<header>`, `<nav>`, `<main>`, `<footer>` elements
- **Heading hierarchy**: Logical H1-H6 structure throughout the site
- **Lists and tables**: Proper markup for structured content
- **Form labels**: All form inputs have associated labels

### 2. Keyboard Navigation

- **Tab order**: Logical tab sequence through interactive elements
- **Focus indicators**: Visible focus rings on all interactive elements
- **Skip links**: Allow users to skip to main content, navigation, and search
- **Keyboard shortcuts**: 
  - `Ctrl+K` / `Cmd+K`: Open search modal
  - `Escape`: Close modals and overlays
  - Arrow keys: Navigate through search results and menus

### 3. Screen Reader Support

- **ARIA labels**: Descriptive labels for interactive elements
- **ARIA landmarks**: Proper role attributes for page sections
- **ARIA live regions**: Dynamic content announcements
- **Screen reader only content**: Important context hidden visually but available to screen readers

### 4. Focus Management

- **Modal focus trapping**: Focus stays within modals when open
- **Focus restoration**: Focus returns to trigger element when modals close
- **Logical focus order**: Tab navigation follows visual layout

### 5. Color and Contrast

- **WCAG AA compliance**: Most color combinations meet 4.5:1 contrast ratio
- **Color independence**: Information not conveyed by color alone
- **High contrast support**: Enhanced focus indicators for high contrast mode

### 6. Motion and Animation

- **Reduced motion support**: Respects `prefers-reduced-motion` setting
- **Optional animations**: Non-essential animations can be disabled
- **Smooth scrolling**: Respects user preferences

## Accessibility Testing

### Automated Testing

The project includes comprehensive accessibility testing:

```bash
# Run all accessibility tests
npm run test:accessibility

# Test color contrast ratios
npm run test:contrast

# Run axe-core accessibility audits
npm test -- --run src/**/__tests__/*.accessibility.test.tsx
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order is logical and follows visual layout
- [ ] Focus indicators are clearly visible
- [ ] Skip links work and are accessible
- [ ] Modal focus is properly trapped
- [ ] Escape key closes modals and menus

#### Screen Reader Testing
- [ ] Page structure is logical with proper headings
- [ ] All images have appropriate alt text
- [ ] Form labels are properly associated
- [ ] Dynamic content changes are announced
- [ ] ARIA labels provide sufficient context

#### Visual Testing
- [ ] Text is readable at 200% zoom
- [ ] Color contrast meets WCAG AA standards
- [ ] Information is not conveyed by color alone
- [ ] Focus indicators are visible in high contrast mode

### Testing Tools

#### Browser Extensions
- **axe DevTools**: Automated accessibility scanning
- **WAVE**: Web accessibility evaluation
- **Lighthouse**: Accessibility audit included in performance testing

#### Screen Readers
- **NVDA** (Windows): Free screen reader for testing
- **JAWS** (Windows): Professional screen reader
- **VoiceOver** (macOS): Built-in screen reader
- **Orca** (Linux): Open source screen reader

## Implementation Details

### Skip Links

Skip links are implemented in `src/components/accessibility/SkipLinks.tsx`:

```tsx
// Skip to main content, navigation, and search
<SkipLinks />
```

### Focus Management

Focus trapping and management utilities in `src/lib/accessibility.ts`:

```tsx
import { trapFocus, announceToScreenReader } from '@/lib/accessibility';

// Trap focus within a modal
const cleanup = trapFocus(modalElement);

// Announce changes to screen readers
announceToScreenReader('Search results updated', 'polite');
```

### Keyboard Navigation

Keyboard event handling for complex components:

```tsx
import { handleKeyboardNavigation } from '@/lib/accessibility';

// Handle arrow key navigation in lists
const newIndex = handleKeyboardNavigation(
  event,
  menuItems,
  currentIndex,
  onSelect,
  onEscape
);
```

### ARIA Attributes

Proper ARIA labeling throughout components:

```tsx
// Search modal with proper ARIA
<div role="dialog" aria-modal="true" aria-labelledby="search-title">
  <h2 id="search-title">Search Articles</h2>
  <input aria-label="Search articles" role="textbox" />
</div>
```

## Color Contrast Results

Current color contrast test results:

- **WCAG AA Compliance**: 73.3% (11/15 combinations)
- **WCAG AAA Compliance**: 26.7% (4/15 combinations)

### Failing Combinations (Need Improvement)
- Focus ring on white background (3.68:1)
- Border colors (decorative, not critical)
- Some brand gradient combinations

### Excellent Contrast (7:1+)
- Body text on backgrounds
- Secondary text combinations
- Card content on dark theme

## Best Practices for Contributors

### When Adding New Components

1. **Use semantic HTML**: Choose the right HTML elements for content structure
2. **Add ARIA labels**: Provide context for screen readers
3. **Test keyboard navigation**: Ensure all functionality is keyboard accessible
4. **Check color contrast**: Use tools to verify contrast ratios
5. **Write accessibility tests**: Include automated tests for new components

### Code Examples

#### Accessible Button
```tsx
<button
  type="button"
  aria-label="Close search modal"
  className="focus-ring"
  onClick={onClose}
>
  <CloseIcon aria-hidden="true" />
</button>
```

#### Accessible Form Input
```tsx
<div>
  <label htmlFor="email" className="sr-only">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    placeholder="Enter your email"
    aria-required="true"
    aria-describedby="email-error"
  />
  <div id="email-error" role="alert">
    {error && error}
  </div>
</div>
```

#### Accessible Navigation
```tsx
<nav role="navigation" aria-label="Main navigation">
  <ul>
    {items.map(item => (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
          className="focus-ring"
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</nav>
```

## Continuous Improvement

### Regular Audits
- Run automated tests with every build
- Perform manual testing monthly
- User testing with assistive technology users quarterly

### Monitoring
- Track accessibility metrics in analytics
- Monitor user feedback for accessibility issues
- Stay updated with WCAG guidelines and best practices

### Future Enhancements
- [ ] Implement high contrast theme toggle
- [ ] Add more keyboard shortcuts for power users
- [ ] Improve color contrast for failing combinations
- [ ] Add voice navigation support
- [ ] Implement focus management for single-page app navigation

## Resources

### Guidelines and Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility Resources](https://webaim.org/resources/)

### Testing Tools
- [axe-core](https://github.com/dequelabs/axe-core)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Learning Resources
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)

## Support

For accessibility-related questions or issues:
1. Check this documentation first
2. Run the automated accessibility tests
3. Test with actual assistive technologies
4. Consult the WCAG guidelines for specific requirements
5. Consider user feedback and real-world usage patterns

Remember: Accessibility is not a one-time implementation but an ongoing commitment to inclusive design.
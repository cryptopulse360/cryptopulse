import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from '../Breadcrumb';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';

describe('Breadcrumb', () => {
  it('renders breadcrumb items correctly', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Tags', href: '/tags' },
      { label: 'Bitcoin' }
    ];

    render(<Breadcrumb items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Current Page' }
    ];

    render(<Breadcrumb items={items} />);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
    
    // Current page should not be a link
    expect(screen.queryByRole('link', { name: 'Current Page' })).not.toBeInTheDocument();
  });

  it('renders separators between items', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Tags', href: '/tags' },
      { label: 'Bitcoin' }
    ];

    render(<Breadcrumb items={items} />);

    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(2); // Should have 2 separators for 3 items
  });

  it('applies custom className', () => {
    const items = [{ label: 'Home', href: '/' }];
    
    render(<Breadcrumb items={items} className="custom-class" />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    const items = [{ label: 'Home', href: '/' }];
    
    render(<Breadcrumb items={items} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});
/**
 * Search index entry interface for client-side search
 */
export interface SearchIndex {
  /** Article slug (unique identifier) */
  slug: string;
  /** Article title */
  title: string;
  /** Article description */
  description: string;
  /** Searchable content (processed) */
  content: string;
  /** Article tags for filtering */
  tags: string[];
  /** Author name */
  author: string;
  /** Publication date as ISO string */
  publishedAt: string;
  /** URL for navigation */
  url: string;
}

/**
 * Search result interface extending SearchIndex with Lunr.js data
 */
export interface SearchResult extends SearchIndex {
  /** Search score/relevance from Lunr.js */
  score: number;
  /** Match data from Lunr.js */
  matches: Record<string, unknown>;
}

/**
 * Search modal component props
 */
export interface SearchModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
}

/**
 * Search input component props
 */
export interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Function called when value changes */
  onChange: (value: string) => void;
  /** Function called on form submit */
  onSubmit: () => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Whether to auto-focus the input */
  autoFocus?: boolean;
}

/**
 * Search results component props
 */
export interface SearchResultsProps {
  /** Array of search results */
  results: SearchResult[];
  /** Current search query */
  query: string;
  /** Whether search is loading */
  isLoading: boolean;
  /** Function called when a result is clicked */
  onResultClick: (result: SearchResult) => void;
  /** Index of currently selected result for keyboard navigation */
  selectedIndex?: number;
}
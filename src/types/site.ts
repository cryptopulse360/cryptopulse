/**
 * Site configuration interface
 */
export interface SiteConfig {
  /** Site name */
  name: string;
  /** Short site name for display */
  shortName?: string;
  /** Site description */
  description: string;
  /** Site URL */
  url: string;
  /** Default author */
  author: string;
  /** Social media links */
  social: {
    x: string;
    pinterest: string;
  };
  /** Analytics configuration */
  analytics: {
    plausibleDomain?: string;
  };
  /** Newsletter configuration */
  newsletter: {
    mailerliteApiKey?: string;
    mailerliteGroupId?: string;
  };
  /** SEO defaults */
  seo: {
    defaultImage: string;
    fallbackImage: string;
    xHandle: string;
  };
}

/**
 * Navigation item interface
 */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Footer link section interface
 */
export interface FooterSection {
  title: string;
  links: NavItem[];
}

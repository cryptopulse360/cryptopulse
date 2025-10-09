/**
 * Author interface for profile data
 */
export interface Author {
  /** Full name of the author */
  name: string;
  /** URL-friendly slug (lowercase with hyphens) */
  slug: string;
  /** Professional title/role */
  title: string;
  /** Area of expertise/specialty */
  specialty: string;
  /** Professional background */
  background: string;
  /** Main content focus areas */
  contentFocus: string;
  /** Path to profile picture */
  profilePic: string;
}

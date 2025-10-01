// This component prevents flash of unstyled content (FOUC) by setting the theme
// before the page renders. It must be rendered in the <head> of the document.

export function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('yoursite-theme');
        var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        var resolvedTheme = theme === 'system' || !theme ? systemTheme : theme;
        
        document.documentElement.classList.add(resolvedTheme);
        document.documentElement.setAttribute('data-theme', resolvedTheme);
      } catch (e) {
        // Fallback to light theme if there's an error
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
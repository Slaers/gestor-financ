// public/js/navigation.js

export const navigationLinks = [
  {
    text: 'Home',
    href: '/home', // Updated: Root is now /home
    icon: null,
  },
  {
    text: 'Investimentos',
    href: '/investimentos', // Updated: Path as per firebase.json rewrite
    icon: null,
  },
  {
    text: 'Lançamentos',
    href: '/lancamentos', // Updated: Path as per firebase.json rewrite
    icon: null,
  },
  {
    text: 'Família',
    // Updated: Points to /home, action to be handled by home.html's logic if needed
    // Or, if there's a dedicated family page, it would be e.g., '/familia'
    // For now, consistent with plan: /home?action=manageFamily
    href: '/home?action=manageFamily',
    icon: null,
  },
  {
    text: 'Configurações',
    href: '#', // Placeholder, as current settings link is '#'
    icon: null,
  }
  // No 'Login' link here as per revised thought; logout is handled by a button on /home
];

// Function to adjust hrefs for use in sub-pages.
// Given firebase.json rewrites, direct root-relative links should work.
// This function will now ensure that the hrefs are returned as defined,
// as the firebase.json rewrites mean the browser should resolve them from the root.
// The pagePath argument helps in contexts where relative paths from the *file system location*
// of the HTML file were previously needed, but with rewrites, this is less of a concern.
export function getNavigationLinks(pagePath = '/') {
  // pagePath might be like '/public/investimentos.html' or '/public/lancamentos.html' or '/' for index/home.
  return navigationLinks.map(link => {
    // With firebase.json rewrites, the hrefs in navigationLinks are root-relative paths
    // and should work directly.
    // No complex path adjustments are needed here anymore based on pagePath.
    // If a link is '#', it remains '#'.
    // Example: If link.href is '/home', it remains '/home'.
    // If link.href is '/investimentos', it remains '/investimentos'.
    return { ...link, href: link.href };
  });
}

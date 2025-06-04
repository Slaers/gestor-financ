// public/js/navigation.js

export const navigationLinks = [
  {
    text: 'Home',
    href: '/', // Updated: Main page is now at the root
    icon: null,
  },
  {
    text: 'Investimentos',
    href: '/investimentos', // Path as per firebase.json rewrite
    icon: null,
  },
  {
    text: 'Lançamentos',
    href: '/lancamentos', // Path as per firebase.json rewrite
    icon: null,
  },
  {
    text: 'Família',
    href: '/?action=manageFamily', // Updated: Points to root, action handled by index.html
    icon: null,
  },
  {
    text: 'Configurações',
    href: '#', // Placeholder
    icon: null,
  }
];

// Function to adjust hrefs for use in sub-pages.
// Given firebase.json rewrites, direct root-relative links should work.
// The pagePath argument helps in contexts like active link highlighting.
export function getNavigationLinks(pagePath = '/') {
  return navigationLinks.map(link => {
    // Returns links as defined, firebase.json rewrites handle resolution.
    return { ...link, href: link.href };
  });
}

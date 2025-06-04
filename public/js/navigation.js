// public/js/navigation.js

export const navigationLinks = [
  {
    text: 'Home',
    href: '/home', // Updated: Main page is now /home
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
    href: '/home?action=manageFamily', // Updated: Points to /home for family action
    icon: null,
  },
  {
    text: 'Configurações',
    href: '#', // Placeholder
    icon: null,
  }
];

// Function to determine links.
// The pagePath argument is used by calling pages to help determine active link.
export function getNavigationLinks(pagePath = '/') {
  return navigationLinks.map(link => {
    // Returns links as defined, firebase.json rewrites handle resolution.
    return { ...link, href: link.href };
  });
}

// public/js/navigation.js

export const navigationLinks = [
  {
    text: 'Home',
    href: '/', // Standardized in step 1
    icon: null, // Placeholder for potential future icon class or SVG
  },
  {
    text: 'Investimentos',
    href: '/public/investimentos.html',
    icon: null,
  },
  {
    text: 'Lançamentos',
    href: '/public/lancamentos.html',
    icon: null,
  },
  {
    text: 'Família',
    href: '/index.html?action=manageFamily', // Points to main app, which handles this action
    icon: null,
  },
  {
    text: 'Configurações',
    href: '#', // Placeholder, as current settings link is '#'
    icon: null,
  }
];

// Function to adjust hrefs for use in sub-pages (e.g., public/investimentos.html)
export function getNavigationLinks(pagePath = '/') {
  return navigationLinks.map(link => {
    let newHref = link.href;
    // If the current page is inside '/public/' and the link is to the root or another /public/ page
    if (pagePath.startsWith('/public/')) {
      if (link.href === '/') {
        newHref = '../index.html'; // Go up to root for Home
      } else if (link.href.startsWith('/public/')) {
        // Link is to another page within /public, make it relative from current /public page
        newHref = link.href.substring('/public/'.length);
      } else if (link.href.startsWith('/index.html?action=')) {
        // Link is to /index.html?action=... (like Familia)
        newHref = `../index.html${link.href.substring('/index.html'.length)}`;
      }
      // Links like '#' (Configurações) remain unchanged
    }
    return { ...link, href: newHref };
  });
}

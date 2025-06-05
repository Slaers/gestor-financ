document.addEventListener('DOMContentLoaded', () => {
    const universalHamburgerButton = document.getElementById('universal-hamburger-button-investimentos');
    const desktopSidebarMenu = document.getElementById('desktop-sidebar-menu-investimentos');
    const closeDesktopSidebarButton = document.getElementById('close-desktop-sidebar-button-investimentos');
    const mobileOverlayMenu = document.getElementById('mobile-overlay-menu-investimentos');
    const closeMobileOverlayButton = document.getElementById('close-mobile-overlay-button-investimentos');

    // Note: Family links in investimentos.html are direct navigations, so no specific JS handlers needed here for them.

    function toggleMobileOverlayMenu() {
        if (mobileOverlayMenu) {
            const isHidden = mobileOverlayMenu.classList.contains('hidden');
            if (isHidden) {
                mobileOverlayMenu.classList.remove('hidden');
                requestAnimationFrame(() => {
                    mobileOverlayMenu.classList.remove('translate-x-full');
                    mobileOverlayMenu.classList.add('translate-x-0');
                });
            } else {
                mobileOverlayMenu.classList.remove('translate-x-0');
                mobileOverlayMenu.classList.add('translate-x-full');
                mobileOverlayMenu.addEventListener('transitionend', () => {
                    mobileOverlayMenu.classList.add('hidden');
                }, { once: true });
            }
        }
    }

    function toggleDesktopSidebarMenu() {
        if (desktopSidebarMenu) {
            const isHidden = desktopSidebarMenu.classList.contains('hidden');
            if (isHidden) {
                desktopSidebarMenu.classList.remove('hidden');
                requestAnimationFrame(() => {
                    desktopSidebarMenu.classList.remove('-translate-x-full');
                    desktopSidebarMenu.classList.add('translate-x-0');
                });
            } else {
                desktopSidebarMenu.classList.remove('translate-x-0');
                desktopSidebarMenu.classList.add('-translate-x-full');
                desktopSidebarMenu.addEventListener('transitionend', () => {
                    desktopSidebarMenu.classList.add('hidden');
                }, { once: true });
            }
        }
    }

    if (universalHamburgerButton) {
        universalHamburgerButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (window.matchMedia('(min-width: 1024px)').matches) { // lg breakpoint
                if (mobileOverlayMenu && !mobileOverlayMenu.classList.contains('hidden') && !mobileOverlayMenu.classList.contains('translate-x-full')) {
                    toggleMobileOverlayMenu();
                }
                toggleDesktopSidebarMenu();
            } else {
                if (desktopSidebarMenu && !desktopSidebarMenu.classList.contains('hidden') && !desktopSidebarMenu.classList.contains('-translate-x-full')) {
                    toggleDesktopSidebarMenu();
                }
                toggleMobileOverlayMenu();
            }
        });
    }

    if (closeDesktopSidebarButton) {
        closeDesktopSidebarButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDesktopSidebarMenu();
        });
    }
    if (closeMobileOverlayButton) {
        closeMobileOverlayButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMobileOverlayMenu();
        });
    }

    document.addEventListener('click', (event) => {
        if (window.matchMedia('(min-width: 1024px)').matches && desktopSidebarMenu && !desktopSidebarMenu.classList.contains('hidden') && !desktopSidebarMenu.classList.contains('-translate-x-full')) {
            if (universalHamburgerButton && !universalHamburgerButton.contains(event.target) && !desktopSidebarMenu.contains(event.target)) {
                toggleDesktopSidebarMenu();
            }
        }
    });
});

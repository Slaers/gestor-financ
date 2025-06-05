document.addEventListener('DOMContentLoaded', () => {
    // Universal Menu Element Selectors for lancamentos.html
    const universalHamburgerButton = document.getElementById('universal-hamburger-button-lancamentos');
    const desktopSidebarMenu = document.getElementById('desktop-sidebar-menu-lancamentos');
    const closeDesktopSidebarButton = document.getElementById('close-desktop-sidebar-button-lancamentos');
    const mobileOverlayMenu = document.getElementById('mobile-overlay-menu-lancamentos');
    const closeMobileOverlayButton = document.getElementById('close-mobile-overlay-button-lancamentos');

    // Function to toggle the mobile overlay menu
    function toggleMobileOverlayMenu() {
        if (mobileOverlayMenu) {
            const isHidden = mobileOverlayMenu.classList.contains('hidden');
            if (isHidden) {
                mobileOverlayMenu.classList.remove('hidden');
                // Force reflow for transition to apply
                requestAnimationFrame(() => {
                    mobileOverlayMenu.classList.remove('translate-x-full');
                    mobileOverlayMenu.classList.add('translate-x-0');
                });
            } else {
                mobileOverlayMenu.classList.remove('translate-x-0');
                mobileOverlayMenu.classList.add('translate-x-full');
                // Listen for transition end to add 'hidden' class back
                mobileOverlayMenu.addEventListener('transitionend', () => {
                    mobileOverlayMenu.classList.add('hidden');
                }, { once: true });
            }
        }
    }

    // Function to toggle the desktop sidebar menu
    function toggleDesktopSidebarMenu() {
        if (desktopSidebarMenu) {
            const isHidden = desktopSidebarMenu.classList.contains('hidden');
            if (isHidden) {
                desktopSidebarMenu.classList.remove('hidden');
                // Force reflow for transition to apply
                requestAnimationFrame(() => {
                    desktopSidebarMenu.classList.remove('-translate-x-full');
                    desktopSidebarMenu.classList.add('translate-x-0');
                });
            } else {
                desktopSidebarMenu.classList.remove('translate-x-0');
                desktopSidebarMenu.classList.add('-translate-x-full');
                // Listen for transition end to add 'hidden' class back
                desktopSidebarMenu.addEventListener('transitionend', () => {
                    desktopSidebarMenu.classList.add('hidden');
                }, { once: true });
            }
        }
    }

    // Event listener for the universal hamburger button
    if (universalHamburgerButton) {
        universalHamburgerButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling to document
            // In lancamentos.html, the hamburger is primarily for mobile.
            // Desktop sidebar is not typically opened via this hamburger in a sub-page layout.
            // It's mainly controlled by direct navigation or if it were a main app page.
            // Forcing mobile menu behavior here.
            toggleMobileOverlayMenu();

            // If you want the hamburger to also control desktop sidebar (e.g., if layout changes):
            // if (window.matchMedia('(min-width: 1024px)').matches) { // lg breakpoint from Tailwind
            //     toggleDesktopSidebarMenu();
            // } else {
            //     toggleMobileOverlayMenu();
            // }
        });
    }

    // Event listener for the close button on the desktop sidebar
    if (closeDesktopSidebarButton) {
        closeDesktopSidebarButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDesktopSidebarMenu();
        });
    }

    // Event listener for the close button on the mobile overlay
    if (closeMobileOverlayButton) {
        closeMobileOverlayButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMobileOverlayMenu();
        });
    }

    // Click outside to close desktop sidebar (if it's open)
    document.addEventListener('click', (event) => {
        if (desktopSidebarMenu && !desktopSidebarMenu.classList.contains('hidden') && !desktopSidebarMenu.classList.contains('-translate-x-full')) {
            // Check if the click is outside the desktop sidebar and not on the hamburger button
            if (universalHamburgerButton && !universalHamburgerButton.contains(event.target) && !desktopSidebarMenu.contains(event.target)) {
                toggleDesktopSidebarMenu();
            }
        }
        // No click outside for mobile overlay as it's a full-screen takeover.
    });

    // Optional: Show desktop sidebar by default on larger screens if that's the desired UX for lancamentos.
    // This would typically be controlled by CSS classes directly in the HTML.
    // Example: If you want desktop sidebar to be visible by default on lg screens:
    // if (window.matchMedia('(min-width: 1024px)').matches && desktopSidebarMenu) {
    //    desktopSidebarMenu.classList.remove('hidden', '-translate-x-full');
    //    desktopSidebarMenu.classList.add('translate-x-0');
    // }
    // However, the HTML for lancamentos.html has 'hidden lg:flex' for desktop,
    // which means it should be hidden by default and then shown by CSS on lg screens.
    // The hamburger for lancamentos.html is also lg:hidden, so it's only for mobile.
    // The JS above for hamburger button now only triggers mobile menu.
    // If desktop sidebar needs to be opened, it might be via a different button or logic not yet defined for lancamentos.html.
    // For now, this script makes the mobile hamburger and mobile/desktop close buttons functional.
});

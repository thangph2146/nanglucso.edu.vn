// Header functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize mega menu
    initMegaMenu();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize user menu
    initUserMenu();
});

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }
}

// Mega Menu functionality
function initMegaMenu() {
    // Desktop mega menu
    const dropdownItems = document.querySelectorAll('.dropdown');
    
    if (window.innerWidth >= 992) {
        dropdownItems.forEach(item => {
            const dropdownToggle = item.querySelector('.dropdown-toggle');
            const dropdownMenu = item.querySelector('.dropdown-menu');
            
            // Add hover effect
            item.addEventListener('mouseenter', function() {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            });
            
            item.addEventListener('mouseleave', function() {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.transform = 'translateY(10px)';
            });
        });
    }
}

// Mobile Menu functionality
function initMobileMenu() {
    const menuToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.overlay');
    const dropdownToggles = document.querySelectorAll('.nav-link.dropdown-toggle');
    
    if (menuToggler && navbarCollapse && overlay) {
        // Open mobile menu
        menuToggler.addEventListener('click', function() {
            navbarCollapse.classList.add('show');
            overlay.classList.add('show');
            document.body.classList.add('menu-open');
        });
        
        // Close mobile menu with X button
        if (closeMenu) {
            closeMenu.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
                overlay.classList.remove('show');
                document.body.classList.remove('menu-open');
            });
        }
        
        // Close mobile menu with overlay
        overlay.addEventListener('click', function() {
            navbarCollapse.classList.remove('show');
            overlay.classList.remove('show');
            document.body.classList.remove('menu-open');
        });
        
        // Mobile dropdown toggles
        if (window.innerWidth < 992) {
            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    
                    // Close other dropdowns
                    document.querySelectorAll('.nav-item.dropdown.show').forEach(item => {
                        if (item !== parent) {
                            item.classList.remove('show');
                            const menu = item.querySelector('.dropdown-menu');
                            if (menu) {
                                menu.style.maxHeight = '0';
                                menu.style.opacity = '0';
                            }
                        }
                    });
                    
                    // Toggle current dropdown
                    parent.classList.toggle('show');
                    const menu = parent.querySelector('.dropdown-menu');
                    
                    if (parent.classList.contains('show')) {
                        menu.style.maxHeight = menu.scrollHeight + 'px';
                        menu.style.opacity = '1';
                        this.style.color = 'var(--hub-red)';
                    } else {
                        menu.style.maxHeight = '0';
                        menu.style.opacity = '0';
                        this.style.color = '';
                    }
                });
            });
        }
    }
}

// User Menu functionality
function initUserMenu() {
    const navItems = document.querySelectorAll('.nav-item.dropdown');
    const userMenu = document.querySelector('.user-menu');
    
    if (navItems.length && userMenu) {
        // For desktop: show/hide user menu on hover
        if (window.innerWidth >= 992) {
            navItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    // Close any open user menu
                    userMenu.classList.remove('active');
                });
            });
        }
        
        // For mobile: toggle user menu on click
        const userMenuToggler = document.querySelector('.user-menu-toggle');
        if (userMenuToggler) {
            userMenuToggler.addEventListener('click', function(e) {
                e.preventDefault();
                userMenu.classList.toggle('active');
            });
        }
    }
}

// Window resize handling
window.addEventListener('resize', function() {
    // Reinitialize menu functionality on window resize
    if (window.innerWidth >= 992) {
        // Switch to desktop mode
        document.querySelector('.navbar-collapse')?.classList.remove('show');
        document.querySelector('.overlay')?.classList.remove('show');
        document.body.classList.remove('menu-open');
        
        // Reinitialize mega menu
        initMegaMenu();
    } else {
        // Switch to mobile mode
        initMobileMenu();
    }
}); 
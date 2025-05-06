// Header Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    initHeaderScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize dropdown menus
    initDropdowns();
});

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Mobile Menu
function initMobileMenu() {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const closeBtn = document.querySelector('.close-menu');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const overlay = document.querySelector('.overlay');
    
    if (!toggleBtn || !navbarCollapse) return;
    
    toggleBtn.addEventListener('click', function() {
        navbarCollapse.classList.add('show');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    function closeMenu() {
        navbarCollapse.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Handle Dropdowns in Mobile View
    const dropdownToggleList = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggleList.forEach(dropdownToggle => {
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                const parent = this.parentNode;
                parent.classList.toggle('show');
            }
        });
    });
}

// Initialize dropdown menus
function initDropdowns() {
    // Hover style dropdowns for desktop, click for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('show');
                }
            });
        }
    });
} 
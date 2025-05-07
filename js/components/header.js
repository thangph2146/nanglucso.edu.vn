/**
 * Header JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Dropdown hover functionality (chỉ kích hoạt trên desktop)
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    
    function initDropdownHover() {
        if (window.innerWidth >= 992) {
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('mouseenter', function() {
                    const dropdownMenu = this.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.add('show');
                        this.classList.add('show');
                    }
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    const dropdownMenu = this.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                        this.classList.remove('show');
                    }
                });
            });
        }
    }
    
    // Toggle search modal
    const searchButton = document.querySelector('.search-btn');
    const searchModal = document.getElementById('searchModal');
    
    if (searchButton && searchModal) {
        const searchModalObj = new bootstrap.Modal(searchModal);
        searchButton.addEventListener('click', function() {
            searchModalObj.show();
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    if (navbarToggler) navbarToggler.click();
                }
            }
        });
    });
    
    // Mobile menu adjustments
    const navbarToggler = document.querySelector('.navbar-toggler');
    const overlay = document.querySelector('.overlay');
    
    if (navbarToggler && overlay) {
        navbarToggler.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            if (expanded) {
                overlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            } else {
                overlay.classList.add('active');
                document.body.classList.add('menu-open');
            }
        });
        
        overlay.addEventListener('click', function() {
            if (overlay.classList.contains('active')) {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    }
    
    // Debounce function
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Initialize dropdown hover on page load
    initDropdownHover();
    
    // Update dropdown behavior on window resize with debounce
    const debouncedResizeHandler = debounce(function() {
        initDropdownHover();
    }, 250); // Adjust wait time as needed, e.g., 250ms

    window.addEventListener('resize', debouncedResizeHandler);

    // Giả sử bạn có thể bắt sự kiện khi .navbar-collapse được mở (Bootstrap 'shown.bs.collapse')
    const mobileMenu = document.getElementById('navbarContent');
    mobileMenu.addEventListener('shown.bs.collapse', function () {
        const navItems = mobileMenu.querySelectorAll('.navbar-nav > .nav-item');
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('item-visible');
            }, index * 100); // Trễ 100ms cho mỗi item
        });
    });

    mobileMenu.addEventListener('hide.bs.collapse', function () {
        const navItems = mobileMenu.querySelectorAll('.navbar-nav > .nav-item');
        navItems.forEach((item) => {
            item.classList.remove('item-visible'); // Reset khi đóng menu
        });
    });
});
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
    
    // Initialize dropdown hover on page load
    initDropdownHover();
    
    // Update dropdown behavior on window resize
    window.addEventListener('resize', function() {
        initDropdownHover();
    });
}); 
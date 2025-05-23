/**
 * Main JavaScript file for HUB University website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Khai báo các biến toàn cục
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('#backToTop');
    
    // Header scroll effect
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Scroll to top button
    function handleScrollTopButton() {
        if (!backToTop) {
            return;
        }
        
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    }

    // Tooltips and Popovers initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

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

    // Event listeners
    const debouncedScrollHandler = debounce(function() {
        handleHeaderScroll();
        handleScrollTopButton();
    }, 100); // Adjust wait time as needed, e.g., 100ms

    window.addEventListener('scroll', debouncedScrollHandler);

    // Initialize header scroll state on page load
    handleHeaderScroll();
});

/**
 * Initialize all UI components
 */
function initializeComponents() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltips.length > 0) {
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }
    
    // Initialize popovers
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    if (popovers.length > 0) {
        popovers.forEach(popover => {
            new bootstrap.Popover(popover);
        });
    }
    
    // Initialize modals
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    if (modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const target = this.getAttribute('data-bs-target');
                const modal = new bootstrap.Modal(document.querySelector(target));
                modal.show();
            });
        });
    }
    
    // Initialize accordions
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-collapse');
            
            if (header && content) {
                header.addEventListener('click', function() {
                    const isOpen = content.classList.contains('show');
                    
                    // Close all other accordion items
                    document.querySelectorAll('.accordion-collapse.show').forEach(openItem => {
                        if (openItem !== content) {
                            openItem.classList.remove('show');
                            const openItemHeader = openItem.previousElementSibling;
                            if (openItemHeader) {
                                const openItemButton = openItemHeader.querySelector('.accordion-button');
                                if (openItemButton) {
                                    openItemButton.classList.add('collapsed');
                                }
                            }
                        }
                    });
                    
                    // Toggle current accordion item
                    if (!isOpen) {
                        content.classList.add('show');
                        header.querySelector('.accordion-button')?.classList.remove('collapsed');
                    } else {
                        content.classList.remove('show');
                        header.querySelector('.accordion-button')?.classList.add('collapsed');
                    }
                });
            }
        });
    }
    
    // Initialize tabs
    const tabTriggers = document.querySelectorAll('.nav-tabs .nav-link');
    if (tabTriggers.length > 0) {
        tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all tabs
                trigger.closest('.nav-tabs').querySelectorAll('.nav-link').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Add active class to clicked tab
                trigger.classList.add('active');
                
                // Hide all tab panes
                const tabContentId = trigger.getAttribute('href') || trigger.getAttribute('data-bs-target');
                const tabContent = document.querySelector(tabContentId);
                const tabContentContainer = tabContent?.closest('.tab-content');
                
                if (tabContentContainer) {
                    tabContentContainer.querySelectorAll('.tab-pane').forEach(pane => {
                        pane.classList.remove('active', 'show');
                    });
                    
                    // Show selected tab pane
                    if (tabContent) {
                        tabContent.classList.add('active', 'show', 'fade-in');
                        
                        // Remove animation class after animation completes
                        setTimeout(() => {
                            tabContent.classList.remove('fade-in');
                        }, 500);
                    }
                }
            });
        });
    }
}

/**
 * Initialize all sliders
 */
function initializeSliders() {
    // Initialize testimonial slider if exists
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider && typeof Swiper !== 'undefined') {
        new Swiper(testimonialSlider, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // Initialize hero slider if exists
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider && typeof Swiper !== 'undefined') {
        new Swiper(heroSlider, {
            slidesPerView: 1,
            effect: 'fade',
            speed: 1000,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }
    
    // Initialize partner logo slider if exists
    const partnerSlider = document.querySelector('.partner-slider');
    if (partnerSlider && typeof Swiper !== 'undefined') {
        new Swiper(partnerSlider, {
            slidesPerView: 2,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                576: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 4,
                },
                992: {
                    slidesPerView: 5,
                }
            }
        });
    }
    
    // Initialize course slider if exists
    const courseSlider = document.querySelector('.course-slider');
    if (courseSlider && typeof Swiper !== 'undefined') {
        new Swiper(courseSlider, {
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                576: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                }
            }
        });
    }
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerOffset = 100;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = targetPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // Search toggle functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    
    if (searchToggle && searchForm) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchForm.classList.toggle('active');
            
            // Auto focus the search input
            if (searchForm.classList.contains('active')) {
                searchForm.querySelector('input').focus();
            }
        });
        
        // Close search form when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
                searchForm.classList.remove('active');
            }
        });
    }
    
    // Active menu link highlighting
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (linkPath && currentLocation.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
            
            // If in dropdown, add active to parent
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.querySelector('.dropdown-toggle').classList.add('active');
            }
        } else if (linkPath === '/' && currentLocation === '/') {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize form validations
 */
function initializeFormValidations() {
    const forms = document.querySelectorAll('.needs-validation');
    
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                form.classList.add('was-validated');
            }, false);
            
            // Custom validation for specific fields
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                field.addEventListener('input', function() {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    
                    if (emailRegex.test(field.value)) {
                        field.setCustomValidity('');
                    } else {
                        field.setCustomValidity('Vui lòng nhập địa chỉ email hợp lệ');
                    }
                });
            });
            
            // Password strength validation
            const passwordFields = form.querySelectorAll('input[type="password"]');
            passwordFields.forEach(field => {
                if (field.classList.contains('password-strength')) {
                    field.addEventListener('input', function() {
                        const value = field.value;
                        const strengthMeter = field.nextElementSibling;
                        
                        if (strengthMeter && strengthMeter.classList.contains('password-strength-meter')) {
                            const strength = calculatePasswordStrength(value);
                            
                            // Update strength meter
                            strengthMeter.style.width = `${strength}%`;
                            
                            if (strength < 40) {
                                strengthMeter.style.backgroundColor = 'var(--bs-danger)';
                                field.setCustomValidity('Mật khẩu quá yếu');
                            } else if (strength < 70) {
                                strengthMeter.style.backgroundColor = 'var(--bs-warning)';
                                field.setCustomValidity('');
                            } else {
                                strengthMeter.style.backgroundColor = 'var(--bs-success)';
                                field.setCustomValidity('');
                            }
                        }
                    });
                }
            });
        });
    }
}

/**
 * Calculate password strength as percentage
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length contribution
    if (password.length >= 8) {
        strength += 25;
    } else {
        strength += (password.length / 8) * 25;
    }
    
    // Complexity contribution
    if (/[A-Z]/.test(password)) strength += 15; // Uppercase
    if (/[a-z]/.test(password)) strength += 15; // Lowercase
    if (/[0-9]/.test(password)) strength += 15; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 15; // Special characters
    
    // Variety contribution
    const uniqueChars = new Set(password).size;
    strength += (uniqueChars / password.length) * 15;
    
    return Math.min(100, strength);
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoad() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.classList.remove('lazy');
                img.classList.add('lazy-loaded');
            }
        });
    }
}

/**
 * Initialize video backgrounds
 */
function initializeVideoBg() {
    const videoElements = document.querySelectorAll('.hero-video-bg');
    
    videoElements.forEach(video => {
        // Set video attributes
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        
        // Play video when ready
        if (video.readyState >= 3) {
            video.play();
        } else {
            video.addEventListener('loadeddata', function() {
                video.play();
            });
        }
        
        // Reinitialize video on window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth < 768) {
                    video.pause();
                } else {
                    video.play();
                }
            }, 250);
        });
    });
    
    // Parallax sections
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    if (parallaxSections.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            
            parallaxSections.forEach(section => {
                const speed = parseFloat(section.getAttribute('data-speed') || 0.5);
                const yPos = scrollTop * speed;
                section.style.backgroundPositionY = `${yPos}px`;
            });
        });
    }
}

/**
 * Animations for HUB website
 * Includes counter animations, scroll reveal, and hover effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize counter animations
    initCounterAnimations();
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize hover effects
    initHoverEffects();
    
    // Initialize parallax effects
    initParallax();
    
    // Initialize tilt effects for cards
    initTiltEffect();
});

/**
 * Counter animation for statistics - xử lý cả stat-number và counter-number
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .counter-number');
    
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count') || 0);
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000;
                const startValue = 0;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    if (elapsedTime >= duration) {
                        counter.textContent = target + suffix;
                        return;
                    }
                    
                    const progress = elapsedTime / duration;
                    const currentValue = Math.floor(progress * target);
                    counter.textContent = currentValue + suffix;
                    requestAnimationFrame(updateCounter);
                }
                
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Scroll reveal animations for elements
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .fade-in-up, .fade-in-left, .fade-in-right');
    
    if (revealElements.length === 0) return;
    
    const options = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get animation delay
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed', 'visible');
                }, delay * 1000);
                
                // Unobserve after revealing
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    revealElements.forEach(element => {
        // Set initial state
        if (element.classList.contains('reveal')) {
            element.classList.add('reveal-init');
            
            // Get animation direction
            const direction = element.getAttribute('data-reveal') || 'up';
            element.classList.add(`reveal-${direction}`);
        }
        
        // Observe element
        observer.observe(element);
    });
}

/**
 * Hover effects for elements
 */
function initHoverEffects() {
    // Card hover effects
    const hoverCards = document.querySelectorAll('.hover-card, .course-card');
    
    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hovered');
        });
    });
    
    // Image hover zoom effect
    const zoomImages = document.querySelectorAll('.img-zoom');
    
    zoomImages.forEach(img => {
        const imgContainer = img.parentElement;
        
        imgContainer.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.05)';
        });
        
        imgContainer.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
        });
    });
}

/**
 * Parallax effect for background elements
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.1;
            const position = element.getAttribute('data-position') || 'center';
            const direction = element.getAttribute('data-direction') || 'normal';
            
            let yPos;
            if (direction === 'reverse') {
                yPos = `-${scrollY * speed}px`;
            } else {
                yPos = `${scrollY * speed}px`;
            }
            
            element.style.backgroundPosition = `${position} ${yPos}`;
        });
    });
}

/**
 * Tilt effect for cards and images
 */
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt], .tilt-effect');
    
    if (tiltElements.length === 0) return;
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const box = element.getBoundingClientRect();
            const xPos = (e.clientX - box.left) / box.width;
            const yPos = (e.clientY - box.top) / box.height;
            
            const xOffset = (xPos - 0.5) * 20;
            const yOffset = (yPos - 0.5) * 20;
            
            element.style.transform = `perspective(1000px) rotateX(${-yOffset}deg) rotateY(${xOffset}deg)`;
        });
        
        element.addEventListener('mouseleave', function() {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/**
 * Smooth scrolling for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
            }
        }
    });
});

/**
 * Back to top button functionality
 */
(function() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 600) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();

// Thêm khởi tạo trong DOMContentLoaded event ở cuối file
window.addEventListener('load', function() {
    // Khởi tạo hiệu ứng counter nếu chưa được khởi tạo
    const counters = document.querySelectorAll('.counter-number, .stat-number');
    if (counters.length > 0) {
        const visibleCounters = Array.from(counters).filter(counter => {
            const rect = counter.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
        });
        
        if (visibleCounters.length > 0) {
            visibleCounters.forEach(counter => {
                if (counter.textContent === "0") {
                    const target = parseInt(counter.getAttribute('data-count'));
                    const suffix = counter.getAttribute('data-suffix') || '';
                    const duration = 1000;
                    const startTime = performance.now();
                    const startValue = 0;
                    
                    function animate(currentTime) {
                        const elapsedTime = currentTime - startTime;
                        if (elapsedTime >= duration) {
                            counter.textContent = target + suffix;
                            return;
                        }
                        
                        const progress = elapsedTime / duration;
                        const currentValue = Math.floor(progress * target);
                        counter.textContent = currentValue + suffix;
                        requestAnimationFrame(animate);
                    }
                    
                    requestAnimationFrame(animate);
                }
            });
        }
    }
}); 
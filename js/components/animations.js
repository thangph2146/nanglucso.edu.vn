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
 * Counter animation for statistics
 */
function initCounterAnimations() {
    const counterElements = document.querySelectorAll('.counter');
    
    if (counterElements.length === 0) return;
    
    const options = {
        threshold: 0.5,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = parseInt(counter.getAttribute('data-duration') || 2000);
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, options);
    
    counterElements.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Scroll reveal animations for elements
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;
    
    const options = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Unobserve after revealing
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    revealElements.forEach(element => {
        // Set initial state
        element.classList.add('reveal-init');
        
        // Get animation direction
        const direction = element.getAttribute('data-reveal') || 'up';
        element.classList.add(`reveal-${direction}`);
        
        // Get animation delay
        const delay = element.getAttribute('data-delay') || 0;
        element.style.transitionDelay = `${delay}ms`;
        
        // Observe element
        observer.observe(element);
    });
}

/**
 * Hover effects for elements
 */
function initHoverEffects() {
    // Card hover effects
    const hoverCards = document.querySelectorAll('.hover-card');
    
    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hovered');
        });
    });
    
    // Button hover effects with magnetic pull
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const position = button.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'translate(0px, 0px)';
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
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    if (tiltElements.length === 0) return;
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const box = element.getBoundingClientRect();
            const xPos = (e.clientX - box.left) / box.width;
            const yPos = (e.clientY - box.top) / box.height;
            
            const xOffset = (xPos - 0.5) * 20;
            const yOffset = (yPos - 0.5) * 20;
            
            element.style.transform = `perspective(1000px) rotateX(${-yOffset}deg) rotateY(${xOffset}deg)`;
            
            // Add highlight effect
            const glare = element.querySelector('.tilt-glare');
            if (glare) {
                glare.style.opacity = 0.3;
                glare.style.transform = `translate(${xPos * 100}%, ${yPos * 100}%)`;
            }
        });
        
        element.addEventListener('mouseleave', function() {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            
            // Remove highlight effect
            const glare = element.querySelector('.tilt-glare');
            if (glare) {
                glare.style.opacity = 0;
            }
        });
        
        // Add glare element
        const glare = document.createElement('div');
        glare.classList.add('tilt-glare');
        glare.style.position = 'absolute';
        glare.style.top = 0;
        glare.style.left = 0;
        glare.style.width = '100%';
        glare.style.height = '100%';
        glare.style.background = 'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 80%)';
        glare.style.opacity = 0;
        glare.style.pointerEvents = 'none';
        glare.style.transition = 'opacity 0.3s ease';
        
        if (element.style.position !== 'absolute' && element.style.position !== 'fixed') {
            element.style.position = 'relative';
        }
        
        element.appendChild(glare);
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
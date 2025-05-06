// Animation functionalities
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation on scroll
    initAOS();
    
    // Initialize counters
    initCounters();

    // Initialize back to top button
    initBackToTop();
});

// Animation on scroll
function initAOS() {
    const animatedElements = document.querySelectorAll('.animate-fadeInUp');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all elements with animate-fadeInUp class
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    // Create Intersection Observer for counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let count = 0;
                const duration = 2000; // 2 seconds
                const interval = Math.floor(duration / target);
                
                const timer = setInterval(() => {
                    count++;
                    counter.textContent = count;
                    
                    if (count >= target) {
                        clearInterval(timer);
                    }
                }, interval);
                
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe all counter elements
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} 
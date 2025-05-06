// Tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Tab animations
    initTabAnimations();
});

// Tab animations
function initTabAnimations() {
    const categoryTabs = document.getElementById('coursesTabs');
    
    if (categoryTabs) {
        categoryTabs.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                const tabPane = document.querySelector(e.target.getAttribute('data-bs-target'));
                
                if (tabPane) {
                    tabPane.classList.add('fade-in');
                    setTimeout(() => {
                        tabPane.classList.remove('fade-in');
                    }, 500);
                }
            }
        });
    }
} 
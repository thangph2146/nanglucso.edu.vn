// Tabs functionality
/**
 * Tab-related JavaScript functionalities.
 * As of the current version, general tab initialization, including animations,
 * is handled by the initializeComponents() function in js/main.js.
 * This file (tabs.js) can be used for more specific tab enhancements if needed in the future.
 */

document.addEventListener('DOMContentLoaded', function() {
    // console.log('tabs.js loaded');
    // Specific tab functionalities can be initialized here if they are not covered by main.js

    /* Example of how initTabAnimations was structured, now handled by main.js
    function initTabAnimations() {
        const categoryTabs = document.getElementById('coursesTabs'); // Specific ID, main.js is more generic
        
        if (categoryTabs) {
            categoryTabs.addEventListener('click', function(e) {
                if (e.target.classList.contains('nav-link')) {
                    const tabPaneId = e.target.getAttribute('data-bs-target') || e.target.getAttribute('href');
                    const tabPane = document.querySelector(tabPaneId);
                    
                    if (tabPane) {
                        // The fade-in animation logic is now part of the tab switching in main.js
                        // tabPane.classList.add('fade-in');
                        // setTimeout(() => {
                        //     tabPane.classList.remove('fade-in');
                        // }, 500);
                    }
                }
            });
        }
    }

    // Call specific tab initializations if any
    // initTabAnimations(); // This is now redundant due to main.js handling
    */
});
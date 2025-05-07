/**
 * Header JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.overlay'); 

    // Toggle search modal
    const searchButtonDesktop = document.querySelector('.main-nav .d-lg-flex .btn[data-bs-target="#searchModal"]');
    const searchModal = document.getElementById('searchModal');
    
    if (searchButtonDesktop && searchModal) {
        const searchModalObj = new bootstrap.Modal(searchModal);
        searchButtonDesktop.addEventListener('click', function() {
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
                const mobileMenu = document.getElementById('navbarContent');
                if (mobileMenu && mobileMenu.classList.contains('show')) {
                    const mobileMenuInstance = bootstrap.Collapse.getInstance(mobileMenu);
                    if (mobileMenuInstance) {
                        mobileMenuInstance.hide();
                    }
                }

                // Close any open offcanvas
                const openOffcanvas = document.querySelector('.offcanvas.show');
                if (openOffcanvas) {
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(openOffcanvas);
                    if (offcanvasInstance) {
                        offcanvasInstance.hide();
                    }
                }
            }
        });
    });
    
    // Mobile menu animations and overlay handling
    const mobileNavbarToggler = document.querySelector('.navbar-toggler.d-lg-none');
    const mobileMenu = document.getElementById('navbarContent');

    if (mobileNavbarToggler && mobileMenu) {
        mobileMenu.addEventListener('show.bs.collapse', function () {
            // Overlay is no longer activated by mobile menu itself
            document.body.classList.add('menu-open');
            const navItems = mobileMenu.querySelectorAll('.navbar-nav > .nav-item');
            navItems.forEach((item, index) => {
                item.classList.remove('item-visible'); // Reset before showing
                setTimeout(() => {
                    item.classList.add('item-visible');
                }, index * 80); // Animation delay
            });
        });

        mobileMenu.addEventListener('hide.bs.collapse', function () {
            // Overlay is no longer deactivated by mobile menu itself
            // If an offcanvas is not taking over, then remove menu-open
            const isActiveOffcanvas = document.querySelector('.offcanvas.show');
            if (!isActiveOffcanvas) {
                document.body.classList.remove('menu-open');
            }
            const navItems = mobileMenu.querySelectorAll('.navbar-nav > .nav-item.item-visible');
            navItems.forEach((item) => {
                item.classList.remove('item-visible');
            });
        });

        // Ngăn chặn click bên trong menu mobile đóng menu
        mobileMenu.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    // Combined Offcanvas Submenu Logic for Desktop and Mobile
    const navLinksWithOffcanvas = document.querySelectorAll('.nav-link[data-bs-toggle="offcanvas"]');

    navLinksWithOffcanvas.forEach(link => {
        const offcanvasTargetId = link.getAttribute('data-bs-target');
        if (!offcanvasTargetId) return;

        const offcanvasElement = document.querySelector(offcanvasTargetId);
        if (!offcanvasElement) return;

        offcanvasElement.addEventListener('show.bs.offcanvas', function () {
            if (overlay) { // Overlay always active for any offcanvas
                overlay.classList.add('active');
            }
            document.body.classList.add('menu-open'); // Keep body scroll locked

            const isMobileTrigger = link.closest('#navbarContent');
            if (isMobileTrigger && mobileMenu && mobileMenu.classList.contains('show')) {
                const mobileMenuInstance = bootstrap.Collapse.getInstance(mobileMenu);
                if (mobileMenuInstance) {
                    mobileMenuInstance.hide();
                }
                offcanvasElement.dataset.triggeredFromMobile = 'true'; 
            }

            const offcanvasTitleElement = this.querySelector('.offcanvas-title');
            const offcanvasBody = this.querySelector('.offcanvas-body');
            const mainMenuItemText = link.textContent.trim();
            
            if (offcanvasTitleElement) {
                offcanvasTitleElement.textContent = mainMenuItemText;
            }

            if (offcanvasBody) {
                const contentSourceId = link.getAttribute('data-content-source');
                const contentSourceElement = document.getElementById(contentSourceId);

                if (contentSourceElement) {
                    let parentMobileIconClass = null;
                    // Directly use the icon from the clicked link (applies to both desktop and mobile)
                    const iconElementOnTrigger = link.querySelector('i.menu-icon');
                    if (iconElementOnTrigger) {
                        parentMobileIconClass = Array.from(iconElementOnTrigger.classList).filter(cls => cls !== 'menu-icon').join(' ');
                    }
                    
                    cloneAndRestructureContentNode(contentSourceElement, offcanvasBody, parentMobileIconClass);
                } else {
                    offcanvasBody.innerHTML = '<p class="text-center p-3">Lỗi: Không tìm thấy nguồn nội dung (ID: ' + contentSourceId + ').</p>';
                }
            }
            
            // Animation Logic (from previous step - UNCHANGED)
            if (offcanvasBody) {
                const previouslyAnimatedItems = offcanvasBody.querySelectorAll('.offcanvas-item-animate-in');
                previouslyAnimatedItems.forEach(item => item.classList.remove('offcanvas-item-animate-in'));
                const itemsToAnimate = Array.from(offcanvasBody.children);
                itemsToAnimate.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('offcanvas-item-animate-in');
                    }, index * 100); 
                });
            }
        });

        offcanvasElement.addEventListener('hide.bs.offcanvas', function () {
            if (overlay) { // Overlay always deactivated with offcanvas
                overlay.classList.remove('active');
            }
            // Only remove 'menu-open' if mobile menu is not also trying to be open.
            // If triggered from mobile, mobile menu will re-show and handle its 'menu-open' and overlay.
            if (offcanvasElement.dataset.triggeredFromMobile === 'true') {
                if (mobileMenu) {
                     const mobileMenuInstance = bootstrap.Collapse.getInstance(mobileMenu);
                     if (mobileMenuInstance) {
                        // Check if it's not already shown or being shown to avoid issues
                        if (!mobileMenu.classList.contains('show') && !mobileMenu.classList.contains('collapsing')) {
                           mobileMenuInstance.show();
                        }
                     }
                }
                delete offcanvasElement.dataset.triggeredFromMobile;
            } else if (!document.querySelector('.navbar-collapse.show')) { 
                // If not triggered from mobile, and no other collapse menu is showing
                document.body.classList.remove('menu-open');
            }
            
            const offcanvasBody = this.querySelector('.offcanvas-body');
            if (offcanvasBody) {
                const animatedItems = offcanvasBody.querySelectorAll('.offcanvas-item-animate-in');
                animatedItems.forEach(item => {
                    item.classList.remove('offcanvas-item-animate-in');
                });
            }
        });
    });

    // --- Overlay Click Handler (Universal for closing mobile menu or desktop offcanvas) ---
    if (overlay) {
        overlay.addEventListener('click', function() {
            const activeOffcanvas = document.querySelector('.offcanvas.show');
            
            // If mobile menu is open AND no offcanvas is active (or was triggered from mobile)
            // If an offcanvas IS active, clicking overlay should close IT, and then the offcanvas's hide logic will handle overlay.
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                if (!activeOffcanvas) { // Only hide mobile menu if no offcanvas is currently controlling the overlay
                     const mobileMenuInstance = bootstrap.Collapse.getInstance(mobileMenu);
                     if (mobileMenuInstance) {
                        mobileMenuInstance.hide();
                     }
                }
            }
            
            // Check if any offcanvas is open (this part is primary for overlay clicks)
            if (activeOffcanvas) {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(activeOffcanvas);
                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }
            }
        });
    }
});

function cloneAndRestructureContentNode(sourceNode, offcanvasBody, parentMobileIconClass) {
    const clonedSource = sourceNode.cloneNode(true);
    offcanvasBody.innerHTML = ''; // Clear previous content

    // Remove general mobile-specific icons like main menu icons or dropdown arrows early
    // We keep .menu-icon-sub as those are specific to items
    clonedSource.querySelectorAll('.arrow-icon, .menu-icon:not(.menu-icon-sub)').forEach(icon => icon.remove());

    let currentListElement = null;

    function ensureListExists() {
        if (!currentListElement) {
            currentListElement = document.createElement('ul');
            currentListElement.className = 'offcanvas-submenu-items';
            offcanvasBody.appendChild(currentListElement);
        }
        return currentListElement;
    }

    function resetCurrentList() {
        currentListElement = null;
    }

    function processChildren(parentElement) {
        Array.from(parentElement.children).forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            // Ưu tiên xử lý .dropdown-header để đảm bảo nó luôn là H6 không có href
            if (node.classList.contains('dropdown-header')) {
                resetCurrentList();
                const title = document.createElement('h6');
                title.className = 'offcanvas-submenu-group-title';
                // Lấy text content, không quan tâm thẻ gốc là a hay h6
                title.textContent = node.textContent.trim(); 
                
                // Gắn icon của mục cha (nếu có)
                if (parentMobileIconClass) { 
                    const icon = document.createElement('i');
                    icon.className = parentMobileIconClass; 
                    // Chèn icon vào đầu, trước text
                    title.insertBefore(icon, title.firstChild); 
                }
                offcanvasBody.appendChild(title);
            }
            
            // Handle UL elements
            else if (node.tagName === 'UL' && (node.classList.contains('dropdown-menu') || node.classList.contains('submenu-list'))) {
                processChildren(node);
            } 
            // Handle LI elements
            else if (node.tagName === 'LI') {
                processChildren(node); 
            }
            // Handle A tags (links) - không phải dropdown-header
            else if (node.tagName === 'A') {
                if (node.classList.contains('view-all-link')) {
                    resetCurrentList();
                    const clonedLink = node.cloneNode(true); 
                    clonedLink.className = 'offcanvas-view-all-link';
                    clonedLink.removeAttribute('style'); 
                    
                    const viewAllWrapper = document.createElement('div');
                    viewAllWrapper.className = 'offcanvas-view-all-wrapper';
                    viewAllWrapper.appendChild(clonedLink);
                    offcanvasBody.appendChild(viewAllWrapper);
                } else if (node.classList.contains('dropdown-item')) {
                    const list = ensureListExists();
                    const newListItem = document.createElement('li');
                    const newLink = document.createElement('a');
                    newLink.href = node.getAttribute('href') || '#';
                    newLink.className = 'offcanvas-submenu-link';

                    let textContent = '';
                    let iconSubElement = null;

                    // Preserve text and .menu-icon-sub from the source <a>
                    Array.from(node.childNodes).forEach(childNode => {
                        if (childNode.nodeType === Node.TEXT_NODE) {
                            textContent += childNode.textContent;
                        } else if (childNode.nodeType === Node.ELEMENT_NODE && childNode.classList.contains('menu-icon-sub')) {
                            iconSubElement = childNode.cloneNode(true);
                            iconSubElement.removeAttribute('style'); // Remove any inline styles
                        }
                        // Ignore other elements like .menu-icon or .arrow-icon as they are handled globally or not needed
                    });

                    if (iconSubElement) {
                        newLink.appendChild(iconSubElement);
                    }
                    newLink.appendChild(document.createTextNode(textContent.trim()));
                    
                    if (newLink.textContent.trim() !== '' || newLink.querySelector('.menu-icon-sub')) {
                        newListItem.appendChild(newLink);
                        list.appendChild(newListItem);
                    }
                }
            } 
            // Handle HR tags
            else if (node.tagName === 'HR') {
                resetCurrentList();
                const hrElement = document.createElement('hr');
                offcanvasBody.appendChild(hrElement);
            }
        });
    }

    // The sourceNode is typically a UL (dropdown-menu) or DIV (mega-menu - now removed).
    // We should directly process its children.
    processChildren(clonedSource);
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
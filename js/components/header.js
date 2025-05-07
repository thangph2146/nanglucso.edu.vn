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
                
                const mobileNavbarCollapse = document.getElementById('navbarContent');
                if (mobileNavbarCollapse && mobileNavbarCollapse.classList.contains('show')) {
                    const mobileNavbarToggler = document.querySelector('.navbar-toggler.d-lg-none');
                    if (mobileNavbarToggler) mobileNavbarToggler.click();
                }

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
            if (overlay && window.innerWidth < 992) {
                overlay.classList.add('active');
            }
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
            if (overlay && window.innerWidth < 992) {
                overlay.classList.remove('active');
            }
            document.body.classList.remove('menu-open');
            const navItems = mobileMenu.querySelectorAll('.navbar-nav > .nav-item.item-visible');
            navItems.forEach((item) => {
                item.classList.remove('item-visible');
            });
        });
    }

    // Desktop Offcanvas Submenu Logic
    const desktopNavLinksWithOffcanvas = document.querySelectorAll('.navbar-nav.d-lg-flex .nav-link[data-bs-toggle="offcanvas"]');

    desktopNavLinksWithOffcanvas.forEach(link => {
        const offcanvasTargetId = link.getAttribute('data-bs-target');
        if (!offcanvasTargetId) return;

        const offcanvasElement = document.querySelector(offcanvasTargetId);
        if (!offcanvasElement) return;

        offcanvasElement.addEventListener('show.bs.offcanvas', function () {
            if (overlay && window.innerWidth >= 992) {
                overlay.classList.add('active');
            }
            document.body.classList.add('menu-open');
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
                    const mobileMenuParentLinkId = contentSourceElement.getAttribute('aria-labelledby');
                    if (mobileMenuParentLinkId) {
                        const mobileMenuParentLink = document.getElementById(mobileMenuParentLinkId);
                        if (mobileMenuParentLink) {
                            const iconElement = mobileMenuParentLink.querySelector('i.menu-icon');
                            if (iconElement) {
                                // Lấy tất cả các class của icon trừ class 'menu-icon' (nếu có) để tránh xung đột
                                parentMobileIconClass = Array.from(iconElement.classList).filter(cls => cls !== 'menu-icon').join(' ');
                            }
                        }
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
            if (overlay && window.innerWidth >= 992) {
                overlay.classList.remove('active');
            }
            document.body.classList.remove('menu-open');
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
            // Check if mobile menu is open
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                mobileNavbarToggler.click(); // Simulate a click on the toggler to close it
            }
            
            // Check if any desktop offcanvas is open
            const openOffcanvasDesktop = document.querySelector('.offcanvas.show');
            if (openOffcanvasDesktop) {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(openOffcanvasDesktop);
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
    clonedSource.querySelectorAll('.arrow-icon, .menu-icon').forEach(icon => icon.remove());

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
                
                // Gắn icon của mục cha (nếu có và nếu logic này được áp dụng cho dropdown-header)
                if (parentMobileIconClass) { // parentMobileIconClass được truyền vào cloneAndRestructureContentNode
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

                    Array.from(node.childNodes).forEach(childNode => {
                        if (childNode.nodeType === Node.TEXT_NODE) {
                            textContent += childNode.textContent;
                        } else if (childNode.nodeType === Node.ELEMENT_NODE && childNode.classList.contains('menu-icon-sub')) {
                            iconSubElement = childNode.cloneNode(true);
                            iconSubElement.removeAttribute('style');
                        }
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
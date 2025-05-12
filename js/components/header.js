/**
 * Header JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.overlay'); 

    // Toggle search modal
    const searchModalTriggers = document.querySelectorAll('button[data-bs-target="#searchModal"]');
    const searchModalElement = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInputModal'); // Get the input field
    const btnClearSearch = searchModalElement ? searchModalElement.querySelector('.btn-clear-search') : null; // Get the clear button
    
    if (searchModalTriggers.length > 0 && searchModalElement) {
        const searchModalObj = new bootstrap.Modal(searchModalElement);
        searchModalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                searchModalObj.show();
            });
        });

        // Autofocus on input when modal is shown
        searchModalElement.addEventListener('shown.bs.modal', function () {
            if (searchInput) {
                searchInput.focus();
            }
        });

        // Logic for clear search button
        if (searchInput && btnClearSearch) {
            searchInput.addEventListener('input', function() {
                if (searchInput.value.length > 0) {
                    btnClearSearch.classList.remove('d-none');
                } else {
                    btnClearSearch.classList.add('d-none');
                }
            });

            btnClearSearch.addEventListener('click', function() {
                searchInput.value = '';
                btnClearSearch.classList.add('d-none');
                searchInput.focus();
            });
        }
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

    // Scroll to hide/show topbar
    const header = document.querySelector('.header');
    const topbar = document.querySelector('.topbar');
    let lastScrollTop = 0;
    let topbarHeight = 0;

    function updateTopbarHeight() {
        if (topbar && getComputedStyle(topbar).display !== 'none') {
            topbarHeight = topbar.offsetHeight;
            document.documentElement.style.setProperty('--topbar-height', `${topbarHeight}px`);
        } else {
            topbarHeight = 0; // Topbar is hidden (e.g., on mobile)
            document.documentElement.style.setProperty('--topbar-height', `0px`);
        }
    }

    if (header && topbar) {
        updateTopbarHeight(); // Initial calculation
        window.addEventListener('resize', updateTopbarHeight); // Recalculate on resize

        window.addEventListener('scroll', function() {
            // Check if topbar is visible (not on mobile where display: none)
            if (getComputedStyle(topbar).display === 'none') {
                // Ensure header is not translated if topbar is not displayed
                header.classList.remove('header-scrolled-up');
                topbar.classList.remove('topbar-hidden'); // Reset classes if any
                return; // Don't run scroll logic for header/topbar if topbar is hidden by CSS
            }

            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollThreshold = topbarHeight > 0 ? topbarHeight : 50; // Use actual height if available

            if (scrollTop <= 5) { // At the very top or very close to it
                topbar.classList.remove('topbar-hidden');
                header.classList.remove('header-scrolled-up');
            } else if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) { // Scrolling Down
                topbar.classList.add('topbar-hidden');
                header.classList.add('header-scrolled-up');
            } else if (scrollTop < lastScrollTop) { // Scrolling Up
                // Only remove if user scrolls up significantly, not just minor fluctuations
                // Or if they scroll back above the threshold
                if (scrollTop < (lastScrollTop - 10) || scrollTop <= scrollThreshold) {
                    topbar.classList.remove('topbar-hidden');
                    header.classList.remove('header-scrolled-up');
                }
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }
});

function cloneAndRestructureContentNode(sourceNode, offcanvasBody, parentMobileIconClass) {
    const clonedSource = sourceNode.cloneNode(true);
    offcanvasBody.innerHTML = '';
    clonedSource.querySelectorAll('.arrow-icon, .menu-icon:not(.menu-icon-sub)').forEach(icon => icon.remove());

    // Đệ quy sinh menu đa cấp, trả về <ul> hoặc <li> đúng chuẩn
    function processNode(node, depth = 0) {
        if (node.nodeType !== Node.ELEMENT_NODE) return null;

        // Header nhóm
        if (node.classList.contains('dropdown-header')) {
            const title = document.createElement('h6');
            title.className = 'offcanvas-submenu-group-title';
            title.textContent = node.textContent.trim();
            if (parentMobileIconClass && depth === 0) {
                const icon = document.createElement('i');
                icon.className = parentMobileIconClass;
                title.insertBefore(icon, title.firstChild);
            }
            offcanvasBody.appendChild(title);
            return null;
        }
        // HR
        if (node.tagName === 'HR') {
            const hr = document.createElement('hr');
            offcanvasBody.appendChild(hr);
            return null;
        }
        // Lĩnh vực chính hoặc nhánh con
        if (node.tagName === 'LI') {
            // Tìm <a> và <ul> con (nếu có)
            let aNode = null;
            let ulNode = null;
            Array.from(node.children).forEach(child => {
                if (child.tagName === 'A') aNode = child;
                if (child.tagName === 'UL') ulNode = child;
            });
            // Nếu không có <a> thì bỏ qua
            if (!aNode) return null;
            const li = document.createElement('li');
            // Xử lý <a>
            const a = processNode(aNode, depth);
            if (a) li.appendChild(a);
            // Xử lý <ul> nhánh con
            if (ulNode) {
                const subUl = processNode(ulNode, depth + 1);
                if (subUl && subUl.children.length > 0) li.appendChild(subUl);
            }
            return li;
        }
        // <ul> danh sách các mục
        if (node.tagName === 'UL') {
            const ul = document.createElement('ul');
            ul.className = 'offcanvas-submenu-list ps-3';
            Array.from(node.children).forEach(child => {
                const li = processNode(child, depth);
                if (li) ul.appendChild(li);
            });
            return ul;
        }
        // <a> link
        if (node.tagName === 'A') {
            const a = document.createElement('a');
            a.href = node.getAttribute('href') || '#';
            a.className = 'offcanvas-submenu-link';
            if (depth > 0) a.classList.add('small');
            // Copy icon
            const iconSub = node.querySelector('.menu-icon-sub');
            if (iconSub) {
                const iconClone = iconSub.cloneNode(true);
                iconClone.removeAttribute('style');
                a.appendChild(iconClone);
            }
            a.appendChild(document.createTextNode(' ' + node.textContent.trim()));
            return a;
        }
        return null;
    }

    // Bắt đầu xử lý các con của sourceNode
    Array.from(clonedSource.children).forEach(child => {
        const result = processNode(child, 0);
        if (result) offcanvasBody.appendChild(result);
    });
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
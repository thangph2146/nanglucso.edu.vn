/**
 * Main JavaScript file
 * Trường Đại học Ngân hàng TP.HCM - HUB
 */

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các tooltip và popover của Bootstrap nếu có
    initBootstrapComponents();

    // Stick Header khi cuộn trang
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // Hiệu ứng hiển thị số đếm
    const countElements = document.querySelectorAll('.stats-counter h2');
    
    if (countElements.length > 0) {
        const options = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const targetValue = parseInt(target.textContent.replace(/,/g, ''));
                    let startValue = 0;
                    const duration = 2000;
                    const increment = Math.ceil(targetValue / (duration / 16));
                    
                    const counter = setInterval(function() {
                        startValue += increment;
                        
                        if (startValue >= targetValue) {
                            target.textContent = targetValue.toLocaleString();
                            clearInterval(counter);
                        } else {
                            target.textContent = startValue.toLocaleString();
                        }
                    }, 16);
                    
                    observer.unobserve(target);
                }
            });
        }, options);
        
        countElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Tăng tính tương tác cho tab
    const categoryTabs = document.getElementById('categoryTab');
    
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

    // Chức năng sắp xếp bảng Bootstrap
    const sortableTables = document.querySelectorAll('.table');
    
    sortableTables.forEach(table => {
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach((th, index) => {
            if (index > 0 && index < headerCells.length - 1) { // Bỏ qua cột đầu tiên và cột cuối cùng
                th.style.cursor = 'pointer';
                th.classList.add('sortable');
                th.addEventListener('click', () => sortTable(table, index));
                // Thêm icon sắp xếp
                const sortIcon = document.createElement('i');
                sortIcon.classList.add('bi', 'bi-arrow-down-up', 'ms-1', 'sort-icon');
                sortIcon.style.fontSize = '0.75rem';
                th.appendChild(sortIcon);
            }
        });
    });

    function sortTable(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const th = table.querySelectorAll('thead th')[columnIndex];
        
        // Xác định hướng sắp xếp
        const isAscending = th.classList.contains('asc');
        
        // Reset tất cả các header
        table.querySelectorAll('thead th').forEach(header => {
            header.classList.remove('asc', 'desc');
            const icon = header.querySelector('.sort-icon');
            if (icon) {
                icon.className = 'bi bi-arrow-down-up ms-1 sort-icon';
            }
        });
        
        // Đặt hướng sắp xếp mới
        if (isAscending) {
            th.classList.add('desc');
            const icon = th.querySelector('.sort-icon');
            if (icon) {
                icon.className = 'bi bi-arrow-down ms-1 sort-icon';
            }
        } else {
            th.classList.add('asc');
            const icon = th.querySelector('.sort-icon');
            if (icon) {
                icon.className = 'bi bi-arrow-up ms-1 sort-icon';
            }
        }
        
        // Sắp xếp các dòng
        rows.sort((a, b) => {
            const cellA = a.querySelectorAll('td')[columnIndex - 1].textContent.trim();
            const cellB = b.querySelectorAll('td')[columnIndex - 1].textContent.trim();
            
            if (!isNaN(parseFloat(cellA)) && !isNaN(parseFloat(cellB))) {
                // Sắp xếp theo số
                return isAscending ? 
                    parseFloat(cellB) - parseFloat(cellA) : 
                    parseFloat(cellA) - parseFloat(cellB);
            } else {
                // Sắp xếp theo chữ
                return isAscending ? 
                    cellB.localeCompare(cellA, 'vi') : 
                    cellA.localeCompare(cellB, 'vi');
            }
        });
        
        // Hiển thị lại các dòng theo thứ tự mới
        rows.forEach(row => tbody.appendChild(row));
    }

    // Back to top button
    const backToTop = document.createElement('a');
    backToTop.classList.add('back-to-top');
    backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Thêm xử lý CSS cho nút Back to Top với JavaScript
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            text-decoration: none;
        }
        .back-to-top.active {
            opacity: 1;
            visibility: visible;
        }
        .back-to-top:hover {
            background-color: var(--secondary-color);
            transform: translateY(-3px);
        }
        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            0% { opacity: 0.7; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize table sorting functionality
    initTableSort();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize dropdown menus
    initDropdowns();
    
    // Initialize animation on scroll
    initAOS();
    
    // Initialize counters
    initCounters();
});

// Bootstrap Components Initialization
function initBootstrapComponents() {
    // Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Table sorting functionality
function initTableSort() {
    const tables = document.querySelectorAll('.sortable-table');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('th.sortable');
        
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const index = Array.from(this.parentNode.children).indexOf(this);
                const isAsc = this.classList.contains('asc');
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                // Clear all headers
                headers.forEach(h => {
                    h.classList.remove('asc', 'desc');
                    const icon = h.querySelector('.sort-icon');
                    if (icon) icon.textContent = '';
                });
                
                // Set current header
                this.classList.add(isAsc ? 'desc' : 'asc');
                const sortIcon = this.querySelector('.sort-icon');
                if (sortIcon) {
                    sortIcon.textContent = isAsc ? '▼' : '▲';
                }
                
                // Sort the rows
                rows.sort((a, b) => {
                    const aValue = a.children[index].textContent.trim();
                    const bValue = b.children[index].textContent.trim();
                    
                    // Check if the values are numbers
                    const aNum = parseFloat(aValue);
                    const bNum = parseFloat(bValue);
                    
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return isAsc ? bNum - aNum : aNum - bNum;
                    }
                    
                    // Otherwise, compare as strings
                    return isAsc
                        ? bValue.localeCompare(aValue, 'vi')
                        : aValue.localeCompare(bValue, 'vi');
                });
                
                // Reappend rows in the new order
                rows.forEach(row => tbody.appendChild(row));
            });
        });
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
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const toggleBtn = document.querySelector('.navbar-toggler');
    const closeBtn = document.querySelector('.close-menu');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const overlay = document.querySelector('.overlay');
    
    if (!toggleBtn || !navbarCollapse) return;
    
    toggleBtn.addEventListener('click', function() {
        navbarCollapse.classList.add('show');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    function closeMenu() {
        navbarCollapse.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Handle Dropdowns in Mobile View
    const dropdownToggleList = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggleList.forEach(dropdownToggle => {
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                const parent = this.parentNode;
                parent.classList.toggle('show');
            }
        });
    });
}

// Initialize dropdown menus
function initDropdowns() {
    // No extra JavaScript needed for hover style dropdowns
    // But we can add a click handler for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('show');
                }
            });
        }
    });
}

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
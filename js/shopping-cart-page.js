document.addEventListener('DOMContentLoaded', () => {
    let cartItems = getCartItems(); // getCartItems is from shopping-cart-page.js

    // Nếu giỏ hàng trống, thêm một khóa học mẫu cho mục đích demo trên trang này
    if (cartItems.length === 0) {
        const SAMPLE_COURSE_FOR_CART_PAGE_DEMO = { 
            id: "DEMO001", 
            name: "Khóa học Demo Đặc Biệt Cho Trang Giỏ Hàng",
            price: 990000 // Thêm giá cho khóa học demo
        };
        cartItems.push(SAMPLE_COURSE_FOR_CART_PAGE_DEMO);
        saveCartItems(cartItems); // saveCartItems is from shopping-cart-page.js
        
        // Tùy chọn: hiển thị toast thông báo đã thêm sản phẩm demo
        if (typeof showToast === 'function') { // Giả sử showToast có sẵn toàn cục từ cart.js
            showToast('Đã thêm khóa học demo vào giỏ hàng của bạn.', 'info');
        }
    }

    // Initialize cart interactions for the header cart icon (if not already handled by global cart.js)
    // This ensures the header cart icon count is updated even when manipulating cart on this page.
    if (typeof initializeCart === 'function') {
        // Assuming global cart.js might already initialize. 
        // We primarily need its updateCartCount and showToast.
        // If cart.js is guaranteed to load first and initialize, 
        // direct calls to its functions like updateCartCount() might be sufficient after page-specific actions.
    }

    renderCartPageItems();
    attachCartPageEventListeners();
});

function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCartItems(cartItems) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function renderCartPageItems() {
    const cartItems = getCartItems();
    const cartTableBody = document.getElementById('cart-page-table-body');
    const cartPageItemCount = document.getElementById('cart-page-item-count');
    const summaryItemCount = document.getElementById('summary-item-count');
    const cartEmptyMessage = document.getElementById('cart-page-empty-message');
    const cartTableWrapper = document.getElementById('cart-page-table-wrapper');
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');
    const summaryTotalPriceElement = document.getElementById('summary-total-price'); // Thêm ID này vào HTML

    if (!cartTableBody || !cartPageItemCount || !summaryItemCount || !cartEmptyMessage || !cartTableWrapper || !proceedToCheckoutBtn || !summaryTotalPriceElement) {
        console.error("Một hoặc nhiều phần tử DOM của trang giỏ hàng không tìm thấy (có thể thiếu summary-total-price).");
        return;
    }

    cartTableBody.innerHTML = ''; // Clear existing items
    let totalAmount = 0;

    if (cartItems.length === 0) {
        cartEmptyMessage.classList.remove('d-none');
        cartTableWrapper.classList.add('d-none');
        cartPageItemCount.textContent = '0';
        summaryItemCount.textContent = '0';
        proceedToCheckoutBtn.disabled = true;
        summaryTotalPriceElement.textContent = formatCurrency(0); // Sử dụng hàm formatCurrency
    } else {
        cartEmptyMessage.classList.add('d-none');
        cartTableWrapper.classList.remove('d-none');
        cartPageItemCount.textContent = cartItems.length;
        summaryItemCount.textContent = cartItems.length;
        proceedToCheckoutBtn.disabled = false;

        cartItems.forEach(item => {
            const row = cartTableBody.insertRow();
            const itemPrice = item.price || 0; // Mặc định giá là 0 nếu không có
            totalAmount += itemPrice * (item.quantity || 1);
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="images/courses/course-thumb-placeholder.jpg" alt="${item.name}" class="img-fluid rounded me-3 cart-item-thumbnail">
                        <div>
                            <h6 class="mb-1 cart-item-title">${item.name}</h6>
                            <small class="text-muted">Mã: ${item.id}</small>
                        </div>
                    </div>
                </td>
                <td class="text-center">${formatCurrency(itemPrice)}</td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger remove-item-page-btn" data-course-id="${item.id}" title="Xóa khóa học">
                        <i class="bi bi-trash"></i> <span class="d-none d-md-inline">Xóa</span>
                    </button>
                </td>
            `;
        });
        summaryTotalPriceElement.textContent = formatCurrency(totalAmount); // Hiển thị tổng tiền
    }
    // Also update the header cart count using the global function from cart.js
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

function attachCartPageEventListeners() {
    const cartTableBody = document.getElementById('cart-page-table-body');
    if (cartTableBody) {
        cartTableBody.addEventListener('click', function(event) {
            if (event.target.closest('.remove-item-page-btn')) {
                const button = event.target.closest('.remove-item-page-btn');
                const courseId = button.dataset.courseId;
                if (courseId) {
                    removeCourseFromCartPage(courseId);
                }
            }
        });
    }

    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', () => {
            // Placeholder for actual checkout process
            const cartItems = getCartItems();
            if (cartItems.length > 0) {
                alert('Chức năng "Hoàn tất đăng ký" đang được phát triển!\nBạn có ' + cartItems.length + ' khóa học trong giỏ.\nXem console để biết chi tiết.');
                console.log('Tiến hành checkout với các khóa học:', cartItems);
                // Here you would typically redirect to a payment page or a registration form
            } else {
                alert('Giỏ hàng của bạn đang trống. Vui lòng thêm khóa học trước khi đăng ký.');
            }
        });
    }
}

function removeCourseFromCartPage(courseId) {
    let cartItems = getCartItems();
    const itemIndex = cartItems.findIndex(item => item.id === courseId);

    if (itemIndex > -1) {
        const removedItemName = cartItems[itemIndex].name;
        cartItems.splice(itemIndex, 1);
        saveCartItems(cartItems);
        renderCartPageItems(); // Re-render the cart page display
        if (typeof showToast === 'function') { // Use global toast if available
            showToast(`Đã xóa "${removedItemName}" khỏi giỏ hàng.`, 'info');
        }
    } else {
        if (typeof showToast === 'function') {
            showToast('Không tìm thấy khóa học để xóa.', 'error');
        }
    }
    // Ensure header cart count is also updated
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

// Basic styling for cart items (can be moved to shopping-cart.css)
// const style = document.createElement('style');
// style.textContent = `
//     .cart-item-thumbnail {
//         width: 80px; 
//         height: 60px; 
//         object-fit: cover;
//     }
//     #cart-page-table-body h6 {
//         font-size: 0.95rem;
//     }
// `;
// document.head.appendChild(style); 
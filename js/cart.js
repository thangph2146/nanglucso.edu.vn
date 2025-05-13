// document.addEventListener('DOMContentLoaded', () => { // Dòng này có thể bị trùng nếu file này được gọi sau DOMContentLoaded ở file khác
//     initializeCart();
// });

// const COURSE_DETAILS = { // Không cần thiết nữa nếu data-attributes là bắt buộc
//     id: "HC001",
//     name: "HTML & CSS Nền tảng",
//     price: 1200000 
// };

// Sample courses to add if the cart is empty on the very first load
const SAMPLE_COURSES_FOR_DEMO = [
    { id: "JSADV01", name: "JavaScript Nâng cao", price: 1500000, quantity: 1 },
    { id: "REACT01", name: "ReactJS & Hệ sinh thái", price: 2000000, quantity: 1 },
    { id: "NODE01", name: "Node.js & Express", price: 1800000, quantity: 1 }
];

let cartModalInstance = null; // To store Bootstrap modal instance

function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        return amount; // Trả về giá trị gốc nếu không phải là số
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function initializeCart() {
    if (localStorage.getItem('cartItems') === null) {
        localStorage.setItem('cartItems', JSON.stringify(SAMPLE_COURSES_FOR_DEMO));
    }
    try {
        let items = JSON.parse(localStorage.getItem('cartItems'));
        if (!Array.isArray(items)) {
            localStorage.setItem('cartItems', JSON.stringify([]));
        }
    } catch (e) {
        localStorage.setItem('cartItems', JSON.stringify([])); 
    }

    updateCartCount();
    attachAddToCartEvent();
    attachCartIconEvent();

    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
        cartModalInstance = new bootstrap.Modal(cartModalElement);

        // Xử lý focus khi modal được đóng hoàn toàn
        cartModalElement.addEventListener('hidden.bs.modal', function () {
            // Chuyển focus về một phần tử an toàn, ví dụ document.body
            // Hoặc phần tử đã kích hoạt modal nếu bạn lưu trữ tham chiếu đến nó
            document.body.focus(); 
        });
    }
}

function attachAddToCartEvent() {
    const addToCartButton = document.getElementById('addToCartBtn');
    if (addToCartButton) {
        const courseId = addToCartButton.dataset.courseId;
        const courseName = addToCartButton.dataset.courseName;
        const coursePriceStr = addToCartButton.dataset.coursePrice;

        if (!courseId || !courseName || !coursePriceStr) {
            console.error('Lỗi: Nút "Thêm vào giỏ" thiếu thông tin data-course-id, data-course-name, hoặc data-course-price.');
            // Không cho phép thêm vào giỏ nếu thiếu thông tin
            // Có thể vô hiệu hóa nút ở đây nếu muốn: addToCartButton.disabled = true;
            return; 
        }
        
        const coursePrice = parseInt(coursePriceStr, 10);
        if (isNaN(coursePrice)) {
            console.error('Lỗi: data-course-price không phải là một số hợp lệ.', coursePriceStr);
            return;
        }

        addToCartButton.addEventListener('click', () => {
            addToCart(courseName, courseId, coursePrice);
        });
    }
}

function addToCart(courseName, courseId, coursePrice) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === courseId);

    if (existingItem) {
        showToast(`"${courseName}" đã có trong giỏ hàng.`, 'warning');
    } else {
        cartItems.push({ id: courseId, name: courseName, price: coursePrice, quantity: 1 });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        showToast(`Đã thêm "${courseName}" vào giỏ hàng!`, 'success');

        // Hiệu ứng pop cho badge
        const badge = document.querySelector('.cart-count-badge');
        if (badge) {
            badge.classList.add('cart-badge-animate-pop');
            setTimeout(() => {
                badge.classList.remove('cart-badge-animate-pop');
            }, 300); // Thời gian animation là 0.3s
        }
    }
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountBadge = document.querySelector('.cart-count-badge');
    const checkoutButton = document.getElementById('checkoutButton');
    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');

    if (cartCountBadge) {
        cartCountBadge.textContent = cartItems.length;
        if (cartItems.length === 0) {
            cartCountBadge.classList.add('d-none'); 
        } else {
            cartCountBadge.classList.remove('d-none'); 
        }
    }
    if (checkoutButton) {
        checkoutButton.disabled = cartItems.length === 0;
    }
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.disabled = cartItems.length === 0;
    }
}

function attachCartIconEvent() {
    const cartIconWrapper = document.getElementById('cart-icon-wrapper');
    if (cartIconWrapper) {
        cartIconWrapper.addEventListener('click', (event) => {
            event.preventDefault(); 
            displayCartModal();
        });
    }
}

function displayCartModal() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartModalBody = document.getElementById('cartModalBody');
    const cartModalTotal = document.getElementById('cartModalTotal');

    if (!cartModalBody) {
        console.error('Không tìm thấy body của modal giỏ hàng (cartModalBody).');
        return;
    }
    cartModalBody.innerHTML = '';

    let totalAmount = 0;

    if (cartItems.length === 0) {
        cartModalBody.innerHTML = '<p class="text-center text-muted">Giỏ hàng của bạn đang trống.</p>';
        if(cartModalTotal) cartModalTotal.textContent = formatCurrency(0);
    } else {
        const ul = document.createElement('ul');
        ul.className = 'list-group list-group-flush';
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">Mã: ${item.id} - ${formatCurrency(item.price)}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-course-id="${item.id}" title="Xóa khỏi giỏ">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            ul.appendChild(li);
            totalAmount += item.price * (item.quantity || 1);
        });
        cartModalBody.appendChild(ul);
        if(cartModalTotal) cartModalTotal.textContent = formatCurrency(totalAmount);
    }

    attachRemoveButtonsEvents();
    if (cartModalInstance) {
        cartModalInstance.show();
    }
    updateCartCount();
}

function attachRemoveButtonsEvents() {
    const removeButtons = document.querySelectorAll('.remove-from-cart-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.dataset.courseId;
            removeFromCart(courseId);
        });
    });
}

function removeFromCart(courseId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === courseId);

    if (itemIndex > -1) {
        const removedItemName = cartItems[itemIndex].name;
        cartItems.splice(itemIndex, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        showToast(`Đã xóa "${removedItemName}" khỏi giỏ hàng.`, 'info');

        // Nếu modal đang mở, render lại nội dung modal
        if (cartModalInstance && document.getElementById('cartModal').classList.contains('show')) {
            displayCartModal();
        }
    }
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '15px 20px';
        toast.style.borderRadius = '5px';
        toast.style.color = 'white';
        toast.style.zIndex = '1056'; 
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s, transform 0.5s';
        toast.style.transform = 'translateY(20px)';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    if (type === 'success') {
        toast.style.backgroundColor = 'var(--bs-success, green)';
    } else if (type === 'error') {
        toast.style.backgroundColor = 'var(--bs-danger, red)';
    } else if (type === 'info') {
        toast.style.backgroundColor = 'var(--bs-info, #0dcaf0)';
    }

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3000);
}

// Gọi initializeCart một cách an toàn
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCart);
} else {
    initializeCart();
} 
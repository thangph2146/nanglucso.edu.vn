document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
});

const COURSE_DETAILS = {
    id: 'HTMLCSS01',
    name: 'HTML & CSS Nền tảng'
};

// Sample courses to add if the cart is empty on the very first load
const SAMPLE_COURSES_FOR_DEMO = [
    { id: 'DEMOJS001', name: 'JavaScript Cơ Bản (Demo)', quantity: 1 },
    { id: 'DEMOREACT002', name: 'ReactJS Cho Người Mới (Demo)', quantity: 1 }
];

let cartModalInstance = null; // To store Bootstrap modal instance

function initializeCart() {
    // Check if 'cartItems' key doesn't exist in localStorage at all
    if (localStorage.getItem('cartItems') === null) {
        localStorage.setItem('cartItems', JSON.stringify(SAMPLE_COURSES_FOR_DEMO));
        // No toast here, as it might be confusing on first load. 
        // User will see the badge count updated.
    }
    // Ensure cartItems is an array, even if it was not null but malformed.
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

    // Initialize Bootstrap Modal instance
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
        cartModalInstance = new bootstrap.Modal(cartModalElement);
    }
}

function attachAddToCartEvent() {
    const addToCartButton = document.getElementById('addToCartBtn');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            addToCart(COURSE_DETAILS.name, COURSE_DETAILS.id);
        });
    }
}

function addToCart(courseName, courseId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (!cartItems.some(item => item.id === courseId)) {
        cartItems.push({ id: courseId, name: courseName, quantity: 1 });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        showToast(`Đã thêm "${courseName}" vào giỏ hàng!`);
        
        const cartCountBadge = document.querySelector('.cart-count-badge');
        if (cartCountBadge) {
            // Temporarily make it visible for animation if it was hidden
            const wasHidden = cartCountBadge.classList.contains('d-none');
            if (wasHidden) cartCountBadge.classList.remove('d-none');

            cartCountBadge.classList.add('cart-badge-animate-pop');
            setTimeout(() => {
                cartCountBadge.classList.remove('cart-badge-animate-pop');
                // If it was hidden and cart is still empty (e.g. adding the only item then removing it quickly - edge case)
                // updateCartCount will handle the d-none re-application correctly.
            }, 500); 
        }
    } else {
        showToast(`"${courseName}" đã có trong giỏ hàng.`, 'info');
    }
    updateCartCount();
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountBadge = document.querySelector('.cart-count-badge');
    const checkoutButton = document.getElementById('checkoutButton');

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
    const cartModalBodyList = document.getElementById('cartItemsList');
    const cartEmptyMessage = document.getElementById('cartEmptyMessage');

    if (!cartModalBodyList || !cartEmptyMessage) return;

    cartModalBodyList.innerHTML = ''; // Clear previous items

    if (cartItems.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartModalBodyList.style.display = 'none';
    } else {
        cartEmptyMessage.style.display = 'none';
        cartModalBodyList.style.display = 'block';
        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <div>
                    <h6 class="my-0">${item.name}</h6>
                    <small class="text-muted">Mã: ${item.id}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-course-id="${item.id}">
                    <i class="bi bi-trash-fill"></i> Xóa
                </button>
            `;
            cartModalBodyList.appendChild(listItem);
        });
        attachRemoveButtonsEvents(); // Attach events to newly created remove buttons
    }

    if (cartModalInstance) {
        cartModalInstance.show();
    }
    updateCartCount(); // Ensure checkout button state is correct
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
        const removedItem = cartItems.splice(itemIndex, 1)[0];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        showToast(`Đã xóa "${removedItem.name}" khỏi giỏ hàng.`, 'info');
    } else {
        showToast('Không tìm thấy khóa học để xóa.', 'error');
    }
    updateCartCount();
    // Re-render modal content if it's currently visible
    if (cartModalInstance && document.getElementById('cartModal').classList.contains('show')) {
        displayCartModal(); 
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
document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            name: "Organic Apple",
            price: 1.99,
            image: "images/apple.png"
        },
        {
            name: "Organic Carrot",
            price: 2.49,
            image: "images/carrot.jpg"
        },
        {
            name: "Organic Banana",
            price: 1.29,
            image: "images/banana.jpg"
        }
    ];

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountRight = document.getElementById('cart-count-right');
    const totalPriceElement = document.querySelector('.subtotal');
    const productsContainer = document.getElementById('products-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartContainer = document.querySelector('.cart-container');
    const specialInstructions = document.querySelector('.special-instructions');
    const cartSummary = document.querySelector('.cart-summary');
    const cartActions = document.querySelector('.cart-actions');

    function updateCartCount() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountRight) cartCountRight.textContent = totalCount;
    }

    function updateCartView() {
        if (cartItemsContainer && totalPriceElement) {
            cartItemsContainer.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                emptyCartMessage.classList.remove('hidden');
                cartContainer.classList.add('hidden');
                specialInstructions.classList.add('hidden');
                cartSummary.classList.add('hidden');
                cartActions.classList.add('hidden');
            } else {
                emptyCartMessage.classList.add('hidden');
                cartContainer.classList.remove('hidden');
                specialInstructions.classList.remove('hidden');
                cartSummary.classList.remove('hidden');
                cartActions.classList.remove('hidden');

                cart.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <div class="cart-item-product">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-item-info">
                                <h3>${item.name}</h3>
                            </div>
                        </div>
                        <div class="cart-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-quantity">
                            <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                            <input type="text" value="${item.quantity}" readonly>
                            <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                        </div>
                        <div class="cart-total">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-remove">
                            <button class="remove-btn" data-index="${index}">×</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                    total += item.price * item.quantity;
                });

                totalPriceElement.textContent = `Subtotal $${total.toFixed(2)}`;
            }
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    if (productsContainer) {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                </div>
                <div class="overlay">
                    <div class="quantity-container">
                        <span class="quantity-label">Quantity</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <input type="text" value="1" class="product-quantity">
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                    </div>
                    <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });

        productsContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-to-cart')) {
                const productCard = event.target.closest('.product-card');
                const name = event.target.getAttribute('data-name');
                const price = parseFloat(event.target.getAttribute('data-price'));
                const image = event.target.getAttribute('data-image');
                const quantity = parseInt(productCard.querySelector('.product-quantity').value);
                const existingItemIndex = cart.findIndex(item => item.name === name);

                if (existingItemIndex !== -1) {
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    cart.push({ name, price, image, quantity });
                }

                saveCart();
                updateCartCount();
                updateCartView();
            }

            if (event.target.classList.contains('quantity-btn')) {
                const input = event.target.parentNode.querySelector('.product-quantity');
                let currentQuantity = parseInt(input.value);
                if (event.target.getAttribute('data-action') === 'increase') {
                    input.value = currentQuantity + 1;
                } else if (event.target.getAttribute('data-action') === 'decrease' && currentQuantity > 1) {
                    input.value = currentQuantity - 1;
                }
            }
        });
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('quantity-btn')) {
                const index = event.target.getAttribute('data-index');
                const action = event.target.getAttribute('data-action');
                const item = cart[index];

                if (action === 'decrease' && item.quantity > 1) {
                    item.quantity -= 1;
                } else if (action === 'increase') {
                    item.quantity += 1;
                }
                saveCart();
                updateCartView();
            }

            if (event.target.classList.contains('remove-btn')) {
                const index = event.target.getAttribute('data-index');
                cart.splice(index, 1);
                saveCart();
                updateCartCount();
                updateCartView();
            }
        });
    }

    document.querySelector('.update-cart')?.addEventListener('click', function() {
        updateCartView();
    });

    document.querySelector('.checkout')?.addEventListener('click', function() {
        alert('Proceed to checkout');
    });

    updateCartCount();
    updateCartView();

    // Search Modal
    const searchIcon = document.getElementById('search-icon');
    const searchModal = document.getElementById('search-modal');
    const closeModal = document.querySelector('.close');

    searchIcon.addEventListener('click', function() {
        searchModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        searchModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == searchModal) {
            searchModal.style.display = 'none';
        }
    });
});

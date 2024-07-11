document.addEventListener('DOMContentLoaded', () => {
    //PRODUCT SECTION (ADD PRODUCTS)
    const products = [
        {
            name: "Organic Apple",
            price: 1.99,
            image: "images/apple.png",
            type: "fruit",
            availability: "in-stock"
        },
        {
            name: "Organic Carrot",
            price: 2.49,
            image: "images/carrot.jpg",
            type: "vegetable",
            availability: "in-stock"
        },
        {
            name: "Organic Banana",
            price: 1.29,
            image: "images/banana.jpg",
            type: "fruit",
            availability: "out-of-stock"
        },
        {
            name: "Naked strawberry banana",
            price: 8,
            image: "images/Naked.jfif",
            type: "Beverage",
            availability: "out-of-stock"
        },
        {
            name: "Naked glorious green",
            price: 8,
            image: "images/Naked2.webp",
            type: "Beverage",
            availability: "in-stock"
        },
        {
            name: "Grape",
            price: 1.32,
            image: "images/grape.jpeg",
            type: "fruit",
            availability: "in-stock"
        },
    ];

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartCountRight = document.getElementById('cart-count-right');
    const totalPriceElement = document.querySelector('.subtotal');
    const productsContainer = document.querySelector('.products');
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

            if (cart.length === 0) {
                cartContainer.classList.add('hidden');
                specialInstructions.classList.add('hidden');
                cartSummary.classList.add('hidden');
                cartActions.classList.add('hidden');
                emptyCartMessage.classList.remove('hidden');
            } else {
                cartContainer.classList.remove('hidden');
                specialInstructions.classList.remove('hidden');
                cartSummary.classList.remove('hidden');
                cartActions.classList.remove('hidden');
                emptyCartMessage.classList.add('hidden');
            }
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderProducts(filteredProducts) {
        productsContainer.innerHTML = '';
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                ${product.availability === 'out-of-stock' ? '<div class="out-of-stock-label">Out of Stock</div>' : ''}
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
    }

    if (productsContainer) {
        renderProducts(products);

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
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.createElement('div');
    searchResults.id = 'search-results';
    searchModal.appendChild(searchResults);

    // Search Modal
    searchIcon.addEventListener('click', function() {
        searchModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        searchModal.style.display = 'none';
        searchInput.value = ''; // Clear search input when modal is closed
        searchResults.innerHTML = ''; // Clear search results when modal is closed
    });

    window.addEventListener('click', function(event) {
        if (event.target == searchModal) {
            searchModal.style.display = 'none';
            searchInput.value = ''; // Clear search input when modal is closed
            searchResults.innerHTML = ''; // Clear search results when modal is closed
        }
    });

    // Search functionality
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        if (query.trim() === '') {
            searchResults.innerHTML = ''; // Clear search results if input is empty
            return;
        }
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.type.toLowerCase().includes(query)
        );
        displaySearchResults(filteredProducts);
    });

    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        if (results.length > 0) {
            results.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="result-info">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="quantity-and-cart">
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
                searchResults.appendChild(resultItem);
            });

            searchResults.addEventListener('click', function(event) {
                if (event.target.classList.contains('add-to-cart')) {
                    const productCard = event.target.closest('.search-result-item');
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
        } else {
            searchResults.innerHTML = '<p>No results found.</p>';
        }
    }

    // Filter functionality
    const availabilityInputs = document.querySelectorAll('input[name="availability"]');
    const productTypeInputs = document.querySelectorAll('input[name="product-type"]');
    
    function filterProducts() {
        const selectedAvailability = Array.from(availabilityInputs).find(input => input.checked)?.value;
        const selectedTypes = Array.from(productTypeInputs).filter(input => input.checked).map(input => input.value);

        const filteredProducts = products.filter(product => {
            const matchesAvailability = selectedAvailability ? product.availability === selectedAvailability : true;
            const matchesType = selectedTypes.length ? selectedTypes.includes(product.type) : true;
            return matchesAvailability && matchesType;
        });

        renderProducts(filteredProducts);
    }

    availabilityInputs.forEach(input => {
        input.addEventListener('change', filterProducts);

        // Custom deselect for radio buttons
        input.addEventListener('click', function() {
            if (this.checked && this.dataset.checked === "true") {
                this.checked = false;
                this.dataset.checked = "";
                const event = new Event('change');
                this.dispatchEvent(event);
            } else {
                availabilityInputs.forEach(radio => radio.dataset.checked = "");
                this.dataset.checked = "true";
            }
        });
    });

    productTypeInputs.forEach(input => {
        input.addEventListener('change', filterProducts);
    });

    // Toggle filter content visibility
    document.querySelectorAll('.filter-title').forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            content.classList.toggle('hidden');
            const symbol = title.querySelector('.toggle-symbol');
            if (content.classList.contains('hidden')) {
                symbol.textContent = '+';
            } else {
                symbol.textContent = '-';
            }
        });
    });
});


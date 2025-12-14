// Корзина товаров
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Элементы DOM
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const continueShopping = document.getElementById('continueShopping');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

// Инициализация корзины
function initCart() {
    updateCartCount();
    updateCartModal();
    setupEventListeners();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Открытие/закрытие корзины
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    continueShopping.addEventListener('click', () => {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Закрытие корзины при клике вне ее области
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Добавление товаров в корзину
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.bike-card');
            const id = parseInt(card.dataset.id);
            const name = card.dataset.name;
            const price = parseInt(card.dataset.price);

            addToCart(id, name, price);

            // Анимация кнопки
            this.classList.add('added');
            this.textContent = 'Добавлено!';

            setTimeout(() => {
                this.classList.remove('added');
                this.textContent = 'Добавить в корзину';
            }, 1000);
        });
    });
}

// Добавление товара в корзину
function addToCart(id, name, price) {
    // Проверяем, есть ли товар уже в корзине
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
}

// Удаление товара из корзины
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Обновление количества товара
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
    }

    updateCart();
}

// Обновление корзины
function updateCart() {
    updateCartCount();
    updateCartModal();
    saveCartToStorage();
}

// Обновление счетчика корзины
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;

    // Обновляем отображение суммы в иконке корзины
    const cartTotalElement = document.querySelector('.cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = `${totalPrice.toLocaleString()} ₽`;
    }
}

// Обновление модального окна корзины
function updateCartModal() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Ваша корзина пуста</p>
            </div>
        `;
        subtotalElement.textContent = '0 ₽';
        totalElement.textContent = '0 ₽';
        return;
    }

    let itemsHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Удалить</button>
                    </div>
                </div>
            </div>
        `;
    });

    const shipping = subtotal > 5000 ? 0 : 500;
    const total = subtotal + shipping;

    cartItems.innerHTML = itemsHTML;
    subtotalElement.textContent = `${subtotal.toLocaleString()} ₽`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Бесплатно' : `${shipping.toLocaleString()} ₽`;
    totalElement.textContent = `${total.toLocaleString()} ₽`;
}

// Сохранение корзины в localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        alert('Ваша корзина пуста!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    alert(`Заказ оформлен!\n\nТоваров: ${totalItems} шт.\nСумма заказа: ${total.toLocaleString()} ₽\n\nСпасибо за покупку!`);

    // Очищаем корзину после оформления заказа
    cart = [];
    updateCart();
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Добавляем обработчик для кнопки оформления заказа
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Инициализируем корзину
    initCart();
});

// Делаем функции доступными глобально для вызова из HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
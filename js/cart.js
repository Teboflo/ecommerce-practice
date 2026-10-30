(() => {
    const STORAGE_KEY = 'carritoCompras';
    const cartContainer = document.querySelector('.carrito-de-productos');
    const countLabel = document.querySelector('#cart-count');
    const summaryItems = document.querySelector('#summary-items');
    const subtotalLabel = document.querySelector('#cart-subtotal');
    const checkoutButton = document.querySelector('#continue-checkout');
    if (!cartContainer) return;

    function readCart() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(stored) ? stored.filter(item => item && Number.isFinite(Number(item.id)) && typeof item.nombre === 'string' && Number.isFinite(Number(item.precio))) : [];
        } catch { return []; }
    }
    let cart = readCart();
    const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    }
    const saveCart = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    function groupedItems() {
        const grouped = new Map();
        cart.forEach(item => {
            const id = Number(item.id);
            if (!grouped.has(id)) grouped.set(id, { ...item, id, cantidad: 0 });
            grouped.get(id).cantidad += 1;
        });
        return [...grouped.values()];
    }
    function renderCart() {
        const items = groupedItems();
        const count = cart.length;
        const subtotal = cart.reduce((sum, item) => sum + Number(item.precio), 0);
        countLabel.textContent = `${count} ${count === 1 ? 'producto' : 'productos'}`;
        summaryItems.textContent = String(count);
        subtotalLabel.textContent = money(subtotal);
        checkoutButton.disabled = count === 0;
        if (!items.length) {
            cartContainer.innerHTML = `<div class="empty-cart"><div class="empty-icon" aria-hidden="true">＋</div><h3>Tu carrito está vacío</h3><p>Explora el catálogo y añade los postres o bebidas que quieras disfrutar.</p><a class="empty-cta" href="../index.html#catalogo">Explorar productos →</a></div>`;
            return;
        }
        cartContainer.innerHTML = items.map(item => {
            const price = Number(item.precio);
            const category = typeof item.categoria === 'string' ? item.categoria : 'Producto';
            const safeName = escapeHTML(item.nombre);
            return `<article class="cart-item" data-id="${item.id}"><div class="item-info"><span class="item-category">${escapeHTML(category)}</span><h3 class="item-name">${safeName}</h3><p class="item-unit-price">${money(price)} por unidad</p></div><div class="item-controls"><strong class="item-total">${money(price * item.cantidad)}</strong><div class="quantity-control" aria-label="Cantidad de ${safeName}"><button type="button" data-action="decrease" data-id="${item.id}" aria-label="Quitar una unidad de ${safeName}">−</button><span class="quantity-value">${item.cantidad}</span><button type="button" data-action="increase" data-id="${item.id}" aria-label="Añadir una unidad de ${safeName}">+</button></div><button type="button" class="remove-link" data-action="remove" data-id="${item.id}">Quitar producto</button></div></article>`;
        }).join('') + `<div class="cart-list-footer"><button type="button" class="remove-link" data-action="clear">Vaciar carrito</button></div>`;
    }
    cartContainer.addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const action = button.dataset.action;
        if (action === 'clear') cart = [];
        else {
            const id = Number(button.dataset.id);
            if (action === 'remove') cart = cart.filter(item => Number(item.id) !== id);
            else if (action === 'decrease') { const index = cart.findIndex(item => Number(item.id) === id); if (index !== -1) cart.splice(index, 1); }
            else if (action === 'increase') { const item = cart.find(item => Number(item.id) === id); if (item) cart.push({ ...item }); }
        }
        saveCart(); renderCart();
    });
    checkoutButton.addEventListener('click', () => {
        if (readCart().length) location.href = "checkout.html";
    });
    renderCart();
})();
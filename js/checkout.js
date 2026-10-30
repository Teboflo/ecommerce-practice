(() => {
    const WHATSAPP_NUMBER = "593998359537"; // Configura el número comercial real: código de país + número, solo dígitos.
    const STORAGE_KEY = "carritoCompras";
    const form = document.getElementById("checkout-form");
    const items = document.getElementById("checkout-items");
    const total = document.getElementById("checkout-subtotal");
    const err = document.getElementById("checkout-error");
    const address = document.getElementById("address-wrap");
    const addr = form.elements.address;

    const read = () => {
        try {
            const cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            return [];
        }
    };

    const price = (item) => {
        const value = Number(
            String(item.precio ?? item.price ?? item.prize ?? 0)
                .replace(/[^\d.,-]/g, "")
                .replace(",", "."),
        );
        return Number.isFinite(value) ? value : 0;
    };

    const qty = (item) =>
        Math.max(1, Math.floor(Number(item.cantidad ?? item.quantity ?? 1) || 1));
    const name = (item) =>
        String(item.nombre ?? item.name ?? item.producto ?? "Producto");
    const money = (amount) =>
        new Intl.NumberFormat("es-EC", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    function summary() {
        const cart = read();
        let sum = 0;
        items.innerHTML = "";

        cart.forEach((item) => {
            const amount = price(item) * qty(item);
            sum += amount;

            const row = document.createElement("div");
            row.className = "row";
            const itemName = document.createElement("span");
            const itemPrice = document.createElement("strong");
            itemName.textContent = `${name(item)} × ${qty(item)}`;
            itemPrice.textContent = money(amount);
            row.append(itemName, itemPrice);
            items.append(row);
        });

        total.textContent = money(sum);
        if (!cart.length) {
            err.textContent =
                "Tu carrito está vacío. Regresa a la tienda para agregar productos.";
            form.querySelector('button[type="submit"]').disabled = true;
        }

        return { cart, sum };
    }

    function mode() {
        const delivery = form.elements.fulfillment.value === "delivery";
        address.hidden = !delivery;
        addr.required = delivery;
    }

    form.elements.fulfillment.forEach((option) =>
        option.addEventListener("change", mode),
    );
    mode();
    summary();

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        err.textContent = "";

        const { cart, sum } = summary();
        if (!cart.length) return;
        if (!form.reportValidity()) return;

        if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
            err.textContent =
                "Configura el número real en WHATSAPP_NUMBER dentro de js/checkout.js (código de país y solo dígitos).";
            return;
        }

        const data = new FormData(form);
        const delivery = data.get("fulfillment") === "delivery";
        const lines = cart.map(
            (item) =>
                `• ${name(item)} x${qty(item)} — ${money(price(item) * qty(item))}`,
        );
        const message = [
            "¡Hola! Quiero realizar este pedido:",
            "",
            ...lines,
            "",
            `Subtotal referencial: ${money(sum)}`,
            `Nombre: ${data.get("customerName")}`,
            `Teléfono: ${data.get("phone")}`,
            `Modalidad: ${delivery ? "Entrega a domicilio" : "Retiro en el local"}`,
            ...(delivery ? [`Dirección: ${data.get("address")}`] : []),
            ...(data.get("notes") ? [`Notas: ${data.get("notes")}`] : []),
            "",
            "Por favor confirmen disponibilidad, costo de entrega (si aplica), total final y opciones de pago.",
        ].join("\n");

        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            "_blank",
            "noopener",
        );
    });
})();
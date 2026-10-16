
let carrito = JSON.parse(localStorage.getItem('carritoCompras')) || [];
const productos = [
    { id: 1, nombre: "Tartaleta Capricho", precio: 3.50, categoria: "Postre" },
    { id: 2, nombre: "Tartaleta Mística", precio: 3.50, categoria: "Postre" },
    { id: 3, nombre: "Los Anillos de Maracuyá", precio: 2.50, categoria: "Postre" },
    { id: 4, nombre: "Alfajor Tradicional", precio: 2.00, categoria: "Postre" },
    { id: 5, nombre: "El Bocado Carmesí", precio: 2.00, categoria: "Postre" },
    { id: 6, nombre: "Moca de Frutos Rojos", precio: 3.00, categoria: "Bebida" },
    { id: 7, nombre: "Latte Frío", precio: 2.50, categoria: "Bebida" },
    { id: 8, nombre: "Latte Caliente", precio: 3.00, categoria: "Bebida" },
    { id: 9, nombre: "Té Chai Caliente", precio: 3.50, categoria: "Bebida" },
    { id: 10, nombre: "Capuccino", precio: 2.50, categoria: "Bebida" },
];

const contenedorHTML = document.querySelector(".contenedor-productos");

function mostrarProductos(listaDeProductos) {
    const htmlProductos = listaDeProductos.map(producto => {
        return `<div class="producto">
            <h3 class="name-producto">${producto.nombre}</h3>
            <p class="prize">$${producto.precio.toFixed(2)}</p>
            <button class="add-shopcar btn-comprar" data-id="${producto.id}"><svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
                    <path
                        d="M2.21 9.39c-.19.25-.25.57-.17.87l2.8 10.26c.24.87 1.03 1.47 1.93 1.47h10.47c.9 0 1.69-.61 1.93-1.47l2.8-10.26c.08-.3.02-.62-.17-.87a.99.99 0 0 0-.79-.39h-1.42l-3.71-6.5-1.74.99 3.15 5.5H6.72l3.15-5.5-1.74-.99L4.42 9H3a1 1 0 0 0-.79.39M17.24 20H6.76l-2.45-9h15.38z">
                    </path>
                    <path d="M9 13h2v5H9zm4 0h2v5h-2z"></path>
                </svg> Añadir</button>
        </div>`;
    });

    const htmlFinal = htmlProductos.join('');
    contenedorHTML.innerHTML = htmlFinal;
};


mostrarProductos(productos);

const selectFiltro = document.querySelector('#filtro-categoria');

selectFiltro.addEventListener("change", (evento) => {
    const categoriaSeleccionada = evento.target.value;

    if (categoriaSeleccionada === 'todos') {
        mostrarProductos(productos);
        return;
    }

    const productosFiltrados = productos.filter(producto => {
        return producto.categoria === categoriaSeleccionada;
    });

    mostrarProductos(productosFiltrados);
});


contenedorHTML.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('add-shopcar')) {
        const idProducto = Number(evento.target.getAttribute('data-id'));

        const productoEncontrado = productos.find(prod => prod.id === idProducto);

        if (productoEncontrado) {
            carrito.push(productoEncontrado);

            localStorage.setItem('carritoCompras', JSON.stringify(carrito));
        }
    };
});
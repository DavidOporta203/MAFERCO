// Ruta al JSON de productos
const rutaJSON = '../json/products.json';

// Elementos del DOM
const productContainer = document.getElementById('productContainer');
const categoryFilter = document.getElementById('categoryFilter');

// Cargar productos desde el JSON
fetch(rutaJSON)
    .then(response => response.json())
    .then(data => {
        // Recuperar categoría seleccionada del localStorage
        const categoriaGuardada = localStorage.getItem('categoriaSeleccionada') || "todos";
        categoryFilter.value = categoriaGuardada;

        // Filtrar y mostrar productos según la categoría seleccionada
        const productosFiltrados = categoriaGuardada === "todos"
            ? data
            : data.filter(producto => producto.categoria === categoriaGuardada);
        mostrarProductos(productosFiltrados);

        // Evento para filtrar productos
        categoryFilter.addEventListener('change', () => {
            const categoriaSeleccionada = categoryFilter.value;
            localStorage.setItem('categoriaSeleccionada', categoriaSeleccionada); // Guardar nueva categoría
            const productosFiltrados = categoriaSeleccionada === "todos"
                ? data
                : data.filter(producto => producto.categoria === categoriaSeleccionada);
            mostrarProductos(productosFiltrados);
        });
    })
    .catch(error => console.error('Error cargando productos:', error));

// Función para mostrar los productos
function mostrarProductos(productos) {
    productContainer.innerHTML = '';
    productos.forEach(product => {
        const card = `
            <div class="product-item">
                <img src="${product.imagen}" alt="${product.nombre}">
                <div class="product-info">
                    <p class="product-title">${product.nombre}</p>
                    <p class="product-price">₡${product.precio.toFixed(2)}</p>
                    <button class="product-button agregar">Agregar</button>
                    <button class="product-button ver" data-product='${JSON.stringify(product)}'>Ver más</button>
                </div>
            </div>`;
        productContainer.insertAdjacentHTML('beforeend', card);
    });

    // Eventos para los botones "Ver más"
    const botonesVerMas = document.querySelectorAll('.product-button.ver');
    botonesVerMas.forEach(boton => {
        boton.addEventListener('click', function () {
            const product = JSON.parse(this.getAttribute('data-product'));
            localStorage.setItem('productoSeleccionado', JSON.stringify(product));
            localStorage.setItem('categoriaSeleccionada', categoryFilter.value); // Guardar categoría seleccionada
            window.location.href = 'detalle.html';
        });
    });
}

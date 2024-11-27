
// Ruta al JSON de productos
const rutaJSON = '/json/products.json';

//It will store the elements inside the array, then it will be saved through localStorage to temporarily have it on Memory
let carrito = [];

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
    productContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos

    productos.forEach(product => {
        // Crear la tarjeta de producto
        const card = `
            <div class="product-item">
                <img src="${product.imagen}" alt="${product.nombre}">
                <div class="product-info">
                    <p class="product-title">${product.nombre}</p>
                    <p class="product-price">₡${product.precio.toFixed(2)}</p>
                    <button class="product-button agregar" 
                            data-id="${product.id}" 
                            data-name="${product.nombre}" 
                            data-price="${product.precio}" 
                            data-image="${product.imagen}">Agregar</button>
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
            window.location.href = 'detalle.html'; // Redirigir a la página de detalles
        });
    });
}

function actualizarCarrito() {
    const tbody = $('#cart-table-body');
    tbody.empty(); // Limpiar la tabla antes de renderizar
    let subtotal = 0;

    carrito.forEach(item => {

        const price = parseFloat(item.price); 
        const quantity = parseInt(item.quantity);

        const totalProducto = price * quantity;
        subtotal += totalProducto;

        // Crear fila de la tabla para el carrito
        const row = `
            <tr data-id="${item.id}">
                <td><img src="${item.image}" alt="${item.name}" class="img-carrito"></td>
                <td>${item.name}</td>
                <td>
                    <input class="form-control cantidad" type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="btn-table eliminar" data-id="${item.id}">Eliminar Artículo</button>
                </td>
                <td>₡${price.toFixed(2)}</td>
                <td>₡${totalProducto.toFixed(2)}</td>
            </tr>
        `;
        tbody.append(row);
    });
    
    const iva = subtotal * 0.15;
    const descuento = subtotal > 50 ? 5 : 0; 
    const total = subtotal + iva - descuento;

    // Mostrar totales en el carrito
    $('#subtotal').text(`₡${subtotal.toFixed(2)}`);
    $('#iva').text(`₡${iva.toFixed(2)}`);
    $('#descuento').text(`₡${descuento.toFixed(2)}`);
    $('#total').text(`₡${total.toFixed(2)}`);

    // Guardar el carrito actualizado en localStorage para ver si funka en memoria 
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

 // Agregar productos al carrito
 $(document).on('click', '.agregar', function() {
    // Mostrar el mensaje de éxito con SweetAlert

    const id = $(this).data('id');
    const name = $(this).data('name');
    const price = $(this).data('price');
    const image = $(this).data('image');

    console.log("Producto seleccionado:", id, name, price, image);

   /* if (price === undefined || name === undefined || image === undefined) {
        console.error("Faltan datos del producto. No se puede agregar al carrito.", { id, name, price, image });
        return; // Si los datos son inválidos, no agregar al carrito
    }

    if (isNaN(price) || price === undefined) {
        console.error("Precio inválido para el producto", { id, name, price, image });
        return; // Si el precio no es válido, no agregar al carrito
    }

    //opcional para que ver si debugguea 
        */

    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        // Si ya existe, solo aumentar la cantidad
        productoExistente.quantity += 1;
    }
    else{
        carrito.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    actualizarCarrito();

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        text: 'Producto agregado al carrito de compras.',
        showConfirmButton: true,
    });
});


// Actualizar cantidad de producto en el carrito
$(document).on('change', '.cantidad', function() {
    const id = $(this).data('id');
    const nuevaCantidad = parseInt($(this).val());
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.quantity = nuevaCantidad;
    }
    actualizarCarrito();
});

 // Eliminar producto del carrito
 $(document).on('click', '.eliminar', function() {
    const id = $(this).data('id');
    carrito = carrito.filter(item => item.id !== id);

    // Actualizar la tabla y los totales
    actualizarCarrito();
});


$(document).ready(function() {
   
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado); // Cargar el carrito guardado
        actualizarCarrito(); // Actualizar la vista del carrito
    }
});


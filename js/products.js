
let cardName = ""; // Variable para almacenar el nombre de la tarjeta
let customerName = ""; // Variable para almacenar el nombre del cliente
//It will store the elements inside the array, then it will be saved through localStorage to temporarily have it on Memory
let carrito = [];
// Ruta al JSON de productos
const rutaJSON = '/json/products.json';



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
$(document).on('click', '.agregar', function () {
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
    else {
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
$(document).on('change', '.cantidad', function () {
    const id = $(this).data('id');
    const nuevaCantidad = parseInt($(this).val());
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.quantity = nuevaCantidad;
    }
    actualizarCarrito();
});

// Eliminar producto del carrito
$(document).on('click', '.eliminar', function () {
    const id = $(this).data('id');
    carrito = carrito.filter(item => item.id !== id);

    actualizarCarrito();
});

//Se vuela todo el carrito
$(document).on('click', '#button-borrar', function () {
    carrito = []; // Vaciar el carrito en la variable local
    localStorage.removeItem('carrito'); // Eliminar el carrito de localStorage
    actualizarCarrito(); // Actualizar la vista del carrito
    console.log(carrito);
});


$(document).ready(function () {

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado); // Cargar el carrito guardado
        actualizarCarrito(); // Actualizar la vista del carrito
    }
});

//Simula el formulario de pago, lo hace apacercer y que se mueva dinamicamente
function simularPago() {
    // Seleccionamos el botón con id 'btn-pagar'
    const btnPagar = document.querySelector('#btn-pagar');
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Convertir a formato de fecha

    btnPagar.addEventListener('click', function () {
        if (carrito.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No hay productos en el carrito pah",
            });
            return;
        }

        Swal.fire({
            title: 'Selecciona el método de pago',
            text: '¿Cómo te gustaría proceder con el pago?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Pagar con tarjeta',
            cancelButtonText: 'Retirar en tienda',
        }).then((result) => {
            let formulario = document.getElementById('formulario-pago');
            if (result.isConfirmed) {
                // Si el usuario elige "Pagar con tarjeta", mostramos el formulario de pago
                formulario.classList.add('show');

                //Aún se está trabajando un formulario para pago por retiro en tienda
            }
        });
    });
    //variables para el formulario de pago
    const cardNumber = document.getElementById("card-number");
    const cardHolderName = document.getElementById("card-holder-name");
    const cardNameInput = document.getElementById("card-name-input");
    const displayValidity = document.getElementById("validity");
    const validityInput = document.getElementById("validity-input");
    const cardNumberDisplay = document.querySelectorAll(".card-number-display");
    const cvvInput = document.getElementById("cvv");
    const cvvDisplay = document.getElementById("cvv-display");
    let currentSpanIndex = 0;



    cardNumber.addEventListener("input", () => {
        const inputNumber = cardNumber.value.replace(/\D/g, "");
        cardNumber.value = cardNumber.value.slice(0, 16).replace(/\D/g, "");
        for (let i = 0; i < cardNumberDisplay.length; i++) {
            if (i < inputNumber.length) {
                cardNumberDisplay[i].textContent = inputNumber[i];
            } else {
                cardNumberDisplay[i].textContent = "_";
            }
        }

        if (inputNumber.length <= cardNumberDisplay.length) {
            currentSpanIndex = inputNumber.length;
        } else {
            currentSpanIndex = cardNumberDisplay.length;
        }
    });


    cardNameInput.addEventListener("input", () => {
        if (cardNameInput.value.length < 1) {
            cardHolderName.innerText = "Tu nombre aquí";
        } else if (cardNameInput.value.length > 30) {
            cardNameInput.value = cardNameInput.value.slice(0, 30);
        } else {
            cardHolderName.innerText = cardNameInput.value;
        }
    });

    validityInput.addEventListener("input", () => {
        const inputString = validityInput.value;
        if (inputString.length < 1) {
            displayValidity.innerText = "06/28";
            return false;
        }
        const parts = inputString.split("-");
        const year = parts[0].slice(2);
        const month = parts[1];

        //Final formatted string
        const formattedString = `${month}/${year}`;
        displayValidity.innerText = formattedString;
    });

    //cvv
    cvvInput.addEventListener("input", () => {
        const userInput = cvvInput.value;
        const sanitizedInput = userInput.slice(0, 3);
        const numericInput = sanitizedInput.replace(/\D/g, "");
        cvvInput.value = numericInput;
        cvvDisplay.innerText = numericInput;
    });

    //Flip
    cvvInput.addEventListener("click", () => {
        document.getElementById("card").style.transform = "rotateY(180deg)";
    });
    //Reflip card
    document.addEventListener("click", () => {
        if (document.activeElement.id != "cvv") {
            document.getElementById("card").style.transform = "rotateY(0deg)";
        }
    });
}
//carga el formulario, no tocar....
window.onload = simularPago;


//Generamos el PDF al presionar el boton pagar
function generarPDFCompletarPago(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Asegurar que el mes tenga dos dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Asegurar que el día tenga dos dígitos
    const hours = String(now.getHours()).padStart(2, '0'); // Asegurar que la hora tenga dos dígitos
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Asegurar que los minutos tengan dos dígitos
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Asegurar que los segundos tengan dos dígitos
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Asegurar que los milisegundos tengan tres dígitos

    const invoiceNumber = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255); // Color azul
    doc.setFont("helvetica", "bold"); // Establecer fuente en negrita
    doc.text("Factura de Compra", 105, 20, null, null, 'center'); // Centrado horizontalmente
    doc.setTextColor(0, 0, 0); // Color negro
    doc.setFont("helvetica", "normal"); // Establecer fuente normal
    doc.setFontSize(12);


    // Agregar el número de factura
    doc.text(`Factura Número: ${invoiceNumber}`, 105, 30, null, null, 'center'); // Centrado horizontalmente
// Verificar el nombre del cliente y asignar "Contado" si está vacío
    const customerNameDisplay = customerName.trim() === "" ? "Contado" : customerName;

    doc.text(`Nombre del Cliente: ${customerNameDisplay}`, 14, 40); // Posición vertical después del número de factura

    let y = 45; // posición vertical inicial
    let total = 0;

    const tableWidth = 180;
    const rowHeight = 10;


    doc.setFillColor(0, 123, 255); // Color azul
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo de la cabecera
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text("Producto", 15, y + 7);
    doc.text("Precio", 80, y + 7);
    doc.text("Cantidad", 120, y + 7);
    doc.text("Subtotal", 150, y + 7);
    doc.setTextColor(0, 0, 0); // Restablecer el color del texto a negro
    y += rowHeight;

    carrito.forEach(item =>{
        const subtotal = item.price * item.quantity;
        doc.rect(14, y, tableWidth, rowHeight); // Bordes de la fila
        doc.text(item.name, 15, y + 7);
        doc.text(`$${item.price.toFixed(2)}`, 80, y + 7);
        doc.text(item.quantity.toString(), 120, y + 7);
        doc.text(`$${subtotal.toFixed(2)}`, 150, y + 7);
        y += rowHeight; // Incremento para la siguiente línea
        total += subtotal;

        // Total
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo del total
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text("Total:", 15, y + 7);
    doc.text(`$${total.toFixed(2)}`, 150, y + 7);
    });

    doc.save('factura_compra.pdf');
}

function completarPago(){
    document.getElementById('btn-finalizar').addEventListener('click', function(event) {
        event.preventDefault(); // Evita que se recargue la página al hacer clic en el botón

    
        // Mostrar mensaje de confirmación del pago usando SweetAlert
        Swal.fire({
            title: '¿Estás seguro de realizar el pago?',
            text: "¡Una vez realizado, el carrito se vaciará!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, proceder con el pago',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Simular el pago
                Swal.fire('¡Pago realizado!', 'Gracias por tu compra', 'success');
                generarPDFCompletarPago();
    
                // Vaciar el carrito (el carrito está almacenado en localStorage como 'cart')
                localStorage.removeItem('carrito'); // Eliminar el carrito del localStorage
    
                 carrito = [];
                actualizarCarrito();
                setTimeout(function() {
                    window.location.href = "index.html"; // Redirige a la página de inicio después del pago
                }, 2000); // Redirige después de 2 segundos
            }
        });
    });
}

completarPago();

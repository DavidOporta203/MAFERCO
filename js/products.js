
let cardName = ""; // Variable para almacenar el nombre de la tarjeta
//It will store the elements inside the array, then it will be saved through localStorage to temporarily have it on Memory
let carrito = [];
let precioEnvio = 0;
const tipoEnvioSelect = document.getElementById('tipo-envio');
const customerName = document.getElementById("card-holder-name");
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
            <div class="product-item fade-in">
                <img src="${product.imagen}" alt="${product.nombre}">
                <div class="product-info">
                    <p class="product-title visible">${product.nombre}</p>
                    <p class="product-price visible">₡${product.precio.toFixed(2)}</p>
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

    // Agregar los productos con el efecto de fade-in
    setTimeout(() => {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach((element) => {
            element.classList.add('visible');
        });
    }, 100); // Ajusta el tiempo si es necesario para el retraso

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



// Función para actualizar el carrito
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
                    <input class="form-control cantidad" type="number" value="${item.quantity}" min="0" data-id="${item.id}">
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

    // Calcular el total con el precio del envío
    const totalConEnvio = total + precioEnvio;

    // Mostrar los totales en el carrito
    $('#subtotal').text(`₡${subtotal.toFixed(2)}`);
    $('#iva').text(`₡${iva.toFixed(2)}`);
    $('#descuento').text(`₡${descuento.toFixed(2)}`);
    $('#envio').text(`₡${precioEnvio.toFixed(2)}`);
    $('#total').text(`₡${totalConEnvio.toFixed(2)}`);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}



// Función para manejar la selección del tipo de envío
document.addEventListener("DOMContentLoaded", function() {
    
    if (tipoEnvioSelect) {  
        tipoEnvioSelect.addEventListener('change', function() {
            const tipoEnvioSeleccionado = this.value;
            switch (tipoEnvioSeleccionado) {
                case 'standard':
                    precioEnvio = 3200;
                    break;
                case 'rapido':
                    precioEnvio = 4700;  
                    break;
                case 'express':
                    precioEnvio = 8400;  
                    break;
                default:
                    precioEnvio = 0;    
                    break;
            }

            // Llamar a actualizarCarrito para recalcular el total
            actualizarCarrito();
        });
    } else {
        console.error("No se encontró el elemento con id 'tipo-envio'");
    }
});




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

//Para eliminar el producto de la tabla cuando llegue a 0
// Actualizar cantidad de producto en el carrito
$(document).on('change', '.cantidad', function () {
    const id = $(this).data('id');
    const nuevaCantidad = parseInt($(this).val());
    const producto = carrito.find(item => item.id === id);

    if (producto) {
        producto.quantity = nuevaCantidad;

        // Si la cantidad es 0, eliminar el producto del carrito
        if (producto.quantity === 0) {
            carrito = carrito.filter(item => item.id !== id);
        }
    }
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
                text: "No hay productos en el carrito",
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
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Si el usuario elige "Retirar en tienda", mostrar la opción correspondiente
                Swal.fire({
                    icon: 'info',
                    title: 'Pago por Retiro en Tienda',
                    text: 'Tu pago será procesado cuando llegues a la tienda. ¡Gracias por tu compra!',
                });
                generarPDFCompletarPago();
                localStorage.removeItem('carrito'); // Eliminar el carrito del localStorage
    
                 carrito = [];
                actualizarCarrito();
                setTimeout(function() {
                    window.location.href = "index.html"; // Redirige a la página de inicio después del pago
                }, 2000);
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


function detectarTarjeta(numero) {
    const tarjeta = numero.replace(/\s/g, '');  

    // Verificar si la tarjeta comienza con un '4' (Visa)
    if (tarjeta.startsWith('4')) {
        return 'visa';  // Es Visa
    }
    // Verificar si la tarjeta comienza con un '5' (MasterCard) o con números en el rango 22-27
    else if (tarjeta.startsWith('5') || (parseInt(tarjeta.substring(0, 2)) >= 22 && parseInt(tarjeta.substring(0, 2)) <= 27)) {
        return 'mastercard';  // Es MasterCard
    } else {
        return 'desconocida';  // Si no es Visa ni MasterCard
    }
}


//Aplicar un algoritmo para detectar el tipo de tarjeta
document.getElementById('card-number').addEventListener('input', function(){
    const cardNumber = this.value;
    const visaIcon = document.getElementById('visa-icon');
    const mastercardIcon = document.getElementById('mastercard-icon');

    const tipo = detectarTarjeta(cardNumber);
     
    if(tipo === 'visa'){
        visaIcon.style.display = 'inline';
        document.getElementById('back-visa-icon').style.display = 'inline';
        document.getElementById('back-mastercard-icon').style.display = 'none';
    }
    else{
        if(tipo === 'mastercard'){
            mastercardIcon.style.display = 'inline';
            document.getElementById('back-mastercard-icon').style.display = 'inline';
            document.getElementById('back-visa-icon').style.display = 'none';
        }
        else{
            visaIcon.style.display = 'none';
            mastercardIcon.style.display = 'none';
            document.getElementById('back-visa-icon').style.display = 'none';
            document.getElementById('back-mastercard-icon').style.display = 'none';
        }
    }

});





//Generamos el PDF al presionar el boton pagar
function generarPDFCompletarPago(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener el texto de la opción seleccionada
    const tipoEnvioTexto = tipoEnvioSelect.options[tipoEnvioSelect.selectedIndex].text;

    // Se asume que el formato del texto siempre sigue el patrón: "Tipo de envío: descripción: precio"
    const tipoEnvioMostrar = tipoEnvioTexto.split(':')[0] || 'No especificado';

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Asegurar que el mes tenga dos dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Asegurar que el día tenga dos dígitos
    const hours = String(now.getHours()).padStart(2, '0'); // Asegurar que la hora tenga dos dígitos
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Asegurar que los minutos tengan dos dígitos
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Asegurar que los segundos tengan dos dígitos
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Asegurar que los milisegundos tengan tres dígitos

    const invoiceNumber = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    // Cargar imagen (asegurate de tener la ruta de la imagen)
    const logoUrl = '../img/logo-with-background.png'; // Reemplaza por la URL o ruta del logo
    const imgWidth = 40; // Ancho de la imagen
    const imgHeight = 22; // Altura de la imagen

    // Agregar la imagen en la esquina superior izquierda (por ejemplo)
    doc.addImage(logoUrl, 'PNG', 14, 10, imgWidth, imgHeight);

    doc.setFontSize(20);
    doc.setTextColor(0, 43, 56); // Color azul oscuro
    doc.setFont("helvetica", "bold"); // Establecer fuente en negrita
    doc.text("Factura de Compra", 105, 20, null, null, 'center'); // Centrado horizontalmente
    doc.setTextColor(0, 0, 0); // Color negro
    doc.setFont("helvetica", "normal"); // Establecer fuente normal
    doc.setFontSize(12);

    // Agregar el número de factura
    doc.text(`Factura Número: ${invoiceNumber}`, 105, 30, null, null, 'center'); // Centrado horizontalmente
    
    // Obtener el nombre del cliente (y reemplazar si es el valor por defecto)
    const customerName = document.getElementById("card-holder-name").textContent.trim();
    
    // Verificar si el nombre del cliente es "Tu nombre aquí" o está vacío
    let clienteNombre = customerName;
    if (clienteNombre === "Tu nombre aquí" || clienteNombre === "") {
        clienteNombre = "Contado";
    }

    doc.text(`Nombre del Cliente: ${clienteNombre}`, 14, 45); // Mostrar el nombre del cliente
    
    // Mostrar el tipo de envío seleccionado
    let y = 55; // Posición vertical
    doc.text(`Tipo de Envío: ${tipoEnvioMostrar}`, 14, y);
  
    // Avanzamos la posición para la tabla de productos
    y += 10;

    // posición vertical inicial
    let total = 0;

    const tableWidth = 180;
    const rowHeight = 10;

    doc.setFillColor(78, 174, 206); // Color #4EAECE (Color azul claro)
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
        doc.text(item.name, 15, y + 7);
        doc.text(`$${item.price.toFixed(2)}`, 80, y + 7);
        doc.text(item.quantity.toString(), 120, y + 7);
        doc.text(`$${subtotal.toFixed(2)}`, 150, y + 7);
        y += rowHeight; // Incremento para la siguiente línea
        total += subtotal;
    });

    // Agregar el precio de envío y total después de la lista de productos
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo del total
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text("Envío:", 15, y + 7);
    doc.text(`$${precioEnvio.toFixed(2)}`, 150, y + 7);
    y += rowHeight; // Incrementar la posición para la siguiente fila

    // Total (Precio Total + Envío)
    total += precioEnvio; // Agregar el precio de envío al total
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo del total
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text("Total:", 15, y + 7);
    doc.text(`$${total.toFixed(2)}`, 150, y + 7);


    doc.save('factura_compra.pdf');
}





function completarPago(){
    document.getElementById('btn-finalizar').addEventListener('click', function(event) {
        event.preventDefault(); // Evita que se recargue la página al hacer clic en el botón
        // Hacemos las validaciones de los datos de entrada

        const cardNumber = document.getElementById('card-number').value;
        const name = document. getElementById('card-name-input').value;
        const correo = document.getElementById('card-email').value;
        const fechaExpiracion = document.getElementById('validity-input').value;
        const codigoCVV = document.getElementById('cvv').value;

        const selectedDate = new Date(fechaExpiracion);
        const cardNumberLength = cardNumber.length;
        const today = new Date();

        if (!cardNumber || !name || !correo || !fechaExpiracion || !codigoCVV) {
            Swal.fire({
                icon: "error",
                title: "Atención",
                text: "Porfavor rellene todos los campos",
              });
            return false;
        }

        if (cardNumberLength < 13 || cardNumberLength > 16) {
            Swal.fire({
                icon: "error",
                title: "Atención",
                text: "El número de tarjeta debe estar entre 13 y 16 dígitos",
              });
            return false;
        }
        if (selectedDate < today) {
            Swal.fire({
                icon: "error",
                title: "Atención",
                text: "La fecha de expiración no puede ser menor al día actual",
              });
            return false;
        }


        Swal.fire({
            //Si se cumplen todas las condiciones muestra el modal Swal, para confirmar
            title: '¿Estás seguro de realizar el pago?',
            text: "¡Una vez realizado, se procesará el pago!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, proceder con el pago',
            cancelButtonText: 'Cancelar',

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

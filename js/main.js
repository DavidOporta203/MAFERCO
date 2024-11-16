const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menu.addEventListener('click', ()=>{
    sidebar.classList.toggle('menu-toggle')
    menu.classList.toggle('menu-toggle');
    main.classList.toggle('menu-toggle');
})

//Listener para realizar animación del apartado partner
window.addEventListener('scroll', () => {
    const partnerItems = document.querySelectorAll('.partner-item');

    partnerItems.forEach(partnerItem => {
        const rect = partnerItem.getBoundingClientRect();

        // Verifica si el elemento está en la vista
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            partnerItem.classList.add('active');
        } else {
            partnerItem.classList.remove('active');
        }
    });
});

//Listener para realizar animación del apartado offers
window.addEventListener('scroll', () => {
    const offerItems = document.querySelectorAll('.offer-item');

    offerItems.forEach(offerItem => {
        const rect = offerItem.getBoundingClientRect();

        // Verifica si el elemento está en la vista
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            offerItem.classList.add('active');
        } else {
            offerItem.classList.remove('active');
        }
    });
});


window.addEventListener('scroll', () => {
    // Usamos requestAnimationFrame para optimizar la ejecución en scroll
    window.requestAnimationFrame(() => {
        const sliderItems = document.querySelectorAll('.container-slider'); 

        sliderItems.forEach(sliderItem => {
            const rect = sliderItem.getBoundingClientRect();

            // Verifica si el elemento está dentro del área visible de la pantalla
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                sliderItem.classList.add('active'); // Agregar la clase active cuando esté en vista
            } else {
                sliderItem.classList.remove('active'); // Quitar la clase active cuando no esté en vista
            }
        });
    });
});


//Listener para realizar animación del apartado products
window.addEventListener('scroll', () => {
    const productItems = document.querySelectorAll('.product-item');

    productItems.forEach(productItem => {
        const rect = productItem.getBoundingClientRect();

        // Verifica si el elemento está en la vista
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            productItem.classList.add('active');
        } else {
            productItem.classList.remove('active');
        }
    });
});


//Este efecto se aplica a la sección de pagos
window.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los elementos que quieres animar
    const elementos = document.querySelectorAll('.contenedor-productos, .producto-carrito, .producto-pagar, .card, .btn-pagar-carrito, h3, p');

    // Agregar la clase .visible a cada uno de los elementos con un pequeño retraso
    let delay = 0; // Empezamos sin retraso

    elementos.forEach((elemento) => {
        setTimeout(() => {
            elemento.classList.add('visible');
        }, delay);
        
        delay += 200; // Aumentar el retraso para los siguientes elementos (200ms)
    });
});

// Función para verificar si un elemento está en la vista
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Detectar el scroll y aplicar la clase 'visible' cuando un elemento entra en la vista
window.addEventListener('scroll', function() {
    // Seleccionar todos los elementos que deben aparecer con scroll
    const elementos = document.querySelectorAll('.contenedor-productos, .producto-carrito, .producto-pagar, .card, .btn-pagar-carrito, h3, p');
    
    // Recorrer cada elemento y verificar si está en la vista
    elementos.forEach((elemento) => {
        if (isElementInViewport(elemento)) {
            elemento.classList.add('visible'); // Añadir la clase 'visible' cuando está en la vista
        }
    });
});
//aqui termina el efecto para la página de pagos//////IMPORTANTE para no perderse


//Lógica aplicada para el carousel del INDEX



// Función para agregar la clase 'visible' inmediatamente al cargar la página
function onLoad() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach((element) => {
        element.classList.add('visible');
    });
}

document.addEventListener('DOMContentLoaded', onLoad);

//Listener para el botón flotante
document.getElementById('toggleButton').addEventListener('click', function() {
    const socialIcons = document.getElementById('socialIcons');
    socialIcons.classList.toggle('show');
});
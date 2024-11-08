const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menu.addEventListener('click', ()=>{
    sidebar.classList.toggle('menu-toggle')
    menu.classList.toggle('menu-toggle');
    main.classList.toggle('menu-toggle');
})

//Listener para el botón flotante
document.getElementById('toggleButton').addEventListener('click', function() {
    const socialIcons = document.getElementById('socialIcons');
    socialIcons.classList.toggle('show');
});

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

// Función para agregar la clase 'visible' inmediatamente al cargar la página
function onLoad() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach((element) => {
        element.classList.add('visible');
    });
}

document.addEventListener('DOMContentLoaded', onLoad);

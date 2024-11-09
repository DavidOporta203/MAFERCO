// Script para la carga de productos
$(document).ready(function(){
    $.getJSON('../json/products.json', function(data){
        const container = $('#product-container');

        data.forEach(product => {
            const card = `
                <div class="product-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <p class="product-description">${product.description}</p>
                        <p class="product-description">₡${product.price}</p>
                        <button class="product-button agregar">Agregar</button>
                        <button class="product-button ver">Ver más</button>
                    </div>
                </div>`;
            container.append(card);
        })
    })
})
// Script para la carga de productos y mostrar el modal de ver más
$(document).ready(function(){
    $.getJSON('json/products.json', function(data){
        const container = $('#product-container');

        data.forEach(product => {
            const card = `
                <div class="product-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <p class="product-title">${product.name}</p>
                        <p class="product-price">₡${product.price}</p>
                        <button class="product-button agregar">Agregar</button>
                        <button class="product-button ver" data-product='${JSON.stringify(product)}'>Ver más</button>
                    </div>
                </div>`;
            container.append(card);
        });

        $('.ver').on('click', function(){
            const product = JSON.parse($(this).attr('data-product'));

            $('#modal-imagen').attr('src', product.image);
            $('#modal-id').text(product.id);
            $('#modal-name').text(product.name);
            $('#modal-description').text(product.description);
            $('#modal-price').text(product.price);
            $('#modal-category').text(product.category);

            $('#productModal').modal('show');
        });
    });
});

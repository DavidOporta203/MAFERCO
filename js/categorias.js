const categorias = document.querySelectorAll('#categorias .categoria');

const contenedorPreguntas = document.querySelectorAll('.contenedor-preguntas');

let categoriaActiva = null;

categorias.forEach((categoria) => {
    categoria.addEventListener('click', (e) => {

        categorias.forEach((element) => {
            element.classList.remove('activa');
        })

        e.currentTarget.classList.toggle('activa');
        categoriaActiva = categoria.dataset.categoria;

        // Activamos el contenedor de preguntas que corresponde
        contenedorPreguntas.forEach((contenedor) => {
            if(contenedor.dataset.categoria === categoriaActiva){
                contenedor.classList.add('activa');
            }else{
                contenedor.classList.remove('activa');
            }
        })

    });
});
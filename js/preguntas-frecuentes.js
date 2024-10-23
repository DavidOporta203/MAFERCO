const preguntas = document.querySelectorAll('.preguntas .contenedor-pregunta');
preguntas.forEach((pregunta) => {
    pregunta.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('activa');

        const respuesta = pregunta.querySelector('.respuesta');
        const alturaRealRespuesta = respuesta.scrollHeight;

        if(!respuesta.computedStyleMap.maxHeight){
            // Si está vacío el maxHeight entonces ponemos un valor
            respuesta.style.maxHeight = alturaRealRespuesta + 'px';
        }else{
            respuesta.style.maxHeight = null;
        }

        // Permitir solo expandir una pregunta a la vez
        preguntas.forEach((elemento => {
            if(pregunta !== elemento){
                elemento.classList.remove('activa');
                elemento.querySelector('.respuesta').style.maxHeight = null;
            }
        }))

    });
});
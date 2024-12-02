const preguntas = document.querySelectorAll('.preguntas .contenedor-pregunta');
preguntas.forEach((pregunta) => {
    pregunta.addEventListener('click', (e) => {
        const respuesta = pregunta.querySelector('.respuesta');
        const alturaRealRespuesta = respuesta.scrollHeight;

        // Alterna la clase activa para expandir o contraer la pregunta
        e.currentTarget.classList.toggle('activa');

        // Si la respuesta está activa, se establece el max-height
        if (respuesta.style.maxHeight) {
            // Si ya tiene max-height, la minizamos a 0
            respuesta.style.maxHeight = null;
        } else {
            // Si no tiene max-height, asignamos el valor real de la altura
            respuesta.style.maxHeight = alturaRealRespuesta + 'px';
        }

        // Permitir solo expandir una pregunta a la vez
        preguntas.forEach((elemento) => {
            if (pregunta !== elemento) {
                elemento.classList.remove('activa');
                elemento.querySelector('.respuesta').style.maxHeight = null;
            }
        });
    });
});

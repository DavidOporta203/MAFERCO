document.addEventListener('DOMContentLoaded', function() {
    const btnLogin = document.getElementById('btnLogin');
    const loginMessage = document.getElementById('loginMessage');
    const alertContainer = document.getElementById('alertContainer');

    // Usuarios "quemados"
    const users = [
        { username: 'andresscastilloo81@gmail.com', password: '12', name: 'Andrés Castillo' },
        { username: 'davidoporta@gmail.com', password: '12', name: 'David Oporta' }
    ];

    btnLogin.addEventListener('click', function() {
        const username = document.getElementById('txtUser').value;
        const password = document.getElementById('txtPassword').value;

        // Validación de usuario
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            // Mostrar el mensaje de éxito con SweetAlert2
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `¡Bienvenido, ${user.name}!`,
                text: 'Inicio de sesión exitoso.',
                showConfirmButton: false,
                timer: 2000
            });
            loginMessage.textContent = "";
         
         setTimeout(() => {
            window.location.href = 'index.html'; // Cambiar a index.html
        }, 3000); // Esperar 3 segundos para que muestre el mensajito 
            
        } else {
            loginMessage.textContent = 'Usuario o contraseña incorrectos.';
            loginMessage.style.color = 'red';
        }
    });
});

//Lógica para hacer visible la contraseña
document.addEventListener('DOMContentLoaded', function() {
    const iconEye = document.querySelector(".icon-eye");

    iconEye.addEventListener('click', function() {
        const input = this.nextElementSibling; // agarra el input que sigue al ícono

        const icon = this.children[0];
        console.log(icon)//solo como prueba a ver que valor devuelve

        // Cambiar el tipo del input
        if (input.type === 'password') {
            input.type = "text"; // Cambia a texto
            icon.classList.remove("fa-eye")
            icon.classList.add("fa-eye-slash")
        } else {
            input.type = "password"; // Cambia de nuevo a contraseña
            icon.classList.remove("fa-eye-slash")
            icon.classList.add("fa-eye")
        }

    });
});


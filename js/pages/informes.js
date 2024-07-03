document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.form').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el envío del formulario por defecto

        // Obtiene los valores de los campos del formulario
        const nombre = document.getElementById('Nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('message').value;

        // Usa EmailJS para enviar el correo
        emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", {
            Nombre: nombre,
            email: email,
            message: mensaje
        })
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Mensaje enviado exitosamente!');
        }, function(error) {
            console.log('FAILED...', error);
            alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        });
    });
});

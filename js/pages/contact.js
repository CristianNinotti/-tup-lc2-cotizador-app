document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.form'); // Selecciono del formulario por su clase

    // Configuración de EmailJS
    emailjs.init('-6cMJBOviHkGei8gT'); // Aca va mi YOUR_USER_ID  de EmailJS

    // Manejo del envío del formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Recolectar datos del formulario
        const formData = new FormData(form);
        const name = formData.get('Nombre');
        const email = formData.get('email');
        const message = formData.get('message');

        // Configuración del servicio de EmailJS
        const serviceID = 'service_qf8i4nj'; // Aca va mi YOUR_SERVICE_ID  de EmailJS
        const templateID = 'template_cqacrj7'; // Aca va mi YOUR_TEMPLATE_ID  de EmailJS

        // Objeto con los datos del email a enviar
        const emailParams = {
            to: 'hgerardo@gmail.com, sbruselario@gmail.com',// Direcciones separadas por coma
            from_name: name,
            from_email: email,
            message: message
        };

        // Envío del email utilizando EmailJS
        emailjs.send(serviceID, templateID, emailParams)
            .then(function () {
                alert('Email enviado correctamente.');
                form.reset(); // Limpio el formulario después del envío exitoso
            }, function (error) {
                console.error('Error al enviar el email:', error);
                alert('Hubo un problema al enviar el email. Por favor, inténtelo más tarde.');
            });
    });
});

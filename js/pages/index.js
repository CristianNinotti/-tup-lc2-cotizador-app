
//Variables globales
let arregloIndex = []; // Para almacenar las cotizaciones obtenidas de la API
let mostrarTodos = true; // Estado para mostrar todas las cotizaciones o una sola

// Mapeo de opciones del combobox a nombres en dataDolar
const mapeoCombobox = {
    "Seleccionar todos": null,
    "Dólar Oficial": "Oficial",
    "Dólar Blue": "Blue",
    "Dólar Bolsa (MEP)": "Bolsa",
    "Dólar Contado con Liqui (CCL)": "Contado con liquidación",
    "Dólar Mayorista": "Mayorista",
    "Dólar Cripto": "Cripto",
    "Dólar Tarjeta": "Tarjeta",
    "Euro": "Euro",
    "Real Brasileño": "Real Brasileño",
    "Peso Chileno": "Peso Chileno",
    "Peso Uruguayo": "Peso Uruguayo"
};

// Función para cargar y mostrar cotizaciones al inicio
function cargarCotizaciones() {
    // Obtener cotizaciones generales (dataDolar)
    fetch("https://dolarapi.com/v1/dolares")
        .then(response => response.json())
        .then(dataDolar => {
            // Limpiar arregloIndex antes de agregar nuevas cotizaciones
            arregloIndex = [];

            // Agregar cotizaciones de dataDolar
            arregloIndex.push(...dataDolar);

            // Obtener cotizaciones específicas
            return Promise.all([
                fetch("https://dolarapi.com/v1/cotizaciones/eur").then(response => response.json()),
                fetch("https://dolarapi.com/v1/cotizaciones/brl").then(response => response.json()),
                fetch("https://dolarapi.com/v1/cotizaciones/clp").then(response => response.json()),
                fetch("https://dolarapi.com/v1/cotizaciones/uyu").then(response => response.json())
            ]);
        })
        .then(data => {
            // Agregar cotizaciones específicas
            arregloIndex.push(...data);

            // Mostrar las cotizaciones segun su estado actual
            if (mostrarTodos) {
                mostrarCotizaciones();
            }
            actualizarFechaHora(); // Actualizar fecha y hora de la última actualización
            actualizarCada5Minutos(); // Actualizar automáticamente cada 5 minutos
        })
        .catch(error => {
            console.error("Error al obtener datos de cotización:", error);
            mostrarMensajeError("Error al cargar las cotizaciones. Por favor, inténtelo nuevamente más tarde.");
        });
}

// Función para manejar cambios en el combobox
function handleChange() {
    const seleccion = document.getElementById("combobox").value;
    
    // Obtener el nombre de cotización correspondiente según el mapeo
    const nombreCotizacion = mapeoCombobox[seleccion];

    if (nombreCotizacion === null) {
        mostrarTodos = true;
        mostrarCotizaciones(); // Mostrar todas las cotizaciones
    } else {
        mostrarTodos = false;
        // Buscar la cotización en arregloIndex
        const cotizacion = arregloIndex.find(item => item.nombre.toLowerCase().trim() === nombreCotizacion.toLowerCase().trim());
        if (cotizacion) {
            mostrarCotizacionIndividual(cotizacion);
        } else {
            mostrarMensajeError("No se encontró la cotización seleccionada.");
        }
    }
}

// Función para mostrar todas las cotizaciones disponibles
function mostrarCotizaciones() {
    const plantillaPrecios = document.querySelector(".plantilla-precios");
    plantillaPrecios.innerHTML = ""; // Limpiar contenido anterior

    arregloIndex.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        
        const itemHtml = `
            <div class="tipo-moneda">
                <h3>${item.nombre}</h3>
                <div class="compra-venta">
                    <div class="compra">
                        <h4>Compra</h4>$${item.compra}
                    </div>
                    <div class="venta">
                        <h4>Venta</h4>$${item.venta}
                    </div>
                </div>
            </div>
            <i class="fa-solid fa-star"></i>
        `;
        
        itemDiv.innerHTML = itemHtml;
        plantillaPrecios.appendChild(itemDiv);

        // Agregar evento clic a la estrella de cada ítem
        const star = itemDiv.querySelector('.fa-star');
        star.addEventListener('click', estrellaFavorito);
    });
}

// Función para mostrar una cotización individual
function mostrarCotizacionIndividual(cotizacion) {
    const plantillaPrecios = document.querySelector(".plantilla-precios");
    plantillaPrecios.innerHTML = ""; // Limpiar contenido anterior

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    
    const itemHtml = `
        <div class="tipo-moneda">
            <h3>${cotizacion.nombre}</h3>
            <div class="compra-venta">
                <div class="compra">
                    <h4>Compra</h4>$${cotizacion.compra}
                </div>
                <div class="venta">
                    <h4>Venta</h4>$${cotizacion.venta}
                </div>
            </div>
        </div>
        <i class="fa-solid fa-star"></i>
    `;
    
    itemDiv.innerHTML = itemHtml;
    plantillaPrecios.appendChild(itemDiv);

    // Agregar evento clic a la estrella
    const star = itemDiv.querySelector('.fa-star');
    star.addEventListener('click', estrellaFavorito);
}

// Función para mostrar un mensaje de error
function mostrarMensajeError(mensaje) {
    const plantillaPrecios = document.querySelector(".plantilla-precios");
    plantillaPrecios.innerHTML = `<div class="mensaje-error">${mensaje}</div>`;
}

// Función para actualizar fecha y hora
function actualizarFechaHora() {
    const fechaHoraElemento = document.querySelector('.actualizacion-datos-fecha-hora');
    if (fechaHoraElemento) {
        const ahora = new Date();
        const fechaFormateada = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
        const horaFormateada = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}hs`;
        fechaHoraElemento.innerHTML = `<p>Datos Actualizados al ${fechaFormateada} ${horaFormateada}</p>`;
    }
}

// Función para actualizar automáticamente cada 5 minutos
function actualizarCada5Minutos() {
    setInterval(() => {
        cargarCotizaciones();
    }, 300000); // 5 minutos en milisegundos
}

// Cargar las cotizaciones al cargar la página
window.onload = cargarCotizaciones;

// clic en el icono de filtro
document.querySelector('.icono-filtro').addEventListener('click', () => {
    handleChange(); // Manejar el cambio de selección de cotización
});

// Función para manejar el clic en la estrella
function estrellaFavorito(event) {
    const star = event.target;
    star.classList.toggle('active'); // Activar/desactivar clase "active"

    // Obtener la cotización asociada al ítem
    const tipoMoneda = star.parentElement.querySelector('h3').textContent;
    const cotizacion = arregloIndex.find(item => item.nombre === tipoMoneda);

    // Obtener las cotizaciones guardadas actualmente
    let cotizacionesGuardadas = localStorage.getItem('cotizaciones');
    cotizacionesGuardadas = cotizacionesGuardadas ? JSON.parse(cotizacionesGuardadas) : [];

    // Verificar si ya existe una cotización con la misma fecha, hora, minutos y segundos
    const existeCotizacion = cotizacionesGuardadas.some(item => {
        const fechaItem = new Date(item.fechaActualizacion);
        const fechaCotizacion = new Date(cotizacion.fechaActualizacion);
        return item.nombre === cotizacion.nombre &&
               fechaItem.getDate() === fechaCotizacion.getDate() &&
               fechaItem.getMonth() === fechaCotizacion.getMonth() &&
               fechaItem.getFullYear() === fechaCotizacion.getFullYear() &&
               fechaItem.getHours() === fechaCotizacion.getHours() &&
               fechaItem.getMinutes() === fechaCotizacion.getMinutes() &&
               fechaItem.getSeconds() === fechaCotizacion.getSeconds();
    });

    if (existeCotizacion) {
        alert("No se puede guardar esta cotización. Ya existe una cotización guardada para esta moneda en el mismo segundo del mismo día.");
        star.classList.remove('active'); // Desactivar la estrella si ya existe
        return; // Dejo de guardar
    }

    // Guardar o eliminar la cotización favorita
    if (star.classList.contains('active')) {
        // Guardar la cotización con el nombre de la moneda correspondiente
        localStorage.setItem('favorito_' + tipoMoneda, JSON.stringify(cotizacion));
    } else {
        // Eliminar la cotización guardada
        localStorage.removeItem('favorito_' + tipoMoneda);
    }

    // Actualizar las cotizaciones guardadas
    const index = cotizacionesGuardadas.findIndex(item => item.nombre === cotizacion.nombre && 
                                                          new Date(item.fechaActualizacion).getTime() === new Date(cotizacion.fechaActualizacion).getTime());
    if (star.classList.contains('active')) {
        if (index === -1) {
            cotizacionesGuardadas.push(cotizacion);
        }
    } else {
        if (index !== -1) {
            cotizacionesGuardadas.splice(index, 1);
        }
    }

    // Guardar de nuevo en localStorage
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesGuardadas));
}

// Agregar evento clic a todas las estrellas al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const estrellas = document.querySelectorAll('.fa-star');
    estrellas.forEach(star => {
        star.addEventListener('click', estrellaFavorito);
    });
});


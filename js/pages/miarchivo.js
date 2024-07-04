// Variables globales
let cotizaciones = []; // Arreglo para almacenar las cotizaciones

// Función para inicializar la página
function inicializarPagina() {
    cargarCotizaciones();
    configurarEventos();
}

// Función para cargar las cotizaciones desde localStorage o mostrar una alerta
function cargarCotizaciones() {
    const cotizacionesGuardadas = localStorage.getItem('cotizaciones');

    if (cotizacionesGuardadas) {
        cotizaciones = JSON.parse(cotizacionesGuardadas);
    } else {
        cotizaciones = []; // Inicializar como un arreglo vacío
        alert('No hay cotizaciones guardadas.'); // Mostrar alerta si no hay cotizaciones
    }

    mostrarCotizaciones(); // Mostrar las cotizaciones cargadas
}

function mostrarCotizaciones() {
    const tablaCotizaciones = document.querySelector('.tabla tbody');
    tablaCotizaciones.innerHTML = ''; // Limpiar contenido anterior

    // Ordenar cotizaciones por fecha de actualización de menor a mayor
    cotizaciones.sort((b, a) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion));

    let fechaActual = null;
    cotizaciones.forEach(cotizacion => {
        // Obtener la fecha de actualización
        const fecha = new Date(cotizacion.fechaActualizacion);
        const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

        if (fechaFormateada !== fechaActual) {
            // Agregar nueva fila de fecha
            const filaFecha = document.createElement('tr');
            filaFecha.classList.add('fila');
            filaFecha.innerHTML = `<td class="contenido-fecha" colspan="5"><b>${fechaFormateada}</b></td>`;
            tablaCotizaciones.appendChild(filaFecha);
            fechaActual = fechaFormateada;
        }

        // Agregar fila de cotización
        const filaCotizacion = document.createElement('tr');
        filaCotizacion.classList.add('fila', 'contenido-moneda');
        filaCotizacion.innerHTML = `
            <td></td>
            <td class="columna-moneda">${cotizacion.nombre}</td>
            <td>${cotizacion.compra}</td>
            <td>${cotizacion.venta}</td>
            <td class="columna-borrar"><i class="fa-solid fa-eraser"></i></td>
        `;
        // Almacenar cotización como un atributo de datos en la fila
        filaCotizacion.dataset.moneda = cotizacion.nombre;
        filaCotizacion.dataset.fechaActualizacion = cotizacion.fechaActualizacion;

        tablaCotizaciones.appendChild(filaCotizacion);
    });

    configurarEventosEliminar();
}

// Función para configurar eventos de eliminar cotización
function configurarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll('.fa-eraser');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', function() {
            const fila = this.closest('.contenido-moneda');
            const moneda = fila.dataset.moneda;
            const fechaActualizacion = fila.dataset.fechaActualizacion;
            eliminarCotizacion(moneda, fechaActualizacion);
        });
    });
}

// Función para eliminar una cotización por moneda y fecha de actualización
function eliminarCotizacion(nombreMoneda, fechaActualizacion) {
    // Filtrar las cotizaciones para excluir la que se quiere eliminar
    cotizaciones = cotizaciones.filter(cotizacion =>
        !(cotizacion.nombre === nombreMoneda && cotizacion.fechaActualizacion === fechaActualizacion)
    );

    // Actualizar localStorage con las cotizaciones actualizadas
    localStorage.setItem('cotizaciones', JSON.stringify(cotizaciones));

    // Mostrar la tabla actualizada
    mostrarCotizaciones();
}

// Función para imprimir el contenido de la tabla
function imprimirContenidoTabla() {
    const contenidoTabla = document.querySelector('.contenedor-tabla');
    const contenidoImpresion = contenidoTabla.cloneNode(true);
    const elementosNoImpresos = contenidoImpresion.querySelectorAll('.fa-eraser, .contenedor-impresora');
    elementosNoImpresos.forEach(elemento => elemento.remove());
    const ventanaImpresion = window.open('', 'Impresión');
    ventanaImpresion.document.body.innerHTML = contenidoImpresion.outerHTML;
    ventanaImpresion.print();
}

// Función para configurar eventos generales
function configurarEventos() {
    const botonImpresora = document.querySelector('.contenedor-impresora');
    botonImpresora.addEventListener('click', imprimirContenidoTabla);
}

// Llamar a inicializarPagina al cargar la página
document.addEventListener('DOMContentLoaded', inicializarPagina);














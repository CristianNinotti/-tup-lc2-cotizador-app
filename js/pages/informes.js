document.addEventListener("DOMContentLoaded", function () {
  const cotizaciones = JSON.parse(localStorage.getItem("cotizaciones")) || [];
  const comboBox = document.getElementById("combobox");
  const cuerpoTabla = document.querySelector(".tabla tbody");
  const ctx = document.getElementById("myChart").getContext("2d");
  let chart;

  // Mapeo para el combobox
  const mapeoCombobox = {
    "Seleccionar todos": null,
    "Dólar Oficial": "Oficial",
    "Dólar Blue": "Blue",
    "Dólar Bolsa (MEP)": "Bolsa",
    "Dólar Contado con Liqui (CCL)": "Contado con liquidación",
    "Dólar Mayorista": "Mayorista",
    "Dólar Cripto": "Cripto",
    "Dólar Tarjeta": "Tarjeta",
    Euro: "Euro",
    "Real Brasileño": "Real Brasileño",
    "Peso Chileno": "Peso Chileno",
    "Peso Uruguayo": "Peso Uruguayo",
  };

  // Función para cargar las cotizaciones en la tabla
  function cargarCotizaciones(nombreMoneda) {
    cuerpoTabla.innerHTML = "";

    // Filtrar cotizaciones según el nombre de moneda seleccionado en el combobox
    let cotizacionesFiltradas = [];
    if (nombreMoneda === "Seleccionar todos" || !nombreMoneda) {
      cotizacionesFiltradas = cotizaciones;
      actualizarGraficoNull(nombreMoneda); // Llamar a actualizarGraficoNull
    } else {
      const monedaFiltrar = mapeoCombobox[nombreMoneda];
      cotizacionesFiltradas = cotizaciones.filter(
        (cotizacion) => cotizacion.nombre === monedaFiltrar
      );
      actualizarGrafico(nombreMoneda); // Llamar a actualizarGrafico con nombreMoneda específico
    }

    // Ordenar cotizaciones por fecha descendente
    cotizacionesFiltradas.sort(
      (a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion)
    );

    // Crear filas en la tabla
    const cotizacionesOrdenadas = {};
    cotizacionesFiltradas.forEach((cotizacion) => {
      const moneda = cotizacion.nombre;
      if (!cotizacionesOrdenadas[moneda]) {
        cotizacionesOrdenadas[moneda] = [];
      }
      cotizacionesOrdenadas[moneda].push(cotizacion);
    });

    // Crear filas en la tabla
    Object.keys(cotizacionesOrdenadas).forEach((moneda) => {
      let primeraFila = true;
      cotizacionesOrdenadas[moneda].forEach((cotizacion, index) => {
        const filaMoneda = document.createElement("tr");
        filaMoneda.classList.add("fila-contenido-moneda");

        // Celda para el nombre de la moneda (solo en la primera fila de cada moneda)
        const celdaMoneda = document.createElement("td");
        celdaMoneda.classList.add("columna-moneda");
        if (primeraFila) {
          celdaMoneda.textContent = moneda;
          celdaMoneda.setAttribute(
            "rowspan",
            cotizacionesOrdenadas[moneda].length
          );
          primeraFila = false;
        } else {
          celdaMoneda.classList.add("columna-moneda-vacia");
        }
        filaMoneda.appendChild(celdaMoneda);

        // Celda para la fecha
        const celdaFecha = document.createElement("td");
        celdaFecha.classList.add("columna-fecha");
        celdaFecha.textContent = formatoFecha(cotizacion.fechaActualizacion);
        filaMoneda.appendChild(celdaFecha);

        // Celda para la compra
        const celdaCompra = document.createElement("td");
        celdaCompra.textContent = cotizacion.compra;
        celdaCompra.classList.add("columna-compra");
        filaMoneda.appendChild(celdaCompra);

        // Celda para la venta
        const celdaVenta = document.createElement("td");
        celdaVenta.textContent = cotizacion.venta;
        celdaVenta.classList.add("columna-venta");
        filaMoneda.appendChild(celdaVenta);

        // Celda para la variación
        const celdaVariacion = document.createElement("td");
        const iconoVariacion = document.createElement("i");
        iconoVariacion.classList.add(
          "fa-regular",
          calcularVariacionIcono(cotizacionesOrdenadas[moneda], index)
        );
        celdaVariacion.appendChild(iconoVariacion);
        celdaVariacion.classList.add("columna-variacion");
        filaMoneda.appendChild(celdaVariacion);

        cuerpoTabla.appendChild(filaMoneda);
      });
    });
  }

  // Función para calcular el ícono de variación
  function calcularVariacionIcono(cotizaciones, index) {
    if (index === 0 || !cotizaciones[index - 1]) {
      return calcularVariacionIconoDirecto(cotizaciones[index]);
    }

    const cotizacionActual = cotizaciones[index];
    const cotizacionAnterior = cotizaciones[index - 1];

    // Comparar la fecha para decidir si ha subido o bajado
    if (
      cotizacionActual.fechaActualizacion >
      cotizacionAnterior.fechaActualizacion
    ) {
      return "fa-circle-down"; // Subió
    } else if (
      cotizacionActual.fechaActualizacion <
      cotizacionAnterior.fechaActualizacion
    ) {
      return "fa-circle-up"; // Bajó
    } else {
      return calcularVariacionIconoDirecto(cotizaciones[index]);
    }
  }

  function calcularVariacionIconoDirecto(cotizacion) {
    const variacion =
      parseFloat(cotizacion.venta) - parseFloat(cotizacion.compra);
    if (variacion > 0.0) {
      return "fa-circle-down"; // Subió
    } else if (variacion < 0) {
      return "fa-circle-up"; // Bajó
    } else if ((variacion = 0)) {
      return "fa-circle";
    } else {
      return "fa-circle"; // Sin cambios
    }
  }

  // Función para formatear la fecha
  function formatoFecha(fecha) {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Función para obtener un color aleatorio
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Función para actualizar el gráfico cuando se selecciona "Seleccionar todos"
  function actualizarGraficoNull(nombreMoneda) {
    if (chart) {
      chart.destroy();
    }

    // Filtrar y ordenar cotizaciones por fecha ascendente
    const cotizacionesFiltradas = cotizaciones.sort(
      (b, a) => new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion)
    );

    const labels = [];
    const dataCompra = [];
    const dataVariacion = [];
    const backgroundColors = [];
    const borderColors = [];

    // Obtener todas las monedas disponibles
    const monedasDisponibles = Array.from(
      new Set(cotizaciones.map((cotizacion) => cotizacion.nombre))
    );

    // Asignar colores únicos a cada moneda y obtener los valores de compra y variación
    monedasDisponibles.forEach((moneda) => {
      labels.push(moneda);

      const cotizacionesMoneda = cotizacionesFiltradas.filter(
        (c) => c.nombre === moneda
      );
      if (cotizacionesMoneda.length > 0) {
        const compraActual =
          typeof cotizacionesMoneda[0].compra === "string"
            ? parseFloat(
                cotizacionesMoneda[0].compra.replace("$", "").replace(",", ".")
              )
            : cotizacionesMoneda[0].compra;
        dataCompra.push(compraActual);

        // Calcular la variación si hay datos anteriores
        if (cotizacionesMoneda.length > 1) {
          const compraAnterior =
            typeof cotizacionesMoneda[1].compra === "string"
              ? parseFloat(
                  cotizacionesMoneda[1].compra
                    .replace("$", "")
                    .replace(",", ".")
                )
              : cotizacionesMoneda[1].compra;
          const variacion = compraActual - compraAnterior;
          dataVariacion.push(variacion);
        } else {
          dataVariacion.push(0); // Si no hay cotización anterior, variación es 0
        }

        const color = getRandomColor();
        backgroundColors.push(color);
        borderColors.push(color);
      } else {
        dataCompra.push(0); // Si no hay cotización para la moneda, poner 0
        dataVariacion.push(0);
        const color = getRandomColor();
        backgroundColors.push(color);
        borderColors.push(color);
      }
    });

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Precio de Compra",
            data: dataCompra,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
          {
            label: "Variación",
            data: dataVariacion,
            backgroundColor: backgroundColors.map((color) =>
              hexToRGBA(color, 0.5)
            ),
            borderColor: borderColors,
            borderWidth: 1,
            type: "line", // Mostrar variaciones como línea sobre las barras
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Precio de Compra y Variación por Moneda",
            font: {
              size: 20,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Precios",
            },
            ticks: {
              stepSize: 20,
            },
          },
          x: {
            title: {
              display: true,
              text: "Monedas",
            },
            ticks: {
              autoSkip: false,
            },
          },
        },
      },
    });
  }

  // Función para obtener un color aleatorio
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Función para convertir color hexadecimal a rgba con transparencia
  function hexToRGBA(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Función para actualizar el gráfico cuando se selecciona una moneda específica
  function actualizarGrafico(nombreMoneda) {
    if (chart) {
      chart.destroy();
    }

    // Filtrar y ordenar cotizaciones por fecha ascendente
    const cotizacionesFiltradas = cotizaciones
      .filter(
        (cotizacion) =>
          !nombreMoneda || cotizacion.nombre === mapeoCombobox[nombreMoneda]
      )
      .sort(
        (b, a) =>
          new Date(a.fechaActualizacion) - new Date(b.fechaActualizacion)
      );

    const labels = [];
    const compraData = [];
    const ventaData = [];

    cotizacionesFiltradas.forEach((cotizacion) => {
      labels.unshift(formatoFecha(cotizacion.fechaActualizacion).slice(0, 10)); // Reducir a solo la fecha
      const compra =
        typeof cotizacion.compra === "string"
          ? parseFloat(cotizacion.compra.replace("$", "").replace(",", "."))
          : cotizacion.compra;
      const venta =
        typeof cotizacion.venta === "string"
          ? parseFloat(cotizacion.venta.replace("$", "").replace(",", "."))
          : cotizacion.venta;
      compraData.unshift(compra);
      ventaData.unshift(venta);
    });

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Compra de ${nombreMoneda}`,
            data: compraData,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: `Venta de ${nombreMoneda}`,
            data: ventaData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: `Cotizaciones de ${nombreMoneda}`,
            font: {
              size: 20,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: "Precios",
            },
            ticks: {
              stepSize: 50,
            },
          },
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10, // Limitar el número de etiquetas en el eje x para hacerlas más pequeñas
            },
          },
        },
      },
    });
  }

  // Evento change del combobox para cargar las cotizaciones correspondientes
  comboBox.addEventListener("change", function () {
    const nombreMoneda = this.value;
    cargarCotizaciones(nombreMoneda);
  });

  // Evento al hacer clic en el icono de filtro
  const iconoFiltro = document.querySelector(".fa-solid.fa-filter");
  if (iconoFiltro) {
    iconoFiltro.addEventListener("click", function () {
      const monedaSeleccionada = comboBox.value;
      cargarCotizaciones(monedaSeleccionada);
    });
  }

  // Función para abrir la modal
  const abrirModal = () => {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    // Agregar un evento para cerrar la modal al hacer clic fuera de ella
    window.addEventListener("click", outsideClick);

    // Agregar evento para cerrar la modal al hacer clic en la cruz (X)
    const cerrarSpan = document.querySelector("span.close");
    cerrarSpan.addEventListener("click", closeModal);

    // Evento para cerrar la modal al hacer clic en el botón "Cerrar"
    const cerrarModalBtn = document.getElementById("cerrarModal");
    cerrarModalBtn.addEventListener("click", closeModal);
  };

  // Función para cerrar la modal
  const closeModal = () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";

    // Remover eventos al cerrar la modal
    window.removeEventListener("click", outsideClick);
    const cerrarSpan = document.querySelector("span.close");
    cerrarSpan.removeEventListener("click", closeModal);
  };

  // Función para cerrar la modal si se hace clic fuera de ella
  const outsideClick = (event) => {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
      closeModal();
    }
  };

  // Evento para abrir la modal al hacer clic en el enlace
  const compartirInfoLink = document.querySelector(".mail .Texto-info");
  compartirInfoLink.addEventListener("click", function (event) {
    event.preventDefault();
    abrirModal();
  });
  const form = document.querySelector(".form");
  // Configuración de EmailJS
  emailjs.init("hvwQ-bV8E0i3YrkrW"); // Aca va mi YOUR_USER_ID  de EmailJS

  // Manejo del envío del formulario
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    // Recolectar datos del formulario
    const formData = new FormData(form);
    const name = formData.get("nombre");
    const email = formData.get("email");
    const message = formData.get("mensaje");

    // Configuración del servicio de EmailJS
    const serviceID = "service_15etgsb"; // Aca va mi YOUR_SERVICE_ID  de EmailJS
    const templateID = "template_72s4h35"; // Aca va mi YOUR_TEMPLATE_ID  de EmailJS

    // Objeto con los datos del email a enviar
    const emailParams = {
      to: "hgerardo@gmail.com, sbruselario@gmail.com", // Direcciones separadas por coma
      from_name: name,
      from_email: email,
      message: message,
    };

    // Envío del email utilizando EmailJS
    emailjs.send(serviceID, templateID, emailParams).then(
      function () {
        alert("Email enviado correctamente.");
        form.reset(); // Limpio el formulario después del envío exitoso
      },
      function (error) {
        console.error("Error al enviar el email:", error);
        alert(
          "Hubo un problema al enviar el email. Por favor, inténtelo más tarde."
        );
      }
    );
  });

  // Cargar las cotizaciones por defecto al cargar la página
  cargarCotizaciones("Seleccionar todos");
});






// const cotizaciones = [];

// fetch("https://dolarapi.com/v1/dolares/oficial")
//   .then(response => response.json())
//   .then(dataDolarOficial => {
//     cotizaciones.push(dataDolarOficial);
//     return fetch("https://dolarapi.com/v1/dolares/blue");
//   })
//   .then(response => response.json())
//   .then(dataDolarBlue => {
//     cotizaciones.push(dataDolarBlue);
//     return fetch("https://dolarapi.com/v1/dolares/bolsa");
//   })
//   .then(response => response.json())
//   .then(dataDolarBolsa => {
//     cotizaciones.push(dataDolarBolsa);
//     return fetch("https://dolarapi.com/v1/dolares/contadoconliqui");
//   })
//   .then(response => response.json())
//   .then(dataDolarCC => {
//     cotizaciones.push(dataDolarCC);
//     return fetch("https://dolarapi.com/v1/dolares/tarjeta");
//   })
//   .then(response => response.json())
//   .then(dataDolarTarjeta => {
//     cotizaciones.push(dataDolarTarjeta);
//     return fetch("https://dolarapi.com/v1/dolares/mayorista");
//   })
//   .then(response => response.json())
//   .then(dataDolarMayorista => {
//     cotizaciones.push(dataDolarMayorista);
//     return fetch("https://dolarapi.com/v1/dolares/cripto");
//   })
//   .then(response => response.json())
//   .then(dataDolarCripto => {
//     cotizaciones.push(dataDolarCripto);
//     return fetch("https://dolarapi.com/v1/cotizaciones/eur");
//   })
//   .then(response => response.json())
//   .then(dataEuro => {
//     cotizaciones.push(dataEuro);
//     return fetch("https://dolarapi.com/v1/cotizaciones/brl");
//   })
//   .then(response => response.json())
//   .then(dataReal => {
//     cotizaciones.push(dataReal);
//     return fetch("https://dolarapi.com/v1/cotizaciones/clp");
//   })
//   .then(response => response.json())
//   .then(dataChile => {
//     cotizaciones.push(dataChile);
//     return fetch("https://dolarapi.com/v1/cotizaciones/uyu");
//   })
//   .then(response => response.json())
//   .then(dataUruguay => {
//     cotizaciones.push(dataUruguay);

//     // Una vez que todas las solicitudes han sido completadas, creas el objeto cotizacionesObjeto
//     const cotizacionesObjeto = {
//       dolarOficial: cotizaciones[0],
//       dolarBlue: cotizaciones[1],
//       dolarBolsa: cotizaciones[2],
//       dolarCC: cotizaciones[3],
//       dolarTarjeta: cotizaciones[4],
//       dolarMayorista: cotizaciones[5],
//       dolarCripto: cotizaciones[6],
//       euro: cotizaciones[7],
//       real: cotizaciones[8],
//       chileno: cotizaciones[9],
//       uruguayo: cotizaciones[10]
//     };

//     console.log(cotizacionesObjeto); // Aquí puedes hacer lo que quieras con los datos
//     console.log(cotizaciones)
//   })
//   .catch(error => {
//     console.error("Error al obtener datos de cotización:", error);
//   });




//   /*
// var arrayCotizaciones = [];
// var objetoCotizaciones = {};

//   // Todos los fetchs por separado
//   fetch 1 -- > URL1;
// arrayCotizaciones.push(resultado);

//   fetch 2 -- -> URL2;
// arrayCotizaciones.push(resultado2);

// */

let arregloNuevo = []

fetch("https://dolarapi.com/v1/dolares")
  .then(response => response.json())
  .then(dataDolar => {
    console.log(dataDolar)  // Para ver el tipo de dato
    arregloNuevo = dataDolar;  // Arreglo nuevo
    return fetch("https://dolarapi.com/v1/cotizaciones/eur")
  })
  .then(response => response.json())
  .then(dataEuro => {
    arregloNuevo.push(dataEuro);
    return fetch("https://dolarapi.com/v1/cotizaciones/brl");
  })
  .then(response => response.json())
  .then(dataReal => {
    arregloNuevo.push(dataReal);
    return fetch("https://dolarapi.com/v1/cotizaciones/clp");
  })
  .then(response => response.json())
  .then(dataChile => {
    arregloNuevo.push(dataChile);
    return fetch("https://dolarapi.com/v1/cotizaciones/uyu");
  })
  .then(response => response.json())
  .then(dataUruguay => {
    arregloNuevo.push(dataUruguay);
  })  
  .catch(error => {
    console.error("Error al obtener datos de cotización:", error);
  });

  // en inicio se actualiza cada 5 minutos
  // en mi archivo en local storage ( se guardan el historial de la cotizacion en favoritos en mi archivo del index a mi archivo)
  // en mi informe se actualiza cada 5 minutos





  //ACÁ ESTOY PROBANDO EL CAMBIO DE OPINIONES
  // Array de opiniones (puedes agregar más si quieres)
  const opiniones = [
    {
      imagen: "img/fran.png",
        nombre: "Poli Veliz Francisco Alberto",
        comentario: "Formamos un gran equipo con Ninotti Cristian y Gonzalez Nahuel."
    },
    {
        imagen: "img/cris.jpg",
        nombre: "Ninotti Cristian",
        comentario: "Formamos un gran equipo con Poli Veliz Francisco y Gonzalez Nahuel."
    },
    {
        imagen: "img/nahue.jpg",
        nombre: "Gonzalez Nahuel",
        comentario: "Formamos un gran equipo con Ninotti Cristian y Poli Veliz Francisco."
    }
];

const legajos = [
  {
    legajo: "53393",
    
  },
  {
    legajo: "53350",
  },
  {
    legajo: "53640",
  }
];

let index = 0;
const opinionContainer = document.getElementById('opinionContainer');
const desarrolladoPorContainer = document.querySelector('.desarrollado-por');

// Función para cambiar la opinión cada 5 segundos
function cambiarOpinion() {
    opinionContainer.innerHTML = `
        <div class="opinion-img">
            <img src="${opiniones[index].imagen}" alt="${opiniones[index].nombre}">
        </div>
        <div class="opinion-nombre">
            <h2>${opiniones[index].nombre}</h2>
            <p>${opiniones[index].comentario}</p>
        </div>
    `;
    index = (index + 1) % opiniones.length; // Avanza al siguiente índice circularmente
}

function rotarDesarrollador() {
  desarrolladoPorContainer.innerHTML = `
      <li>
          <p><b>Desarrollado por:</b></p>
          <p>${opiniones[index].nombre} (${legajos[index].legajo})</p>
          <p>TUP 08 - 2024</p>
      </li>
  `;
  index = (index + 1) % opiniones.length;
}



// Cambiar la opinión inicial
cambiarOpinion();

rotarDesarrollador();

// Cambiar la opinión cada 5 segundos
setInterval(cambiarOpinion, 5000);

setInterval(rotarDesarrollador, 5000); // Rota el desarrollador cada 5 segundos



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


  /* Grafica
async function obtenerCotizaciones () {
  try {
    etiquetas.push('09/06/2024', '10/06/2024', '11/06/2024', '12/06/2024');
    
    fecha 
        moneda dolar 
        valor 
        moneda euro 
        valor
    fecha 
        moneda dolar 
        valor
        moneda bloue    
        valor

    fecha 1
    {moneda: dolar,
      valor: 1,
    }, 
    {moneda: euro,
      valor: 100,
    },
    fecha 2
    {moneda: dolar,
      valor: 2
    },
    {
      moneda: blue,
      valor: 100,
    },



  }
}

objdatos = {
  label: "USD OFicial",
  data: [,680,1000], //Variacion de precios // Primer lugar vacio
  borderColor: blue,
  backgroundColor: lighblue,
  borderWitdh: 1,
  fill: false
}
  datosLinea.push(objDatos);
*/
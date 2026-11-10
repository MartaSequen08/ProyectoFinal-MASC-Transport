/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */



const rutas = [
    {
        id: 1,
        nombre: "Ruta 1 - Centro Histórico",
        origen: "Terminal zona 1",
        destino: "Zona 18",
        tarifa: 5,
        paradas: [
            "Terminal zona 1",
            "Parque Colón",
            "Catedral Metropolitana",
            "Centro Cívico",
            "Zona 6",
            "Zona 18"
        ]
    },
    {
        id: 2,
        nombre: "Ruta 2 - Roosevelt",
        origen: "Terminal zona 1",
        destino: "Mixco",
        tarifa: 5,
        paradas: [
            "Terminal zona 1",
            "El Trébol",
            "Calzada Roosevelt",
            "San Cristóbal",
            "Mixco"
        ]
    }
];


// MOSTRAR RUTAS DISPONIBLES
function mostrarRutas() {

    const contenedor = document.getElementById("listaRutas");

    contenedor.innerHTML = "";

    rutas.forEach((ruta,index) => {

        const tarjeta = document.createElement("div");
        const color = index === 0 ? "#2563EB" : "#16A34A";

        tarjeta.className = "tarjeta-ruta";

        tarjeta.innerHTML += `
        <div class="ruta-card">
                <h3>
                    <span class="indicador-ruta"
                          style="background-color: ${color};">
                    </span>
                    ${ruta.nombre}
                </h3>
            <h3>${ruta.nombre}</h3>
            <p><strong>Origen:</strong> ${ruta.origen}</p>
            <p><strong>Destino:</strong> ${ruta.destino}</p>
            <p><strong>Tarifa:</strong> Q${ruta.tarifa.toFixed(2)}</p>
            <h4>Paradas:</h4>
            <ol>
                ${ruta.paradas.map(parada => `<li>${parada}</li>`).join("")}
            </ol>
        `;

        contenedor.appendChild(tarjeta);
    });
}
document.addEventListener("DOMContentLoaded", mostrarRutas);
// LLENAR SELECTOR DE RUTAS
function llenarSelectorRutas() {
    const selector = document.getElementById("rutaSeleccionada");

    selector.innerHTML = '<option value="">Selecciona una ruta</option>';

    rutas.forEach((ruta, index) => {
        const opcion = document.createElement("option");

        opcion.value = index;
        opcion.textContent = ruta.nombre;

        selector.appendChild(opcion);
    });
}

function consultarRuta() {
    const selector = document.getElementById("rutaSeleccionada");
    const indice = selector.value;
    const informacion = document.getElementById("informacionRuta");

    if (indice === "") {
        informacion.innerHTML = "";
        return;
    }

    const ruta = rutas[Number(indice)];

    informacion.innerHTML = `
        <h3>${ruta.nombre}</h3>
        <p><strong>Origen:</strong> ${ruta.origen}</p>
        <p><strong>Destino:</strong> ${ruta.destino}</p>
        <p><strong>Paradas:</strong> ${ruta.paradas.join(", ")}</p>
    `;
}
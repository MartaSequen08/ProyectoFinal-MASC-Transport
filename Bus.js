/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */




// CREDENCIALES DEL ADMINISTRADOR
const ADMIN = {
    usuario: "admin",
    password: "2026"
};

// OBTENER USUARIOS GUARDADOS
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// GUARDAR USUARIOS
function guardarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// MOSTRAR PANELES
function cerrarPaneles() {
    document.getElementById("login").hidden = true;
    document.getElementById("registro").hidden = true;
    document.getElementById("panelAdmin").hidden = true;
    document.getElementById("panelUsuario").hidden = true;
}

function mostrarLogin() {
    cerrarPaneles();
    document.getElementById("login").hidden = false;
    document.getElementById("login").scrollIntoView({
        behavior: "smooth"
    });
}

function comprarTarjeta() {
    cerrarPaneles();
    document.getElementById("registro").hidden = false;
    document.getElementById("registro").scrollIntoView({
        behavior: "smooth"
    });
}

// REGISTRAR USUARIO
document.getElementById("formRegistro").addEventListener("submit",
    function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        const usuarios = obtenerUsuarios();

        const existe = usuarios.some(
            usuario => usuario.correo.toLowerCase() === correo.toLowerCase()
        );

        if (existe) {
            document.getElementById("mensajeRegistro").textContent =
                "Este correo ya está registrado.";
            return;
        }

        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            tarjeta: "MASC-" + Date.now(),
            saldo: 0
        };

        usuarios.push(nuevoUsuario);
        guardarUsuarios(usuarios);

        document.getElementById("mensajeRegistro").textContent =
        "¡Tarjeta MASC TRANSPORT creada exitosamente! " +
        "Número de tarjeta: " + nuevoUsuario.tarjeta +
        " | Saldo inicial: Q0.00";

        event.target.reset();
    }
);

// INICIAR SESION
document.getElementById("formLogin").addEventListener("submit",
    function(event) {
        event.preventDefault();

        const usuario = document.getElementById("usuarioLogin").value;
        const password = document.getElementById("passwordLogin").value;

        // ACCESO ADMINISTRADOR
        if (usuario === ADMIN.usuario &&
            password === ADMIN.password) {

            cerrarPaneles();
            document.getElementById("panelAdmin").hidden = false;
            return;
        }

        // ACCESO USUARIO
        const usuarios = obtenerUsuarios();

        const encontrado = usuarios.find(
            persona => persona.correo.toLowerCase() === usuario.toLowerCase()
        );

        if (encontrado && password === encontrado.tarjeta) {
            cerrarPaneles();

            localStorage.setItem("usuarioActivo", encontrado.id);

            document.getElementById("panelUsuario").hidden = false;

            actualizarDatosUsuario();
            mostrarHistorialUsuario();
            llenarSelectorRutas();

            return;
        }

        document.getElementById("mensajeLogin").textContent =
            "Usuario o contraseña incorrectos.";
    }
);

// CONSULTAR USUARIOS (ADMINISTRADOR)
function mostrarUsuarios() {
    const usuarios = obtenerUsuarios();

    const contenedor = document.getElementById("listaUsuarios");

    if (usuarios.length === 0) {
        contenedor.textContent = "Todavía no hay usuarios registrados.";
        return;
    }

    contenedor.innerHTML = "<h3>Usuarios registrados</h3>";

    usuarios.forEach(usuario => {
        const elemento = document.createElement("p");

        elemento.textContent =
            usuario.nombre + " | " +
            usuario.correo + " | Tarjeta: " +
            usuario.tarjeta + " | Saldo: Q" +
            Number(usuario.saldo).toFixed(2);

        contenedor.appendChild(elemento);
    });
}

// CERRAR SESION
function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    cerrarPaneles();
    alert("Sesión cerrada correctamente.");
}


// MOSTRAR TARJETA DIGITAL DEL USUARIO
function actualizarDatosUsuario() {

    const idActivo = localStorage.getItem("usuarioActivo");
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        persona => persona.id == idActivo
    );

    if (!usuario) {
        return;
    }

    document.getElementById("tarjetaDigital").innerHTML = `
        <div class="tarjeta-digital">

            <div class="encabezado-tarjeta">
                <div>
                    <h2>MASC TRANSPORT</h2>
                    <p>Tarjeta de transporte urbano</p>
                </div>

                <span>MT</span>
            </div>

            <div class="chip-tarjeta">▦</div>

            <p class="etiqueta-tarjeta">TITULAR</p>
            <h3>${usuario.nombre}</h3>

            <p class="etiqueta-tarjeta">NÚMERO DE TARJETA</p>
            <h3>${usuario.tarjeta}</h3>

            <div class="saldo-tarjeta">
                <div>
                    <p>SALDO DISPONIBLE</p>
                    <h2>Q${Number(usuario.saldo).toFixed(2)}</h2>
                </div>

                <span>ACTIVA</span>
            </div>

        </div>
    `;
}


// RECARGAR SALDO
function recargarSaldo() {

    const monto = Number(
        document.getElementById("montoRecarga").value
    );

    if (!Number.isFinite(monto) || monto <= 0) {
        alert("Ingrese un monto válido.");
        return;
    }

    const idActivo = localStorage.getItem("usuarioActivo");
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        persona => persona.id == idActivo
    );

    if (!usuario) {
        return;
    }

    usuario.saldo = Number(usuario.saldo) + monto;

    guardarUsuarios(usuarios);

    document.getElementById("montoRecarga").value = "";

    document.getElementById("mensajeTarjeta").textContent =
        "¡Recarga exitosa! Se agregaron Q" +
        monto.toFixed(2);

    actualizarDatosUsuario();
}



// DESCONTAR TARIFA Y REGISTRAR VIAJE

function abordarBus() {

    const idActivo = localStorage.getItem("usuarioActivo");
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        persona => String(persona.id) === String(idActivo)
    );

    const selector = document.getElementById("rutaSeleccionada");
    const indiceRuta = selector.value;

    if (indiceRuta === "") {
        alert("Por favor, selecciona una ruta.");
        return;
    }

    const ruta = rutas[Number(indiceRuta)];

    if (!ruta) {
        alert("No se encontró la ruta seleccionada.");
        return;
    }

    if (!usuario) {
        alert("No se encontró el usuario.");
        return;
    }

    if (Number(usuario.saldo) < 5) {
        document.getElementById("mensajeTarjeta").textContent =
            "Saldo insuficiente. Por favor, recargue su tarjeta.";
        return;
    }

    usuario.saldo = Number(usuario.saldo) - 5;

    if (!usuario.historial) {
        usuario.historial = [];
    }

    const viaje = {
        fecha: new Date().toLocaleString("es-GT"),
        tarjeta: usuario.tarjeta,
        ruta: ruta.nombre,
        origen: ruta.origen,
        destino: ruta.destino,
        tarifa: 5,
        saldoRestante: usuario.saldo
    };

    usuario.historial.push(viaje);

    guardarUsuarios(usuarios);

    document.getElementById("mensajeTarjeta").textContent =
        "¡Abordaje registrado en " + ruta.nombre +
        "! Se descontaron Q5.00.";

    actualizarDatosUsuario();
    mostrarHistorialUsuario();
}



// MOSTRAR HISTORIAL DEL USUARIO
function mostrarHistorialUsuario() {

    const idActivo = localStorage.getItem("usuarioActivo");
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        persona => persona.id == idActivo
    );

    const contenedor = document.getElementById("listaHistorial");

    if (!usuario || !contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (!usuario.historial || usuario.historial.length === 0) {
        contenedor.textContent = "Aún no tienes viajes registrados.";
        return;
    }

    usuario.historial.slice().reverse().forEach(viaje => {

        const elemento = document.createElement("p");

        elemento.textContent =
            "Fecha: " + viaje.fecha +
            " | Ruta: " + (viaje.ruta || "No especificada") +
            " | Tarifa: Q" + Number(viaje.tarifa).toFixed(2) +
            " | Saldo restante: Q" +
            Number(viaje.saldoRestante).toFixed(2);

        contenedor.appendChild(elemento);
    });
}


// MOSTRAR HISTORIAL  ADMINISTRADOR
function mostrarHistorialAdmin() {

    const usuarios = obtenerUsuarios();
    const contenedor = document.getElementById("historialAdmin");

    contenedor.innerHTML = "";

    let hayViajes = false;

    usuarios.forEach(usuario => {

        if (usuario.historial && usuario.historial.length > 0) {

            usuario.historial.forEach(viaje => {

                hayViajes = true;

                const elemento = document.createElement("p");

                elemento.textContent =
                    "Usuario: " + usuario.nombre +
                    " | Tarjeta: " + usuario.tarjeta +
                    " | Ruta: " + (viaje.ruta || "No especificada") +
                    " | Fecha: " + viaje.fecha +
                    " | Tarifa: Q" + Number(viaje.tarifa).toFixed(2) +
                    " | Saldo: Q" +
                    Number(viaje.saldoRestante).toFixed(2);

                contenedor.appendChild(elemento);
            });
        }
    });

    if (!hayViajes) {
        contenedor.textContent = "Todavía no hay viajes registrados.";
    }
}
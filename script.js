// =======================================================
// script.js - MOTOR DEL JUEGO DE SUBASTA
// =======================================================

// --- 1. DATOS Y ESTADO DEL JUEGO -----------------------

// A. PARTICIPANTES Y ESTADO INICIAL
const PARTICIPANTES = {
    player: { id: 'player', nombre: 'Jugador', presupuesto: 100000000, equipo: [], salto_usado: false },
    ia1: { id: 'ia1', nombre: 'IA Conservadora', presupuesto: 100000000, equipo: [], perfil: 'conservadora', salto_usado: false },
    ia2: { id: 'ia2', nombre: 'IA Agresiva', presupuesto: 100000000, equipo: [], perfil: 'agresiva', salto_usado: false }
};

// B. ESTADO DE LA SUBASTA
let subastaActiva = {
    jugador: null,           
    ofertaActual: 0,         
    postorActualId: null,    
    jugadoresParaSubastar: [], // Los 4-5 jugadores sorteados para el turno
    rondaDePujas: 0,         // Contador para limitar las pujas antes de terminar la subasta
    topePujaIA1: 0,          // Tope calculado para IA1 en esta subasta
    topePujaIA2: 0           // Tope calculado para IA2 en esta subasta
};

// C. LISTA MAESTRA DE JUGADORES (Añade más para que el juego sea divertido)
const TODOS_LOS_JUGADORES = [
    // Leyendas (Media 90+)
    { id: 1, nombre: "Messi", media: 98, precio_sugerido: 120000000, puesto: 'DEL', vendido: false },
    { id: 2, nombre: "Pelé", media: 99, precio_sugerido: 150000000, puesto: 'DEL', vendido: false },
    // Buenos (Media 80-90)
    { id: 3, nombre: "De Bruyne", media: 89, precio_sugerido: 95000000, puesto: 'MED', vendido: false },
    { id: 4, nombre: "Van Dijk", media: 88, precio_sugerido: 90000000, puesto: 'DEF', vendido: false },
    // Promedio (Media 70-80)
    { id: 5, nombre: "Fernández", media: 78, precio_sugerido: 65000000, puesto: 'MED', vendido: false },
    { id: 6, nombre: "Alaba", media: 75, precio_sugerido: 50000000, puesto: 'DEL', vendido: false },
    // Malos (Media 45-70)
    { id: 7, nombre: "Malo IV", media: 55, precio_sugerido: 30000000, puesto: 'DEF', vendido: false },
    { id: 8, nombre: "Guardameta", media: 65, precio_sugerido: 40000000, puesto: 'POR', vendido: false },
    { id: 9, nombre: "Reserva", media: 48, precio_sugerido: 25000000, puesto: 'MED', vendido: false },
    { id: 10, nombre: "Central B", media: 62, precio_sugerido: 35000000, puesto: 'DEF', vendido: false },
];

// --- 2. FUNCIONES DE UTILIDAD Y LÓGICA DE LA IA -----------------------

/**
 * Función que formatea números a un formato legible (e.g., 100,000,000 -> 100M)
 * @param {number} num 
 */
function formatoDinero(num) {
    return '$' + (num / 1000000).toFixed(0).toLocaleString() + 'M';
}

/**
 * Calcula el 'TOPE' (máximo que la IA está dispuesta a pagar)
 * basándose en su perfil y el precio sugerido, inyectando incertidumbre.
 */
function calcularTopePuja(perfil, precioSugerido) {
    let factor;
    // La IA solo conoce el precio sugerido.
    if (perfil === 'conservadora') {
        // Rango de 60% a 95% del precio sugerido.
        factor = Math.random() * (0.95 - 0.60) + 0.60;
    } else { // 'agresiva'
        // Rango de 90% a 120% del precio sugerido.
        factor = Math.random() * (1.20 - 0.90) + 0.90;
    }
    
    // Redondeamos al millón más cercano.
    const topeBruto = precioSugerido * factor;
    return Math.floor(topeBruto / 1000000) * 1000000; 
}

/**
 * Lógica principal de las IAs: decide si pujar o usar el salto.
 * @param {string} iaId - ID de la IA ('ia1' o 'ia2')
 */
function gestionarTurnoIA(iaId) {
    const ia = PARTICIPANTES[iaId];
    const precioSugerido = subastaActiva.jugador.precio_sugerido;
    let topePuja;

    // Asignar el TOPE ya calculado al iniciar la subasta
    if (iaId === 'ia1') {
        topePuja = subastaActiva.topePujaIA1;
    } else {
        topePuja = subastaActiva.topePujaIA2;
    }

    // 1. EVALUAR EL SALTO
    if (!ia.salto_usado && subastaActiva.ofertaActual === 0) {
        // La IA tiene una probabilidad del 30% de saltar si el precio sugerido es muy bajo
        // (Simula que no le interesa si la inversión inicial es baja, esperando algo mejor)
        if (precioSugerido < 50000000 && Math.random() < 0.3) {
            console.log(`${ia.nombre} ha decidido usar su SALTO en este jugador.`);
            ia.salto_usado = true;
            mostrarMensaje(`${ia.nombre} usa su Salto y pasa.`);
            // Pasar la subasta al siguiente jugador
            iniciarSiguienteSubasta(); 
            return;
        }
    }

    // 2. DECISIÓN DE PUJA
    if (subastaActiva.ofertaActual >= topePuja) {
        // La oferta actual ya superó el máximo que la IA estaba dispuesta a pagar
        console.log(`${ia.nombre} pasa. Oferta (${formatoDinero(subastaActiva.ofertaActual)}) supera su TOPE (${formatoDinero(topePuja)}).`);
        mostrarMensaje(`${ia.nombre} pasa.`);
        return; // Pasa el turno
    }

    // 3. CALCULAR NUEVA PUJA
    // Puja con un incremento aleatorio (5M - 15M)
    const incremento = Math.floor((Math.random() * 10 + 5)) * 1000000;
    let nuevaOferta = subastaActiva.ofertaActual === 0 ? precioSugerido * 0.5 : subastaActiva.ofertaActual + incremento; // Oferta inicial 50% del sugerido o incrementa

    // Asegurarse de que la nueva oferta no exceda el TOPE ni el presupuesto
    nuevaOferta = Math.min(nuevaOferta, topePuja, ia.presupuesto);

    // Si la nueva oferta es mayor que la actual, puja
    if (nuevaOferta > subastaActiva.ofertaActual) {
        pujar(nuevaOferta, iaId);
    } else {
        // Si no puede mejorar la oferta, pasa
        console.log(`${ia.nombre} pasa. No puede superar la oferta actual estratégicamente.`);
        mostrarMensaje(`${ia.nombre} pasa.`);
    }
}


/**
 * Procesa la puja de cualquier participante (jugador o IA).
 * @param {number} monto - El monto de la puja
 * @param {string} postorId - ID del participante que puja
 */
function pujar(monto, postorId = 'player') {
    const postor = PARTICIPANTES[postorId];
    
    // 1. VALIDACIONES
    if (monto <= subastaActiva.ofertaActual) {
        if (postorId === 'player') mostrarMensaje("Tu oferta debe ser mayor a la actual.");
        return;
    }
    if (monto > postor.presupuesto) {
        if (postorId === 'player') mostrarMensaje("No tienes suficiente presupuesto.");
        return;
    }

    // 2. ACTUALIZACIÓN DEL ESTADO
    subastaActiva.ofertaActual = monto;
    subastaActiva.postorActualId = postorId;
    subastaActiva.rondaDePujas++;

    actualizarInterfaz();
    mostrarMensaje(`${postor.nombre} puja con ${formatoDinero(monto)}.`);

    // 3. CONTINUAR CON LOS TURNOS DE LA IA (Si el jugador pujó)
    if (postorId === 'player') {
        setTimeout(() => gestionarTurnoIA('ia1'), 1500);
        setTimeout(() => gestionarTurnoIA('ia2'), 3000);
    }
    
    // 4. VERIFICAR FIN DE SUBASTA
    // Si nadie puja en una ronda completa, termina la subasta.
    // Aquí usamos el contador de rondas: si un postor (humano o IA) puja, reseteamos un temporizador
    // Para simplificar: terminaremos la subasta si no hay más pujas después de un retraso.
    // La lógica de fin de subasta se complica sin un loop de turnos explícito,
    // así que la activaremos si el postor actual es el mismo después de 4 segundos.
    setTimeout(verificarFinSubasta, 4000);
}

function verificarFinSubasta() {
    // Si el postor actual NO ES el jugador humano, y han pasado 4 segundos, y las IAs no han superado, termina.
    if (subastaActiva.postorActualId !== 'player' || subastaActiva.rondaDePujas >= 5) {
        finalizarSubasta();
    }
}


/**
 * Transfiere el jugador al equipo del ganador y pasa al siguiente.
 */
function finalizarSubasta() {
    if (!subastaActiva.postorActualId) {
        // Nadie pujó. Si se saltó el jugador, pasar al siguiente.
        mostrarMensaje("Nadie pujó. Jugador no vendido.");
    } else {
        const ganador = PARTICIPANTES[subastaActiva.postorActualId];
        const jugador = subastaActiva.jugador;
        const precio = subastaActiva.ofertaActual;

        // 1. Actualizar estado
        ganador.presupuesto -= precio;
        ganador.equipo.push({ nombre: jugador.nombre, precio: precio, media: jugador.media, puesto: jugador.puesto });
        TODOS_LOS_JUGADORES.find(j => j.id === jugador.id).vendido = true;

        // 2. Mostrar resultados
        mostrarMensaje(`¡${ganador.nombre} gana a ${jugador.nombre} (Media: ${jugador.media}) por ${formatoDinero(precio)}!`);
        console.log(`${ganador.nombre} ahora tiene ${formatoDinero(ganador.presupuesto)}.`);
    }
    
    // 3. Iniciar la siguiente subasta después de un retraso
    setTimeout(iniciarSiguienteSubasta, 5000);
}


/**
 * Sortear y preparar el siguiente jugador para la subasta.
 */
function iniciarSiguienteSubasta() {
    // Si la lista de subastas para este turno está vacía, sortear una nueva
    if (subastaActiva.jugadoresParaSubastar.length === 0) {
        const noVendidos = TODOS_LOS_JUGADORES.filter(j => !j.vendido);
        if (noVendidos.length === 0) {
            mostrarMensaje("¡Juego Terminado! Todos los jugadores vendidos.");
            // Aquí puedes añadir la lógica de mostrar el equipo final y puntajes
            return;
        }

        // Sortear hasta 5 jugadores (o el resto si quedan menos)
        const numASortear = Math.min(5, noVendidos.length);
        const jugadoresDisponibles = [...noVendidos];
        
        for (let i = 0; i < numASortear; i++) {
            const indice = Math.floor(Math.random() * jugadoresDisponibles.length);
            subastaActiva.jugadoresParaSubastar.push(jugadoresDisponibles[indice]);
            jugadoresDisponibles.splice(indice, 1); // Remover para no repetir
        }

        mostrarMensaje(`--- INICIO DE TURNO --- Se sortearon ${subastaActiva.jugadoresParaSubastar.length} jugadores.`);
    }

    // 1. Configurar la subasta activa
    const jugadorSubastar = subastaActiva.jugadoresParaSubastar.shift();
    subastaActiva.jugador = jugadorSubastar;
    subastaActiva.ofertaActual = 0;
    subastaActiva.postorActualId = null;
    subastaActiva.rondaDePujas = 0;

    // 2. Calcular los TOPEs de las IAs (Esto da el factor de riesgo para esta subasta)
    subastaActiva.topePujaIA1 = calcularTopePuja('conservadora', jugadorSubastar.precio_sugerido);
    subastaActiva.topePujaIA2 = calcularTopePuja('agresiva', jugadorSubastar.precio_sugerido);

    // 3. Mostrar Subasta
    console.log(`--- NUEVA SUBASTA: ${jugadorSubastar.nombre} (Media OCULTA: ${jugadorSubastar.media}) ---`);
    console.log(`IA1 TOPE: ${formatoDinero(subastaActiva.topePujaIA1)} | IA2 TOPE: ${formatoDinero(subastaActiva.topePujaIA2)}`);
    mostrarMensaje(`¡Subasta por **${jugadorSubastar.nombre} (${jugadorSubastar.puesto})**! Precio Sugerido: ${formatoDinero(jugadorSubastar.precio_sugerido)}`);
    
    actualizarInterfaz();
}


// --- 4. GESTIÓN DE LA INTERFAZ (Se asume un HTML simple) -----------------------

function actualizarInterfaz() {
    const container = document.getElementById('game-container');
    
    // Crear la estructura si no existe (simplificado)
    if (!document.getElementById('info-subasta')) {
        container.innerHTML = `
            <div id="info-subasta"></div>
            <div id="info-participantes"></div>
            <div id="controles-player">
                <input type="number" id="input-puja" placeholder="Tu Puja (en millones)">
                <button onclick="pujarManual()">Pujar</button>
            </div>
            <div id="mensajes"></div>
        `;
    }

    // Actualizar la información de la subasta
    const jugador = subastaActiva.jugador;
    document.getElementById('info-subasta').innerHTML = `
        <h2>En Subasta: ${jugador ? jugador.nombre + ' (' + jugador.puesto + ')' : 'Esperando...'}</h2>
        <p>Precio Sugerido: <b>${jugador ? formatoDinero(jugador.precio_sugerido) : 'N/A'}</b></p>
        <p>Oferta Actual: <b style="color: red;">${formatoDinero(subastaActiva.ofertaActual)}</b> (Postor: ${subastaActiva.postorActualId ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie'})</p>
    `;

    // Actualizar info de participantes
    document.getElementById('info-participantes').innerHTML = `
        <h3>Presupuestos y Equipos</h3>
        <p>${PARTICIPANTES.player.nombre}: ${formatoDinero(PARTICIPANTES.player.presupuesto)} | Equipo: ${PARTICIPANTES.player.equipo.length} jugadores (Salto usado: ${PARTICIPANTES.player.salto_usado ? 'SI' : 'NO'})</p>
        <p>${PARTICIPANTES.ia1.nombre}: ${formatoDinero(PARTICIPANTES.ia1.presupuesto)} | Equipo: ${PARTICIPANTES.ia1.equipo.length} jugadores (Salto usado: ${PARTICIPANTES.ia1.salto_usado ? 'SI' : 'NO'})</p>
        <p>${PARTICIPANTES.ia2.nombre}: ${formatoDinero(PARTICIPANTES.ia2.presupuesto)} | Equipo: ${PARTICIPANTES.ia2.equipo.length} jugadores (Salto usado: ${PARTICIPANTES.ia2.salto_usado ? 'SI' : 'NO'})</p>
    `;
    
    // Si no hay jugador en subasta, deshabilitar controles
    const input = document.getElementById('input-puja');
    const boton = document.querySelector('#controles-player button');
    if (!subastaActiva.jugador) {
        input.disabled = true;
        boton.disabled = true;
    } else {
        input.disabled = false;
        boton.disabled = false;
    }
}

function pujarManual() {
    const inputM = document.getElementById('input-puja');
    // Convertir de millones (M) a número completo
    const monto = parseFloat(inputM.value) * 1000000; 
    if (monto) {
        pujar(monto, 'player');
    } else {
        mostrarMensaje("Introduce un monto válido en millones.");
    }
}

function mostrarMensaje(msg) {
    const log = document.getElementById('mensajes');
    log.innerHTML += `<p>${msg}</p>`;
    log.scrollTop = log.scrollHeight;
}

// --- 5. INICIALIZACIÓN -----------------------
document.addEventListener('DOMContentLoaded', () => {
    iniciarSiguienteSubasta(); // Iniciar el primer sorteo
});

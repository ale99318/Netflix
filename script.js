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
    jugadoresParaSubastar: [], 
    topePujaIA1: 0,          
    topePujaIA2: 0,
    ultimoPostorIA1: false,  // Flag para asegurar que IA2 no puje inmediatamente después de IA1, y viceversa
    ultimoPostorIA2: false
};

// C. LISTA MAESTRA DE JUGADORES
const TODOS_LOS_JUGADORES = [
    // Leyendas (Media 90+)
    { id: 1, nombre: "Messi", media: 98, precio_sugerido: 120000000, puesto: 'DEL', vendido: false },
    { id: 2, nombre: "Pelé", media: 99, precio_sugerido: 150000000, puesto: 'DEL', vendido: false },
    // Buenos (Media 80-90)
    { id: 3, nombre: "De Bruyne", media: 89, precio_sugerido: 95000000, puesto: 'MED', vendido: false },
    { id: 4, nombre: "Van Dijk", media: 88, precio_sugerido: 90000000, puesto: 'DEF', vendido: false },
    { id: 5, nombre: "Casillas", media: 90, precio_sugerido: 80000000, puesto: 'POR', vendido: false },
    // Promedio (Media 70-80)
    { id: 6, nombre: "Fernández", media: 78, precio_sugerido: 65000000, puesto: 'MED', vendido: false },
    { id: 7, nombre: "Alaba", media: 75, precio_sugerido: 50000000, puesto: 'DEL', vendido: false },
    // Malos (Media 45-70)
    { id: 8, nombre: "Malo IV", media: 55, precio_sugerido: 30000000, puesto: 'DEF', vendido: false },
    { id: 9, nombre: "Guardameta", media: 65, precio_sugerido: 40000000, puesto: 'POR', vendido: false },
    { id: 10, nombre: "Reserva", media: 48, precio_sugerido: 25000000, puesto: 'MED', vendido: false },
];

// --- 2. FUNCIONES DE UTILIDAD Y LÓGICA DE LA IA -----------------------

/**
 * Formatea números a un formato legible ($100M).
 */
function formatoDinero(num) {
    if (num < 0) return '$-' + (Math.abs(num) / 1000000).toFixed(1) + 'M';
    return '$' + (num / 1000000).toFixed(1) + 'M';
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
 */
function gestionarTurnoIA(iaId) {
    // Si la subasta ha finalizado, no hacer nada.
    if (!subastaActiva.jugador || subastaActiva.postorActualId === iaId) return;

    const ia = PARTICIPANTES[iaId];
    const precioSugerido = subastaActiva.jugador.precio_sugerido;
    const topePuja = iaId === 'ia1' ? subastaActiva.topePujaIA1 : subastaActiva.topePujaIA2;

    // 1. EVALUAR EL SALTO (Solo al inicio de la subasta y si la IA no ha pujado)
    if (!ia.salto_usado && subastaActiva.ofertaActual === 0) {
        // La IA tiene una probabilidad del 40% de saltar si su TOPE es menos del 70% del sugerido.
        if (topePuja < precioSugerido * 0.7 && Math.random() < 0.4) {
            console.log(`${ia.nombre} ha decidido usar su SALTO.`);
            ia.salto_usado = true;
            mostrarMensaje(`${ia.nombre} usa su Salto y pasa.`, 'ia');
            // Pasar la subasta al siguiente jugador si la IA1 salta
            if (iaId === 'ia1') {
                setTimeout(() => gestionarTurnoIA('ia2'), 1500); // Dar turno a IA2
            } else {
                // Si IA2 salta y no hay más ofertas, la subasta termina (nadie la quería)
                finalizarSubasta();
            }
            return; 
        }
    }

    // 2. DECISIÓN DE PUJA
    if (subastaActiva.ofertaActual >= topePuja) {
        // La oferta actual ya superó el máximo que la IA estaba dispuesta a pagar
        mostrarMensaje(`${ia.nombre} pasa. Oferta (${formatoDinero(subastaActiva.ofertaActual)}) supera su TOPE.`, 'ia');
        return; 
    }

    // 3. CALCULAR NUEVA PUJA
    // Puja con un incremento aleatorio (5M - 15M)
    const incremento = Math.floor((Math.random() * 10 + 5)) * 1000000;
    
    // La primera puja es el 50% del sugerido o la oferta actual + incremento
    let nuevaOferta = subastaActiva.ofertaActual === 0 ? precioSugerido * 0.5 : subastaActiva.ofertaActual + incremento; 

    // Asegurarse de que la nueva oferta no exceda el TOPE ni el presupuesto
    nuevaOferta = Math.min(nuevaOferta, topePuja, ia.presupuesto);

    // Redondear la puja al millón más cercano.
    nuevaOferta = Math.floor(nuevaOferta / 1000000) * 1000000;

    // Si la nueva oferta es mayor que la actual, puja
    if (nuevaOferta > subastaActiva.ofertaActual) {
        pujar(nuevaOferta, iaId);
    } else {
        // Si no puede mejorar la oferta estratégicamente, pasa
        mostrarMensaje(`${ia.nombre} pasa.`, 'ia');
    }
}


/**
 * Procesa la puja de cualquier participante (jugador o IA).
 */
function pujar(monto, postorId = 'player') {
    const postor = PARTICIPANTES[postorId];
    
    // 1. VALIDACIONES
    if (monto <= subastaActiva.ofertaActual) {
        if (postorId === 'player') mostrarMensaje("Tu oferta debe ser mayor a la actual.", 'error');
        return;
    }
    if (monto > postor.presupuesto) {
        if (postorId === 'player') mostrarMensaje("No tienes suficiente presupuesto.", 'error');
        return;
    }

    // 2. ACTUALIZACIÓN DEL ESTADO
    subastaActiva.ofertaActual = monto;
    subastaActiva.postorActualId = postorId;

    // Resetear flags de IA
    subastaActiva.ultimoPostorIA1 = (postorId === 'ia1');
    subastaActiva.ultimoPostorIA2 = (postorId === 'ia2');

    actualizarInterfaz();
    mostrarMensaje(`${postor.nombre} puja con **${formatoDinero(monto)}**.`);

    // 3. GESTIONAR TURNOS DE IA (Si el jugador humano pujó)
    if (postorId === 'player') {
        // Turno IA1
        setTimeout(() => gestionarTurnoIA('ia1'), 1500); 
        // Turno IA2
        setTimeout(() => gestionarTurnoIA('ia2'), 3000); 
    }
    
    // 4. VERIFICAR FIN DE SUBASTA
    // Si nadie puja en el ciclo completo (Player -> IA1 -> IA2), la subasta termina.
    // Usamos un temporizador para simular un tiempo de gracia.
    clearTimeout(subastaActiva.timerFinSubasta);
    subastaActiva.timerFinSubasta = setTimeout(finalizarSubasta, 4500);
}

/**
 * Transfiere el jugador al equipo del ganador y pasa al siguiente.
 */
function finalizarSubasta() {
    // Si ya terminó o no hay jugador activo, salir
    if (!subastaActiva.jugador) return; 

    if (!subastaActiva.postorActualId) {
        mostrarMensaje(`Nadie ha pujado por ${subastaActiva.jugador.nombre}. No vendido.`, 'info');
        // Lo removemos de la lista de subasta, pero no lo marcamos como vendido
    } else {
        const ganador = PARTICIPANTES[subastaActiva.postorActualId];
        const jugador = subastaActiva.jugador;
        const precio = subastaActiva.ofertaActual;

        // 1. Actualizar estado
        ganador.presupuesto -= precio;
        ganador.equipo.push({ nombre: jugador.nombre, precio: precio, media: jugador.media, puesto: jugador.puesto });
        TODOS_LOS_JUGADORES.find(j => j.id === jugador.id).vendido = true;

        // 2. Mostrar resultados
        mostrarMensaje(`🎉 ¡${ganador.nombre} gana a **${jugador.nombre}** (Media OCULTA: ${jugador.media}) por **${formatoDinero(precio)}**!`, 'ganador');
    }
    
    // 3. Iniciar la siguiente subasta después de un retraso
    subastaActiva.jugador = null; // Marcar como terminada
    actualizarInterfaz();
    setTimeout(iniciarSiguienteSubasta, 6000);
}


/**
 * Sortear y preparar el siguiente jugador para la subasta.
 */
function iniciarSiguienteSubasta() {
    // Si la lista de subastas para este turno está vacía, sortear una nueva
    if (subastaActiva.jugadoresParaSubastar.length === 0) {
        const noVendidos = TODOS_LOS_JUGADORES.filter(j => !j.vendido);
        if (noVendidos.length === 0) {
            mostrarMensaje("🏆 ¡Juego Terminado! Todos los jugadores vendidos. Revisa tus equipos.", 'ganador');
            return;
        }

        // Sortear hasta 4 jugadores para el turno
        const numASortear = Math.min(4, noVendidos.length);
        const jugadoresDisponibles = [...noVendidos];
        
        for (let i = 0; i < numASortear; i++) {
            const indice = Math.floor(Math.random() * jugadoresDisponibles.length);
            subastaActiva.jugadoresParaSubastar.push(jugadoresDisponibles[indice]);
            jugadoresDisponibles.splice(indice, 1); // Remover para no repetir
        }
        mostrarMensaje(`--- INICIO DE TURNO --- Se sortearon ${subastaActiva.jugadoresParaSubastar.length} jugadores.`, 'info');
    }

    // 1. Configurar la subasta activa
    const jugadorSubastar = subastaActiva.jugadoresParaSubastar.shift();
    subastaActiva.jugador = jugadorSubastar;
    subastaActiva.ofertaActual = jugadorSubastar.precio_sugerido * 0.1; // Puja inicial automática del 10% del sugerido
    subastaActiva.postorActualId = null;
    
    // 2. Calcular los TOPEs de las IAs (Esto da el factor de riesgo para esta subasta)
    subastaActiva.topePujaIA1 = calcularTopePuja('conservadora', jugadorSubastar.precio_sugerido);
    subastaActiva.topePujaIA2 = calcularTopePuja('agresiva', jugadorSubastar.precio_sugerido);
    
    // Resetear flags de IA
    subastaActiva.ultimoPostorIA1 = false;
    subastaActiva.ultimoPostorIA2 = false;

    // 3. Mostrar Subasta
    mostrarMensaje(`⚽ ¡Subasta por **${jugadorSubastar.nombre} (${jugadorSubastar.puesto})**!`, 'info');
    mostrarMensaje(`Puja inicial automática: ${formatoDinero(subastaActiva.ofertaActual)}.`);
    
    actualizarInterfaz();
    
    // 4. Iniciar la secuencia de puja de las IAs después de un pequeño retraso (simula el inicio)
    setTimeout(() => {
        gestionarTurnoIA('ia1');
        gestionarTurnoIA('ia2');
        
        // Si nadie ha pujado después de las IAs, el turno es del jugador humano
        if (!subastaActiva.postorActualId) {
             mostrarMensaje("Tu turno para pujar.", 'player');
        }
    }, 2000);
}


// --- 4. GESTIÓN DE LA INTERFAZ -----------------------

function actualizarInterfaz() {
    const container = document.getElementById('game-container');
    
    // Crear la estructura si no existe (solo se hace una vez)
    if (!document.getElementById('info-subasta')) {
        container.innerHTML = `
            <div id="info-participantes" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 20px;"></div>
            <div id="info-subasta" style="margin-bottom: 20px;"></div>
            <div id="controles-player">
                <h3>Tu Oferta (en millones de $)</h3>
                <input type="number" id="input-puja" placeholder="Ej: 50" style="padding: 8px; width: 100px;">
                <button onclick="pujarManual()" id="boton-puja">Pujar</button>
                <button onclick="usarSalto()" id="boton-salto">Saltar Jugador (1 vez)</button>
            </div>
            <div id="mensajes" style="margin-top: 20px;"></div>
        `;
    }

    const jugador = subastaActiva.jugador;
    const postorNombre = subastaActiva.postorActualId ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie';

    // Actualizar la información de la subasta
    document.getElementById('info-subasta').innerHTML = `
        <h2>En Subasta: ${jugador ? jugador.nombre + ' (' + jugador.puesto + ')' : 'Esperando Siguiente...'}</h2>
        <p>Precio Sugerido: <b>${jugador ? formatoDinero(jugador.precio_sugerido) : 'N/A'}</b></p>
        <p>Oferta Actual: <b style="color: red; font-size: 1.2em;">${formatoDinero(subastaActiva.ofertaActual)}</b> (Postor: ${postorNombre})</p>
    `;

    // Actualizar info de participantes
    document.getElementById('info-participantes').innerHTML = `
        <h3>Presupuestos y Equipos</h3>
        <p><b>${PARTICIPANTES.player.nombre}</b>: ${formatoDinero(PARTICIPANTES.player.presupuesto)} | Equipo: ${PARTICIPANTES.player.equipo.length} jugadores (Salto usado: ${PARTICIPANTES.player.salto_usado ? 'SI' : 'NO'})</p>
        <p>${PARTICIPANTES.ia1.nombre}: ${formatoDinero(PARTICIPANTES.ia1.presupuesto)} | Equipo: ${PARTICIPANTES.ia1.equipo.length} jugadores (Salto usado: ${PARTICIPANTES.ia1.salto_usado ? 'SI' : 'NO'})</p>
        <p>${PARTICIPANTES.ia2.nombre}: ${formatoDinero(PARTICIPANTES.ia2.presupuesto)} | Equipo: ${PARTICIPANTES.ia2.equipo.length} jugadores (Salto usado: ${PARTICIPANTES.ia2.salto_usado ? 'SI' : 'NO'})</p>
    `;
    
    // Controlar botones
    const input = document.getElementById('input-puja');
    const botonPuja = document.getElementById('boton-puja');
    const botonSalto = document.getElementById('boton-salto');

    if (!subastaActiva.jugador) {
        input.disabled = true;
        botonPuja.disabled = true;
        botonSalto.disabled = true;
    } else {
        input.disabled = false;
        botonPuja.disabled = false;
        botonSalto.disabled = PARTICIPANTES.player.salto_usado || subastaActiva.ofertaActual > 0;
    }
}

function pujarManual() {
    const inputM = document.getElementById('input-puja');
    // Multiplicar por 1,000,000 ya que el jugador ingresa el valor en millones (Ej: 50 -> 50,000,000)
    const monto = parseFloat(inputM.value) * 1000000; 
    
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje("Introduce un monto válido (en millones).", 'error');
        return;
    }
    
    pujar(monto, 'player');
    inputM.value = ''; // Limpiar el input después de pujar
}

function usarSalto() {
    if (PARTICIPANTES.player.salto_usado) {
        mostrarMensaje("Ya usaste tu único 'Salto' en un turno anterior.", 'error');
        return;
    }
    if (subastaActiva.ofertaActual > 0) {
        mostrarMensaje("No puedes 'Saltar' si ya ha habido una puja.", 'error');
        return;
    }
    
    PARTICIPANTES.player.salto_usado = true;
    mostrarMensaje("Has usado tu Salto. Pasamos al siguiente jugador.", 'player');
    
    // Terminar la subasta actual sin ganador e iniciar la siguiente
    subastaActiva.jugador = null;
    actualizarInterfaz();
    setTimeout(iniciarSiguienteSubasta, 3000);
}


function mostrarMensaje(msg, tipo = '') {
    const log = document.getElementById('mensajes');
    
    let color = 'black';
    if (tipo === 'ia') color = 'darkred';
    if (tipo === 'player') color = 'blue';
    if (tipo === 'error') color = 'red';
    if (tipo === 'ganador') color = 'green';
    if (tipo === 'info') color = 'orange';

    log.innerHTML += `<p style="color: ${color}; margin: 5px 0;">${msg}</p>`;
    log.scrollTop = log.scrollHeight;
}

// --- 5. INICIALIZACIÓN -----------------------
document.addEventListener('DOMContentLoaded', () => {
    iniciarSiguienteSubasta(); // Iniciar el primer sorteo
});

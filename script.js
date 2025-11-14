// =======================================================
// script.js - MOTOR DEL JUEGO DE SUBASTA CIEGAS Y PAUSADA
// =======================================================

// --- 1. DATOS Y ESTADO DEL JUEGO -----------------------

// A. PARTICIPANTES Y ESTADO INICIAL
const PARTICIPANTES = {
    player: { id: 'player', nombre: 'Jugador Humano', presupuesto: 100000000, equipo: [], salto_usado: false, ultimaPuja: 0 },
    ia1: { id: 'ia1', nombre: 'IA Conservadora', presupuesto: 100000000, equipo: [], perfil: 'conservadora', salto_usado: false, ultimaPuja: 0 },
    ia2: { id: 'ia2', nombre: 'IA Agresiva', presupuesto: 100000000, equipo: [], perfil: 'agresiva', salto_usado: false, ultimaPuja: 0 }
};

// B. ESTADO DE LA SUBASTA
let subastaActiva = {
    jugadorOculto: null,     // Objeto completo del jugador (secreto)
    jugadorPublico: null,    // Objeto solo con datos visibles (puesto, precio sugerido)
    ofertaActual: 0,         
    postorActualId: null,    
    jugadoresParaSubastar: [], 
    topePujaIA1: 0,          
    topePujaIA2: 0,
    timerFinSubasta: null,
    // Turnos de puja: Usado para saber quién sigue pujando sin un timer rápido
    participantesActivos: ['player', 'ia1', 'ia2'], // Quienes pueden pujar o pasar
    participantesQuePasaron: [] // Quienes han pasado o han sido el último postor
};

// --- 2. FUNCIONES DE UTILIDAD Y LÓGICA DE LA IA -----------------------

function formatoDinero(num) {
    if (num === null) return '$0.0M';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    return `${sign}${(absNum / 1000000).toFixed(1)}M`;
}

function calcularTopePuja(perfil, precioSugerido) {
    let factor;
    // Las IAs solo conocen el precio sugerido (simulando la ceguera)
    if (perfil === 'conservadora') {
        factor = Math.random() * (0.95 - 0.60) + 0.60;
    } else { // 'agresiva'
        factor = Math.random() * (1.20 - 0.90) + 0.90;
    }
    const topeBruto = precioSugerido * factor;
    return Math.floor(topeBruto / 1000000) * 1000000; 
}

/**
 * Lógica principal de las IAs: decide si pujar o si usar el Salto.
 */
function gestionarTurnoIA(iaId) {
    if (!subastaActiva.jugadorOculto) return;

    const ia = PARTICIPANTES[iaId];
    const precioSugerido = subastaActiva.jugadorOculto.precio_sugerido;
    const topePuja = iaId === 'ia1' ? subastaActiva.topePujaIA1 : subastaActiva.topePujaIA2;

    // Si ya pasamos, no volvemos a pujar.
    if (subastaActiva.participantesQuePasaron.includes(iaId)) {
        return; 
    }

    // 1. EVALUAR EL SALTO (Solo al inicio de la subasta)
    if (!ia.salto_usado && subastaActiva.ofertaActual <= (precioSugerido * 0.1)) {
        if (topePuja < precioSugerido * 0.7 && Math.random() < 0.4) {
            ia.salto_usado = true;
            mostrarMensaje(`[${ia.nombre}] usa su Salto y pasa al siguiente jugador.`, 'ia');
            
            // La IA ha decidido pasar la subasta
            subastaActiva.participantesQuePasaron.push(iaId);
            verificarFinSubasta();
            return; 
        }
    }

    // 2. DECISIÓN DE PUJA
    if (subastaActiva.ofertaActual >= topePuja) {
        mostrarMensaje(`[${ia.nombre}] pasa. (Oferta actual supera su límite de riesgo).`, 'ia');
        subastaActiva.participantesQuePasaron.push(iaId);
        verificarFinSubasta();
        return; 
    }
    if (subastaActiva.ofertaActual >= ia.presupuesto) {
        mostrarMensaje(`[${ia.nombre}] pasa. (Sin presupuesto).`, 'ia');
        subastaActiva.participantesQuePasaron.push(iaId);
        verificarFinSubasta();
        return;
    }

    // 3. CALCULAR NUEVA PUJA
    const incremento = Math.floor((Math.random() * 10 + 5)) * 1000000;
    let nuevaOferta = subastaActiva.ofertaActual + incremento; 

    nuevaOferta = Math.min(nuevaOferta, topePuja, ia.presupuesto);
    nuevaOferta = Math.floor(nuevaOferta / 1000000) * 1000000;
    
    // Si puede mejorar la oferta, puja
    if (nuevaOferta > subastaActiva.ofertaActual) {
        pujar(nuevaOferta, iaId);
    } else {
        mostrarMensaje(`[${ia.nombre}] pasa.`, 'ia');
        subastaActiva.participantesQuePasaron.push(iaId);
        verificarFinSubasta();
    }
}

/**
 * Procesa la puja de cualquier participante (jugador o IA).
 */
function pujar(monto, postorId = 'player') {
    const postor = PARTICIPANTES[postorId];
    
    // Validaciones
    if (monto <= subastaActiva.ofertaActual) {
        if (postorId === 'player') mostrarMensaje("Tu oferta debe ser mayor a la actual.", 'error');
        return;
    }
    if (monto > postor.presupuesto) {
        if (postorId === 'player') mostrarMensaje("No tienes suficiente presupuesto.", 'error');
        return;
    }

    // Actualización del estado
    subastaActiva.ofertaActual = monto;
    subastaActiva.postorActualId = postorId;
    postor.ultimaPuja = monto;

    // Reiniciar los participantes que han pasado, excepto el postor actual
    subastaActiva.participantesQuePasaron = subastaActiva.participantesActivos.filter(id => id === postorId);

    actualizarInterfaz();
    mostrarMensaje(`📈 [${postor.nombre}] puja con **${formatoDinero(monto)}**.`);

    // Si el jugador humano pujó, iniciar la secuencia de las IAs (pausado)
    if (postorId === 'player') {
        // Ejecutar las IAs secuencialmente con un pequeño retraso
        setTimeout(() => gestionarTurnoIA('ia1'), 1500); 
        setTimeout(() => gestionarTurnoIA('ia2'), 3000); 
    }
    
    // Si fue una IA la que pujó, las demás IAs y el jugador ya tienen su turno
    // La verificación de fin de subasta se hace después de la secuencia de puja/pase.
}

/**
 * Verifica si todos han pujado o pasado, declarando un ganador.
 */
function verificarFinSubasta() {
    // La subasta termina cuando solo queda el último postor activo
    if (subastaActiva.participantesQuePasaron.length === subastaActiva.participantesActivos.length) {
         // Si todos pasaron y no hubo postor, nadie lo gana.
         if(subastaActiva.postorActualId === null) {
             finalizarSubasta();
             return;
         }
         // Si todos pasaron excepto el último postor, ese es el ganador.
         const ultimoPostor = subastaActiva.participantesQuePasaron.find(id => id === subastaActiva.postorActualId);
         if (ultimoPostor) {
             finalizarSubasta();
         }
    }
    
    // Si el jugador humano aún no ha pujado (y el último postor no fue él), darle el turno de la interfaz.
    if (!subastaActiva.participantesQuePasaron.includes('player')) {
        // Si nadie ha pujado (oferta 0), es el turno inicial del jugador.
        if (subastaActiva.ofertaActual > 0 && subastaActiva.postorActualId !== 'player') {
             mostrarMensaje("Tu turno para subir la oferta. O pasa.", 'player');
        } else if (subastaActiva.ofertaActual === 0) {
             mostrarMensaje("Tu turno para hacer la primera oferta. O usa el Salto.", 'player');
        }
    }
}


/**
 * Transfiere el jugador OCULTO al equipo del ganador y pasa al siguiente.
 */
function finalizarSubasta() {
    clearTimeout(subastaActiva.timerFinSubasta);
    
    if (!subastaActiva.jugadorOculto) return; 

    // --- 1. REVELACIÓN ---
    const jugadorReal = subastaActiva.jugadorOculto;
    const precio = subastaActiva.ofertaActual;
    mostrarMensaje(`🥁 ¡REVELACIÓN! El jugador era **${jugadorReal.nombre}** (Media: ${jugadorReal.media})`, 'ganador');


    if (!subastaActiva.postorActualId || subastaActiva.ofertaActual === 0) {
        mostrarMensaje(`❌ Nadie quiso pujar. ${jugadorReal.nombre} no vendido.`, 'info');
    } else {
        const ganador = PARTICIPANTES[subastaActiva.postorActualId];

        // Actualizar estado
        ganador.presupuesto -= precio;
        ganador.equipo.push({ nombre: jugadorReal.nombre, precio: precio, media: jugadorReal.media, puesto: jugadorReal.puesto });
        
        // Marcar como vendido
        const jugadorGlobal = TODOS_LOS_JUGADORES.find(j => j.id === jugadorReal.id);
        if (jugadorGlobal) jugadorGlobal.vendido = true;

        // Mostrar resultados
        mostrarMensaje(`🏆 ¡${ganador.nombre} gana el jugador por **${formatoDinero(precio)}**!`, 'ganador');
    }
    
    // Iniciar la siguiente subasta
    subastaActiva.jugadorOculto = null;
    subastaActiva.jugadorPublico = null;
    actualizarInterfaz();
    setTimeout(iniciarSiguienteSubasta, 7000); // 7 segundos para asimilar la sorpresa
}


/**
 * Prepara el siguiente jugador para la subasta, ocultando sus datos.
 */
function iniciarSiguienteSubasta() {
    if (subastaActiva.jugadoresParaSubastar.length === 0) {
        const noVendidos = TODOS_LOS_JUGADORES.filter(j => !j.vendido);
        if (noVendidos.length === 0) {
            mostrarMensaje("🏁 ¡Juego Terminado! Todos los jugadores vendidos. Revisa tus equipos.", 'ganador');
            return;
        }

        const numASortear = Math.min(4, noVendidos.length);
        const jugadoresDisponibles = [...noVendidos];
        
        for (let i = 0; i < numASortear; i++) {
            const indice = Math.floor(Math.random() * jugadoresDisponibles.length);
            subastaActiva.jugadoresParaSubastar.push(jugadoresDisponibles[indice]);
            jugadoresDisponibles.splice(indice, 1); 
        }
        mostrarMensaje(`--- ⏳ INICIO DE TURNO --- Se sortearon ${subastaActiva.jugadoresParaSubastar.length} jugadores.`, 'info');
    }

    // 1. Configurar la subasta OCULTANDO el jugador
    const jugadorReal = subastaActiva.jugadoresParaSubastar.shift();
    subastaActiva.jugadorOculto = jugadorReal; // Guardamos el objeto completo internamente

    // Creamos la versión pública (ciega)
    subastaActiva.jugadorPublico = {
        puesto: jugadorReal.puesto,
        precio_sugerido: jugadorReal.precio_sugerido
    };
    
    subastaActiva.ofertaActual = jugadorReal.precio_sugerido * 0.1; // Puja inicial
    subastaActiva.postorActualId = null;
    subastaActiva.participantesQuePasaron = []; // Nadie ha pasado al inicio
    
    // Calcular los TOPEs de las IAs (basado en el precio sugerido)
    subastaActiva.topePujaIA1 = calcularTopePuja('conservadora', jugadorReal.precio_sugerido);
    subastaActiva.topePujaIA2 = calcularTopePuja('agresiva', jugadorReal.precio_sugerido);
    
    // 2. Mostrar Subasta (Ciega)
    mostrarMensaje(`⭐ ¡Subasta por un jugador ${jugadorReal.puesto}!`, 'info');
    mostrarMensaje(`Precio Sugerido: ${formatoDinero(jugadorReal.precio_sugerido)}. Puja inicial: ${formatoDinero(subastaActiva.ofertaActual)}.`);
    
    actualizarInterfaz();
    
    // 3. Iniciar la secuencia de puja de las IAs (dan su primera puja/pase)
    setTimeout(() => gestionarTurnoIA('ia1'), 2000);
    setTimeout(() => gestionarTurnoIA('ia2'), 4000);
    
    // 4. Verificar el estado inicial después de que las IAs reaccionen.
    setTimeout(verificarFinSubasta, 5000);
}

// --- 3. GESTIÓN DE LA INTERFAZ -----------------------

function actualizarInterfaz() {
    const jugador = subastaActiva.jugadorPublico;
    const postorNombre = subastaActiva.postorActualId ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie';

    // 1. Actualizar la información de la subasta (#info-subasta)
    document.getElementById('info-subasta').innerHTML = `
        <h2>En Subasta: ${jugador ? jugador.puesto : 'Esperando Siguiente...'}</h2>
        <p>Precio Sugerido: <b>${jugador ? formatoDinero(jugador.precio_sugerido) : 'N/A'}</b></p>
        <p>Oferta Actual: <b style="color: red; font-size: 1.5em;">${formatoDinero(subastaActiva.ofertaActual)}</b> (Postor: ${postorNombre})</p>
    `;

    // 2. Actualizar info de participantes (#info-participantes)
    document.getElementById('info-participantes').innerHTML = `
        <h3>Presupuestos y Equipos</h3>
        <p><b>${PARTICIPANTES.player.nombre}</b>: ${formatoDinero(PARTICIPANTES.player.presupuesto)} | Equipo: ${PARTICIPANTES.player.equipo.length} jugadores (Salto: ${PARTICIPANTES.player.salto_usado ? 'SI' : 'NO'})</p>
        <p>${PARTICIPANTES.ia1.nombre}: ${formatoDinero(PARTICIPANTES.ia1.presupuesto)} | Equipo: ${PARTICIPANTES.ia1.equipo.length} jugadores (Salto: ${PARTICIPANTES.ia1.salto_usado ? 'SI' : 'NO'})</p>
        <p>${PARTICIPANTES.ia2.nombre}: ${formatoDinero(PARTICIPANTES.ia2.presupuesto)} | Equipo: ${PARTICIPANTES.ia2.equipo.length} jugadores (Salto: ${PARTICIPANTES.ia2.salto_usado ? 'SI' : 'NO'})</p>
    `;
    
    // 3. Controlar botones (habilitar/deshabilitar)
    const input = document.getElementById('input-puja');
    const botonPuja = document.getElementById('boton-puja');
    const botonSalto = document.getElementById('boton-salto');

    const subastaActivaFlag = !!subastaActiva.jugadorOculto;
    const pujaMinima = subastaActiva.jugadorPublico ? subastaActiva.jugadorPublico.precio_sugerido * 0.1 : 0;
    
    input.disabled = !subastaActivaFlag;
    botonPuja.disabled = !subastaActivaFlag;
    
    // Solo se puede saltar si nadie más pujó después de la puja inicial.
    const puedeSaltar = !PARTICIPANTES.player.salto_usado && subastaActiva.ofertaActual <= pujaMinima;
    botonSalto.disabled = !puedeSaltar;
}

function pujarManual() {
    // Si el jugador ya ha pasado, no puede volver a pujar.
    if (subastaActiva.participantesQuePasaron.includes('player')) {
        mostrarMensaje("Ya has pasado o has sido superado. Solo puedes pujar si tu turno está activo.", 'error');
        return;
    }

    const inputM = document.getElementById('input-puja');
    const monto = parseFloat(inputM.value) * 1000000; 
    
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje("Introduce un monto válido (en millones).", 'error');
        return;
    }
    
    pujar(monto, 'player');
    inputM.value = ''; 
}

function usarSalto() {
    const pujaMinima = subastaActiva.jugadorPublico.precio_sugerido * 0.1;

    if (PARTICIPANTES.player.salto_usado) {
        mostrarMensaje("Ya usaste tu único 'Salto'.", 'error');
        return;
    }
    
    if (subastaActiva.ofertaActual > pujaMinima) {
        mostrarMensaje("No puedes 'Saltar' si la puja ya ha aumentado.", 'error');
        return;
    }
    
    PARTICIPANTES.player.salto_usado = true;
    mostrarMensaje("Has usado tu Salto. Pasamos al siguiente jugador.", 'player');
    
    // El jugador ha pasado
    subastaActiva.participantesQuePasaron.push('player');
    
    // Llamamos a la verificación de fin, aunque es probable que aún no termine.
    setTimeout(verificarFinSubasta, 1000);
}


function mostrarMensaje(msg, tipo = '') {
    const log = document.getElementById('mensajes');
    if (!log) {
        console.log(`[LOG FALLBACK - ${tipo}]: ${msg}`);
        return;
    }
    
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

window.pujarManual = pujarManual;
window.usarSalto = usarSalto;
window.verificarFinSubasta = verificarFinSubasta; // Hacemos esta función accesible para la prueba

document.addEventListener('DOMContentLoaded', () => {
    // Aseguramos que los arrays de jugadores existan antes de empezar
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        mostrarMensaje("ERROR: La lista TODOS_LOS_JUGADORES (jugadores.js) no fue cargada correctamente.", 'error');
        return;
    }
    iniciarSiguienteSubasta(); 
});

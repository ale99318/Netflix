// =======================================================
// script.js - MOTOR DEL JUEGO DE SUBASTA (Versión final con archivos separados)
// =======================================================

// NOTA: Se asume que 'jugadores.js' ya cargó la variable TODOS_LOS_JUGADORES.

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
    timerFinSubasta: null 
};

// --- 2. FUNCIONES DE UTILIDAD Y LÓGICA DE LA IA -----------------------

/**
 * Formatea números a un formato legible ($100.0M).
 */
function formatoDinero(num) {
    if (num === null) return '$0.0M';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    return `${sign}${(absNum / 1000000).toFixed(1)}M`;
}

/**
 * Calcula el 'TOPE' (máximo que la IA está dispuesta a pagar)
 */
function calcularTopePuja(perfil, precioSugerido) {
    let factor;
    if (perfil === 'conservadora') {
        factor = Math.random() * (0.95 - 0.60) + 0.60;
    } else { // 'agresiva'
        factor = Math.random() * (1.20 - 0.90) + 0.90;
    }
    
    const topeBruto = precioSugerido * factor;
    return Math.floor(topeBruto / 1000000) * 1000000; 
}

/**
 * Lógica principal de las IAs: decide si pujar o usar el salto.
 */
function gestionarTurnoIA(iaId) {
    if (!subastaActiva.jugador || subastaActiva.postorActualId === iaId) return;

    const ia = PARTICIPANTES[iaId];
    const precioSugerido = subastaActiva.jugador.precio_sugerido;
    const topePuja = iaId === 'ia1' ? subastaActiva.topePujaIA1 : subastaActiva.topePujaIA2;

    // 1. EVALUAR EL SALTO (Solo al inicio de la subasta)
    if (!ia.salto_usado && subastaActiva.ofertaActual <= (precioSugerido * 0.1)) { 
        if (topePuja < precioSugerido * 0.7 && Math.random() < 0.4) {
            ia.salto_usado = true;
            mostrarMensaje(`[${ia.nombre}] usa su Salto y pasa.`, 'ia');
            
            if (iaId === 'ia1') {
                setTimeout(() => gestionarTurnoIA('ia2'), 1500);
            } else {
                setTimeout(finalizarSubasta, 2000); 
            }
            return; 
        }
    }

    // 2. DECISIÓN DE PUJA
    if (subastaActiva.ofertaActual >= topePuja) {
        mostrarMensaje(`[${ia.nombre}] pasa. (Oferta > Tope: ${formatoDinero(topePuja)})`, 'ia');
        return; 
    }
    if (subastaActiva.ofertaActual >= ia.presupuesto) {
        mostrarMensaje(`[${ia.nombre}] pasa. (Sin presupuesto)`, 'ia');
        return;
    }

    // 3. CALCULAR NUEVA PUJA
    const incremento = Math.floor((Math.random() * 10 + 5)) * 1000000;
    let nuevaOferta = subastaActiva.ofertaActual + incremento; 

    nuevaOferta = Math.min(nuevaOferta, topePuja, ia.presupuesto);
    nuevaOferta = Math.floor(nuevaOferta / 1000000) * 1000000;
    
    if (nuevaOferta > subastaActiva.ofertaActual) {
        pujar(nuevaOferta, iaId);
    } else {
        mostrarMensaje(`[${ia.nombre}] pasa.`, 'ia');
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

    actualizarInterfaz();
    mostrarMensaje(`📈 [${postor.nombre}] puja con **${formatoDinero(monto)}**.`);

    clearTimeout(subastaActiva.timerFinSubasta);

    // Turno de las IAs
    if (postorId === 'player') {
        setTimeout(() => gestionarTurnoIA('ia1'), 1500); 
        setTimeout(() => gestionarTurnoIA('ia2'), 3000);
        subastaActiva.timerFinSubasta = setTimeout(finalizarSubasta, 4500); 
    } else {
        // Tiempo de gracia para que el jugador o la otra IA reaccionen
        subastaActiva.timerFinSubasta = setTimeout(finalizarSubasta, 2000);
    }
}

/**
 * Transfiere el jugador al equipo del ganador y pasa al siguiente.
 */
function finalizarSubasta() {
    clearTimeout(subastaActiva.timerFinSubasta);
    
    if (!subastaActiva.jugador) return; 

    if (!subastaActiva.postorActualId || subastaActiva.ofertaActual === 0) {
        mostrarMensaje(`❌ Nadie pujó por ${subastaActiva.jugador.nombre}. Jugador no vendido.`, 'info');
    } else {
        const ganador = PARTICIPANTES[subastaActiva.postorActualId];
        const jugador = subastaActiva.jugador;
        const precio = subastaActiva.ofertaActual;

        // Actualizar estado
        ganador.presupuesto -= precio;
        ganador.equipo.push({ nombre: jugador.nombre, precio: precio, media: jugador.media, puesto: jugador.puesto });
        
        // Busca y marca el jugador como vendido en el array global
        const jugadorGlobal = TODOS_LOS_JUGADORES.find(j => j.id === jugador.id);
        if (jugadorGlobal) jugadorGlobal.vendido = true;


        // Mostrar resultados
        mostrarMensaje(`🏆 ¡${ganador.nombre} gana a **${jugador.nombre}** (Media OCULTA: ${jugador.media}) por **${formatoDinero(precio)}**!`, 'ganador');
    }
    
    // Iniciar la siguiente subasta
    subastaActiva.jugador = null; 
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

    // 1. Configurar la subasta activa
    const jugadorSubastar = subastaActiva.jugadoresParaSubastar.shift();
    subastaActiva.jugador = jugadorSubastar;
    subastaActiva.ofertaActual = jugadorSubastar.precio_sugerido * 0.1; 
    subastaActiva.postorActualId = null;
    
    // 2. Calcular los TOPEs de las IAs
    subastaActiva.topePujaIA1 = calcularTopePuja('conservadora', jugadorSubastar.precio_sugerido);
    subastaActiva.topePujaIA2 = calcularTopePuja('agresiva', jugadorSubastar.precio_sugerido);
    
    // 3. Mostrar Subasta
    mostrarMensaje(`⭐ ¡Subasta por **${jugadorSubastar.nombre} (${jugadorSubastar.puesto})**!`, 'info');
    mostrarMensaje(`Puja inicial: ${formatoDinero(subastaActiva.ofertaActual)}.`);
    
    actualizarInterfaz();
    
    // 4. Iniciar la secuencia de puja de las IAs 
    setTimeout(() => {
        gestionarTurnoIA('ia1');
        gestionarTurnoIA('ia2');
        
        if (!subastaActiva.postorActualId) {
             mostrarMensaje("Tu turno para pujar. Ofrece más o usa el Salto.", 'player');
             subastaActiva.timerFinSubasta = setTimeout(finalizarSubasta, 4500);
        }
    }, 2000);
}


// --- 3. GESTIÓN DE LA INTERFAZ (Solo actualizar datos) -----------------------

function actualizarInterfaz() {
    const jugador = subastaActiva.jugador;
    const postorNombre = subastaActiva.postorActualId ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie';

    // 1. Actualizar la información de la subasta (#info-subasta)
    document.getElementById('info-subasta').innerHTML = `
        <h2>En Subasta: ${jugador ? jugador.nombre + ' (' + jugador.puesto + ')' : 'Esperando Siguiente...'}</h2>
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

    const subastaActivaFlag = !!subastaActiva.jugador;
    
    input.disabled = !subastaActivaFlag;
    botonPuja.disabled = !subastaActivaFlag;
    
    // La puja mínima inicial es el 10% del sugerido. Solo se puede saltar si estamos en esa puja o en 0.
    const pujaMinima = subastaActiva.jugador ? subastaActiva.jugador.precio_sugerido * 0.1 : 0;
    botonSalto.disabled = PARTICIPANTES.player.salto_usado || subastaActiva.ofertaActual > pujaMinima;
}

function pujarManual() {
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
    if (PARTICIPANTES.player.salto_usado) {
        mostrarMensaje("Ya usaste tu único 'Salto'.", 'error');
        return;
    }
    
    const pujaMinima = subastaActiva.jugador.precio_sugerido * 0.1;
    if (subastaActiva.ofertaActual > pujaMinima) {
        mostrarMensaje("No puedes 'Saltar' si la puja ya ha aumentado.", 'error');
        return;
    }
    
    PARTICIPANTES.player.salto_usado = true;
    mostrarMensaje("Has usado tu Salto. Pasamos al siguiente jugador.", 'player');
    
    clearTimeout(subastaActiva.timerFinSubasta);
    subastaActiva.jugador = null;
    actualizarInterfaz();
    setTimeout(iniciarSiguienteSubasta, 3000);
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

// Hacemos las funciones accesibles globalmente para que 'onclick' funcione en el HTML
window.pujarManual = pujarManual;
window.usarSalto = usarSalto;

document.addEventListener('DOMContentLoaded', () => {
    // El script puede iniciarse inmediatamente porque la interfaz ya existe en index.html
    iniciarSiguienteSubasta(); 
});

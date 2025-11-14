// =======================================================
// script.js - MOTOR DEL JUEGO CON SUBASTA CIEGAS Y PAUSA OBLIGATORIA
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
    jugadorOculto: null,     
    jugadorPublico: null,    
    ofertaActual: 0,         
    postorActualId: null,    
    jugadoresParaSubastar: [], 
    topePujaIA1: 0,          
    topePujaIA2: 0,
    timerFinSubasta: null,
    participantesActivos: ['player', 'ia1', 'ia2'], 
    participantesQuePasaron: [],
    revelacionPendiente: false 
};

// --- 2. FUNCIONES DE UTILIDAD Y LÓGICA DE LA IA ---

function formatoDinero(num) {
    if (num === null) return '$0.0M';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    return `${sign}$${(absNum / 1000000).toFixed(1)}M`;
}

function calcularTopePuja(perfil, precioSugerido) {
    let factor;
    if (perfil === 'conservadora') {
        factor = Math.random() * (0.95 - 0.60) + 0.60;
    } else {
        factor = Math.random() * (1.20 - 0.90) + 0.90;
    }
    const topeBruto = precioSugerido * factor;
    return Math.floor(topeBruto / 1000000) * 1000000; 
}

function mostrarMensaje(texto, tipo = 'normal') {
    const log = document.getElementById('log-subasta');
    if (!log) return;
    
    const mensaje = document.createElement('p');
    mensaje.textContent = texto;
    
    if (tipo === 'ganador') mensaje.style.color = '#4CAF50';
    if (tipo === 'info') mensaje.style.color = '#2196F3';
    if (tipo === 'alerta') mensaje.style.color = '#FF9800';
    
    log.appendChild(mensaje);
    log.scrollTop = log.scrollHeight;
}

// =======================================================
// --- 3. LÓGICA PRINCIPAL DEL JUEGO ---
// =======================================================

function gestionarTurnoIA(iaId) {
    if (!subastaActiva.jugadorOculto || subastaActiva.revelacionPendiente) return;

    const ia = PARTICIPANTES[iaId];
    const precioSugerido = subastaActiva.jugadorOculto.precio_sugerido;
    const topePuja = iaId === 'ia1' ? subastaActiva.topePujaIA1 : subastaActiva.topePujaIA2;

    if (subastaActiva.participantesQuePasaron.includes(iaId)) {
        return; 
    }

    // Lógica de Salto
    const probabilidadSalto = ia.perfil === 'conservadora' ? 0.15 : 0.25;
    if (!ia.salto_usado && Math.random() < probabilidadSalto && subastaActiva.ofertaActual > precioSugerido * 0.7) {
        ia.salto_usado = true;
        mostrarMensaje(`⏭️ [${ia.nombre}] usa su SALTO y pasa esta subasta.`, 'alerta');
        subastaActiva.participantesQuePasaron.push(iaId);
        verificarFinSubasta();
        return;
    }

    // Decidir si puja o pasa
    const ofertaMinima = subastaActiva.ofertaActual + 1000000;
    
    if (ofertaMinima > topePuja || ofertaMinima > ia.presupuesto) {
        mostrarMensaje(`🚫 [${ia.nombre}] se retira de la puja.`);
        subastaActiva.participantesQuePasaron.push(iaId);
        verificarFinSubasta();
        return;
    }

    // Calcular nueva oferta
    let incremento = Math.floor(Math.random() * 3 + 1) * 1000000;
    if (ia.perfil === 'agresiva') {
        incremento = Math.floor(Math.random() * 5 + 2) * 1000000;
    }
    
    const nuevaOferta = Math.min(ofertaMinima + incremento, topePuja, ia.presupuesto);
    
    pujar(nuevaOferta, iaId);
}

function pujar(monto, postorId = 'player') {
    if (subastaActiva.revelacionPendiente) return;

    const postor = PARTICIPANTES[postorId];
    
    // Validaciones
    if (monto > postor.presupuesto) {
        if (postorId === 'player') {
            mostrarMensaje('❌ No tienes suficiente presupuesto.', 'alerta');
        }
        return;
    }
    
    if (monto <= subastaActiva.ofertaActual) {
        if (postorId === 'player') {
            mostrarMensaje('❌ La oferta debe ser mayor a la actual.', 'alerta');
        }
        return;
    }

    subastaActiva.ofertaActual = monto;
    subastaActiva.postorActualId = postorId;
    postor.ultimaPuja = monto;

    // Resetear los que pasaron excepto el actual postor
    subastaActiva.participantesQuePasaron = subastaActiva.participantesActivos.filter(id => id !== postorId);

    actualizarInterfaz();
    mostrarMensaje(`📈 [${postor.nombre}] puja con **${formatoDinero(monto)}**.`);

    if (postorId === 'player') {
        setTimeout(() => gestionarTurnoIA('ia1'), 1500); 
        setTimeout(() => gestionarTurnoIA('ia2'), 3000); 
    }
    
    clearTimeout(subastaActiva.timerFinSubasta);
    subastaActiva.timerFinSubasta = setTimeout(verificarFinSubasta, 4500); 
}

function pujarManual() {
    const input = document.getElementById('input-puja');
    const monto = parseFloat(input.value) * 1000000;
    
    if (!monto || monto <= 0) {
        mostrarMensaje('❌ Ingresa una cantidad válida.', 'alerta');
        return;
    }
    
    pujar(monto, 'player');
    input.value = '';
}

function usarSalto() {
    const player = PARTICIPANTES.player;
    
    if (player.salto_usado) {
        mostrarMensaje('❌ Ya usaste tu salto.', 'alerta');
        return;
    }
    
    if (!subastaActiva.jugadorOculto || subastaActiva.revelacionPendiente) {
        mostrarMensaje('❌ No hay subasta activa.', 'alerta');
        return;
    }
    
    player.salto_usado = true;
    subastaActiva.participantesQuePasaron.push('player');
    mostrarMensaje('⏭️ Has usado tu SALTO. Pasas esta subasta.', 'alerta');
    
    actualizarInterfaz();
    verificarFinSubasta();
}

function verificarFinSubasta() {
    clearTimeout(subastaActiva.timerFinSubasta);
    if (!subastaActiva.jugadorOculto || subastaActiva.revelacionPendiente) return;

    // Condición de fin
    if (subastaActiva.participantesQuePasaron.length === subastaActiva.participantesActivos.length ||
        (subastaActiva.postorActualId !== null && subastaActiva.participantesQuePasaron.length === subastaActiva.participantesActivos.length - 1)) 
    {
         if(subastaActiva.postorActualId === null || subastaActiva.ofertaActual <= subastaActiva.jugadorOculto.precio_sugerido * 0.1) {
             subastaActiva.postorActualId = null;
         }
         
         subastaActiva.revelacionPendiente = true;
         mostrarMensaje("🔒 --- SUBASTA CERRADA --- Presiona REVELAR JUGADOR para ver el resultado.", 'info');
         actualizarInterfaz();
         return;
    }

    if (!subastaActiva.participantesQuePasaron.includes('player')) {
        mostrarMensaje('🎯 Es tu turno. Puedes pujar o usar tu salto.', 'info');
    }
}

// =======================================================
// --- 4. FASE DE REVELACIÓN Y AVANCE ---
// =======================================================

function revelarJugador() {
    if (!subastaActiva.revelacionPendiente) return;

    const jugadorReal = subastaActiva.jugadorOculto;
    const precio = subastaActiva.ofertaActual;

    mostrarMensaje(`🥁 ¡REVELACIÓN! El jugador era **${jugadorReal.nombre}** (Media: ${jugadorReal.media}, Puesto: ${jugadorReal.puesto})`, 'ganador');

    if (subastaActiva.postorActualId === null || precio === 0) {
        mostrarMensaje(`❌ Nadie lo quiso. ${jugadorReal.nombre} no se vendió.`, 'info');
    } else {
        const ganador = PARTICIPANTES[subastaActiva.postorActualId];

        ganador.presupuesto -= precio;
        ganador.equipo.push({ 
            nombre: jugadorReal.nombre, 
            media: jugadorReal.media, 
            puesto: jugadorReal.puesto,
            precio: precio
        });
        
        if (typeof TODOS_LOS_JUGADORES !== 'undefined') {
            const jugadorGlobal = TODOS_LOS_JUGADORES.find(j => j.id === jugadorReal.id);
            if (jugadorGlobal) jugadorGlobal.vendido = true;
        }

        mostrarMensaje(`🏆 ¡${ganador.nombre} ganó la subasta y pagó ${formatoDinero(precio)}!`, 'ganador');
    }
    
    subastaActiva.revelacionPendiente = false;
    subastaActiva.jugadorOculto = null;
    subastaActiva.jugadorPublico = null;
    actualizarInterfaz();
    
    setTimeout(iniciarSiguienteSubasta, 3000); 
}

function iniciarSiguienteSubasta() {
    // Verificar si hay jugadores disponibles
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        mostrarMensaje('❌ No hay jugadores disponibles para subastar.', 'alerta');
        return;
    }

    const disponibles = TODOS_LOS_JUGADORES.filter(j => !j.vendido);
    
    if (disponibles.length === 0) {
        mostrarMensaje('🎉 ¡JUEGO TERMINADO! Todos los jugadores han sido subastados.', 'ganador');
        return;
    }

    // Seleccionar jugador aleatorio
    const jugadorSeleccionado = disponibles[Math.floor(Math.random() * disponibles.length)];
    
    // Resetear estado de subasta
    subastaActiva.jugadorOculto = jugadorSeleccionado;
    subastaActiva.jugadorPublico = {
        puesto: jugadorSeleccionado.puesto,
        precio_sugerido: jugadorSeleccionado.precio_sugerido
    };
    subastaActiva.ofertaActual = 0;
    subastaActiva.postorActualId = null;
    subastaActiva.participantesQuePasaron = [];
    subastaActiva.revelacionPendiente = false;
    
    // Calcular topes para IAs
    subastaActiva.topePujaIA1 = calcularTopePuja('conservadora', jugadorSeleccionado.precio_sugerido);
    subastaActiva.topePujaIA2 = calcularTopePuja('agresiva', jugadorSeleccionado.precio_sugerido);
    
    actualizarInterfaz();
    mostrarMensaje(`--- 🏁 INICIO DE TURNO --- Se sortearon 4 jugadores.`, 'info');
    mostrarMensaje(`📢 Subasta por **Jugador Misterioso** (${jugadorSeleccionado.puesto}) - Precio Sugerido: ${formatoDinero(jugadorSeleccionado.precio_sugerido)}`, 'info');
}

// =======================================================
// --- 5. GESTIÓN DE LA INTERFAZ ---
// =======================================================

function actualizarInterfaz() {
    const jugador = subastaActiva.jugadorPublico;
    const postorNombre = subastaActiva.postorActualId ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie';

    // 1. Actualizar la información de la subasta
    const infoSubasta = document.getElementById('info-subasta');
    if (infoSubasta) {
        infoSubasta.innerHTML = `
            <h2>En Subasta: ${subastaActiva.revelacionPendiente ? '🔒 SUBASTA CERRADA' : (jugador ? `🎭 Jugador Misterioso (${jugador.puesto})` : '⏳ Esperando Siguiente...')}</h2>
            <p>Precio Sugerido: <b>${jugador ? formatoDinero(jugador.precio_sugerido) : 'N/A'}</b></p>
            <p>Oferta Actual: <b style="color: red; font-size: 1.5em;">${formatoDinero(subastaActiva.ofertaActual)}</b> (Postor: ${postorNombre})</p>
        `;
    }

    // 2. Actualizar info de participantes
    const infoParticipantes = document.getElementById('info-participantes');
    if (infoParticipantes) {
        infoParticipantes.innerHTML = `
            <h3>💰 Presupuestos y Equipos</h3>
            <p><b>${PARTICIPANTES.player.nombre}</b>: ${formatoDinero(PARTICIPANTES.player.presupuesto)} | Equipo: ${PARTICIPANTES.player.equipo.length} jugadores (Salto: ${PARTICIPANTES.player.salto_usado ? '✅ USADO' : '⭕ Disponible'})</p>
            <p>${PARTICIPANTES.ia1.nombre}: ${formatoDinero(PARTICIPANTES.ia1.presupuesto)} | Equipo: ${PARTICIPANTES.ia1.equipo.length} jugadores (Salto: ${PARTICIPANTES.ia1.salto_usado ? '✅ USADO' : '⭕ Disponible'})</p>
            <p>${PARTICIPANTES.ia2.nombre}: ${formatoDinero(PARTICIPANTES.ia2.presupuesto)} | Equipo: ${PARTICIPANTES.ia2.equipo.length} jugadores (Salto: ${PARTICIPANTES.ia2.salto_usado ? '✅ USADO' : '⭕ Disponible'})</p>
            
            ${subastaActiva.revelacionPendiente ? `<button onclick="revelarJugador()" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 10px;">🎁 REVELAR JUGADOR</button>` : ''}
        `;
    }
    
    // 3. Controlar botones
    const input = document.getElementById('input-puja');
    const botonPuja = document.getElementById('boton-puja');
    const botonSalto = document.getElementById('boton-salto');

    const deshabilitar = !subastaActiva.jugadorOculto || subastaActiva.revelacionPendiente;
    
    if (input) input.disabled = deshabilitar;
    if (botonPuja) botonPuja.disabled = deshabilitar;
    if (botonSalto) botonSalto.disabled = deshabilitar || PARTICIPANTES.player.salto_usado;
}

// Hacer funciones accesibles globalmente
window.revelarJugador = revelarJugador; 
window.pujarManual = pujarManual;
window.usarSalto = usarSalto;
window.verificarFinSubasta = verificarFinSubasta;

// Inicialización del juego
document.addEventListener('DOMContentLoaded', () => {
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        mostrarMensaje('⚠️ ADVERTENCIA: No se encontró la lista de jugadores (TODOS_LOS_JUGADORES). Asegúrate de cargar datos.js antes que script.js', 'alerta');
    } else {
        iniciarSiguienteSubasta(); 
    }
});

// =======================================================
// script.js - SUBASTA POR TURNOS CON TEMPORIZADOR Y POSICIONES
// =======================================================

// --- 1. DATOS Y ESTADO DEL JUEGO -----------------------

const POSICIONES_REQUERIDAS = ['POR', 'LI', 'DFC', 'LD', 'MCD', 'MC', 'EI', 'ED', 'MP', 'DC', 'EXT'];

const PARTICIPANTES = {
    player: { 
        id: 'player', 
        nombre: 'Jugador Humano', 
        presupuesto: 100000000, 
        equipo: [], 
        posicionesOcupadas: [],
        salto_usado: false, 
        ultimaPuja: 0 
    },
    ia1: { 
        id: 'ia1', 
        nombre: 'IA Conservadora', 
        presupuesto: 100000000, 
        equipo: [], 
        posicionesOcupadas: [],
        perfil: 'conservadora', 
        salto_usado: false, 
        ultimaPuja: 0 
    },
    ia2: { 
        id: 'ia2', 
        nombre: 'IA Agresiva', 
        presupuesto: 100000000, 
        equipo: [], 
        posicionesOcupadas: [],
        perfil: 'agresiva', 
        salto_usado: false, 
        ultimaPuja: 0 
    }
};

// B. ESTADO DE LA SUBASTA
let subastaActiva = {
    jugadorOculto: null,     
    jugadorPublico: null,    
    ofertaActual: 0,         
    postorActualId: null,    
    topePujaIA1: 0,          
    topePujaIA2: 0,
    
    // Sistema de turnos
    turnoActual: 0, // 0=player, 1=ia1, 2=ia2
    ordenTurnos: ['player', 'ia1', 'ia2'],
    participantesActivos: [], // Solo los que pueden pujar por esta posición
    participantesQuePasaron: [],
    
    // Temporizador
    tiempoRestante: 10,
    intervalTemporizador: null,
    
    revelacionPendiente: false,
    rondaActual: 0
};

// --- 2. FUNCIONES DE UTILIDAD ---

function formatoDinero(num) {
    if (num === null || num === undefined) return '$0.0M';
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
    mensaje.innerHTML = texto;
    
    if (tipo === 'ganador') mensaje.style.color = '#4CAF50';
    if (tipo === 'info') mensaje.style.color = '#2196F3';
    if (tipo === 'alerta') mensaje.style.color = '#FF9800';
    if (tipo === 'turno') mensaje.style.fontWeight = 'bold';
    
    log.appendChild(mensaje);
    log.scrollTop = log.scrollHeight;
}

function necesitaPosicion(participanteId, posicion) {
    const p = PARTICIPANTES[participanteId];
    return !p.posicionesOcupadas.includes(posicion);
}

// --- 3. SISTEMA DE TEMPORIZADOR ---

function iniciarTemporizador() {
    detenerTemporizador();
    subastaActiva.tiempoRestante = 10;
    actualizarInterfaz();
    
    subastaActiva.intervalTemporizador = setInterval(() => {
        subastaActiva.tiempoRestante--;
        actualizarInterfaz();
        
        if (subastaActiva.tiempoRestante <= 0) {
            detenerTemporizador();
            pasarTurno();
        }
    }, 1000);
}

function detenerTemporizador() {
    if (subastaActiva.intervalTemporizador) {
        clearInterval(subastaActiva.intervalTemporizador);
        subastaActiva.intervalTemporizador = null;
    }
}

function reiniciarTemporizador() {
    subastaActiva.tiempoRestante = 10;
    iniciarTemporizador();
}

// --- 4. SISTEMA DE TURNOS ---

function iniciarTurnos() {
    const posicion = subastaActiva.jugadorOculto.puesto;
    
    // Determinar quién puede participar (solo los que necesitan esta posición)
    subastaActiva.participantesActivos = subastaActiva.ordenTurnos.filter(id => 
        necesitaPosicion(id, posicion)
    );
    
    if (subastaActiva.participantesActivos.length === 0) {
        mostrarMensaje('⚠️ Todos ya tienen esta posición. Pasando al siguiente jugador...', 'alerta');
        setTimeout(() => {
            subastaActiva.revelacionPendiente = true;
            subastaActiva.postorActualId = null;
            revelarJugador();
        }, 2000);
        return;
    }
    
    subastaActiva.participantesQuePasaron = [];
    subastaActiva.turnoActual = 0;
    
    empezarTurno();
}

function empezarTurno() {
    if (subastaActiva.revelacionPendiente) return;
    
    // Encontrar el siguiente participante activo que no haya pasado
    let intentos = 0;
    while (intentos < subastaActiva.participantesActivos.length) {
        const participanteId = subastaActiva.participantesActivos[subastaActiva.turnoActual];
        
        if (!subastaActiva.participantesQuePasaron.includes(participanteId)) {
            const participante = PARTICIPANTES[participanteId];
            mostrarMensaje(`<br>⏰ <b>TURNO DE: ${participante.nombre}</b> (10 segundos)`, 'turno');
            
            iniciarTemporizador();
            
            // Si es turno de IA, ejecutar después de 2-5 segundos
            if (participanteId !== 'player') {
                const tiempoEspera = Math.random() * 3000 + 2000; // 2-5 segundos
                setTimeout(() => {
                    if (subastaActiva.participantesActivos[subastaActiva.turnoActual] === participanteId) {
                        ejecutarTurnoIA(participanteId);
                    }
                }, tiempoEspera);
            }
            
            actualizarInterfaz();
            return;
        }
        
        subastaActiva.turnoActual = (subastaActiva.turnoActual + 1) % subastaActiva.participantesActivos.length;
        intentos++;
    }
    
    // Si todos pasaron, cerrar subasta
    cerrarSubasta();
}

function pasarTurno() {
    detenerTemporizador();
    
    const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual];
    
    if (!subastaActiva.participantesQuePasaron.includes(participanteActualId)) {
        subastaActiva.participantesQuePasaron.push(participanteActualId);
        mostrarMensaje(`⏭️ <b>${PARTICIPANTES[participanteActualId].nombre}</b> pasó su turno.`, 'alerta');
    }
    
    // Verificar si solo queda un participante activo
    if (subastaActiva.participantesQuePasaron.length >= subastaActiva.participantesActivos.length - 1) {
        cerrarSubasta();
        return;
    }
    
    // Pasar al siguiente turno
    subastaActiva.turnoActual = (subastaActiva.turnoActual + 1) % subastaActiva.participantesActivos.length;
    empezarTurno();
}

function cerrarSubasta() {
    detenerTemporizador();
    
    if (subastaActiva.postorActualId === null || subastaActiva.ofertaActual === 0) {
        subastaActiva.postorActualId = null;
    }
    
    subastaActiva.revelacionPendiente = true;
    mostrarMensaje("🔒 <b>--- SUBASTA CERRADA ---</b> Presiona REVELAR JUGADOR para ver el resultado.", 'info');
    actualizarInterfaz();
}

// --- 5. LÓGICA DE PUJA ---

function pujar(monto, postorId = 'player') {
    if (subastaActiva.revelacionPendiente) return;
    
    // Verificar que sea el turno del postor
    const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual];
    if (participanteActualId !== postorId) {
        if (postorId === 'player') {
            mostrarMensaje('❌ No es tu turno.', 'alerta');
        }
        return;
    }

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

    // Resetear los que pasaron (todos vuelven a estar activos)
    subastaActiva.participantesQuePasaron = [];

    actualizarInterfaz();
    mostrarMensaje(`📈 <b>[${postor.nombre}]</b> puja con <b>${formatoDinero(monto)}</b>.`, 'ganador');

    // Pasar al siguiente turno
    detenerTemporizador();
    subastaActiva.turnoActual = (subastaActiva.turnoActual + 1) % subastaActiva.participantesActivos.length;
    
    setTimeout(() => empezarTurno(), 1500);
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

function ejecutarTurnoIA(iaId) {
    if (subastaActiva.revelacionPendiente) return;
    if (subastaActiva.participantesActivos[subastaActiva.turnoActual] !== iaId) return;

    const ia = PARTICIPANTES[iaId];
    const precioSugerido = subastaActiva.jugadorOculto.precio_sugerido;
    const topePuja = iaId === 'ia1' ? subastaActiva.topePujaIA1 : subastaActiva.topePujaIA2;

    // Lógica de Salto (15% conservadora, 10% agresiva)
    const probabilidadSalto = ia.perfil === 'conservadora' ? 0.15 : 0.10;
    if (!ia.salto_usado && Math.random() < probabilidadSalto) {
        ia.salto_usado = true;
        mostrarMensaje(`⏭️ <b>[${ia.nombre}]</b> usa su SALTO y pasa esta subasta.`, 'alerta');
        pasarTurno();
        return;
    }

    // Decidir si puja o pasa
    const ofertaMinima = subastaActiva.ofertaActual + 1000000;
    
    if (ofertaMinima > topePuja || ofertaMinima > ia.presupuesto) {
        mostrarMensaje(`🚫 <b>[${ia.nombre}]</b> se retira de la puja.`);
        pasarTurno();
        return;
    }

    // Calcular nueva oferta
    let incrementoBase = Math.floor(Math.random() * 3 + 1) * 1000000;
    if (ia.perfil === 'agresiva') {
        incrementoBase = Math.floor(Math.random() * 5 + 2) * 1000000;
    }
    
    const nuevaOferta = Math.min(ofertaMinima + incrementoBase, topePuja, ia.presupuesto);
    
    pujar(nuevaOferta, iaId);
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
    
    // Verificar que sea tu turno
    const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual];
    if (participanteActualId !== 'player') {
        mostrarMensaje('❌ No es tu turno.', 'alerta');
        return;
    }
    
    player.salto_usado = true;
    mostrarMensaje('⏭️ Has usado tu SALTO. Pasas esta subasta.', 'alerta');
    
    pasarTurno();
}

// --- 6. REVELACIÓN Y AVANCE ---

function revelarJugador() {
    if (!subastaActiva.revelacionPendiente) return;
    
    detenerTemporizador();

    const jugadorReal = subastaActiva.jugadorOculto;
    const precio = subastaActiva.ofertaActual;

    mostrarMensaje(`<br>🥁 <b>¡REVELACIÓN!</b> El jugador era <b>${jugadorReal.nombre}</b> (Media: ${jugadorReal.media}, Puesto: ${jugadorReal.puesto})`, 'ganador');

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
        ganador.posicionesOcupadas.push(jugadorReal.puesto);
        
        if (typeof TODOS_LOS_JUGADORES !== 'undefined') {
            const jugadorGlobal = TODOS_LOS_JUGADORES.find(j => j.id === jugadorReal.id);
            if (jugadorGlobal) jugadorGlobal.vendido = true;
        }

        mostrarMensaje(`🏆 ¡<b>${ganador.nombre}</b> ganó y pagó <b>${formatoDinero(precio)}</b>! Posición ocupada: ${jugadorReal.puesto}`, 'ganador');
    }
    
    subastaActiva.revelacionPendiente = false;
    subastaActiva.jugadorOculto = null;
    subastaActiva.jugadorPublico = null;
    actualizarInterfaz();
    
    setTimeout(iniciarSiguienteSubasta, 3000); 
}

function iniciarSiguienteSubasta() {
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        mostrarMensaje('❌ No hay jugadores disponibles.', 'alerta');
        return;
    }

    // Verificar si todos completaron sus equipos
    const todosCompletos = Object.values(PARTICIPANTES).every(p => 
        p.posicionesOcupadas.length >= POSICIONES_REQUERIDAS.length
    );
    
    if (todosCompletos) {
        mostrarMensaje('🎉 <b>¡JUEGO TERMINADO!</b> Todos completaron sus equipos.', 'ganador');
        mostrarResumenFinal();
        return;
    }

    const disponibles = TODOS_LOS_JUGADORES.filter(j => !j.vendido);
    
    if (disponibles.length === 0) {
        mostrarMensaje('🎉 <b>¡JUEGO TERMINADO!</b> No hay más jugadores.', 'ganador');
        mostrarResumenFinal();
        return;
    }

    // Seleccionar jugador aleatorio
    const jugadorSeleccionado = disponibles[Math.floor(Math.random() * disponibles.length)];
    
    subastaActiva.rondaActual++;
    subastaActiva.jugadorOculto = jugadorSeleccionado;
    subastaActiva.jugadorPublico = {
        puesto: jugadorSeleccionado.puesto,
        precio_sugerido: jugadorSeleccionado.precio_sugerido
    };
    subastaActiva.ofertaActual = 0;
    subastaActiva.postorActualId = null;
    subastaActiva.participantesQuePasaron = [];
    subastaActiva.revelacionPendiente = false;
    
    subastaActiva.topePujaIA1 = calcularTopePuja('conservadora', jugadorSeleccionado.precio_sugerido);
    subastaActiva.topePujaIA2 = calcularTopePuja('agresiva', jugadorSeleccionado.precio_sugerido);
    
    actualizarInterfaz();
    mostrarMensaje(`<br>--- 🏁 <b>RONDA ${subastaActiva.rondaActual}</b> ---`, 'info');
    mostrarMensaje(`📢 Subasta: <b>Jugador Misterioso (${jugadorSeleccionado.puesto})</b> - Precio: ${formatoDinero(jugadorSeleccionado.precio_sugerido)}`, 'info');
    
    iniciarTurnos();
}

function mostrarResumenFinal() {
    mostrarMensaje('<br>=== 📊 <b>RESUMEN FINAL</b> ===', 'ganador');
    
    Object.values(PARTICIPANTES).forEach(p => {
        const totalGastado = 100000000 - p.presupuesto;
        mostrarMensaje(`<b>${p.nombre}</b>: ${p.equipo.length} jugadores (${p.posicionesOcupadas.join(', ')}) - Gastó: ${formatoDinero(totalGastado)}`, 'info');
    });
}

// --- 7. INTERFAZ ---

function actualizarInterfaz() {
    const jugador = subastaActiva.jugadorPublico;
    const postorNombre = subastaActiva.postorActualId ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie';
    
    const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual];
    const esTuTurno = participanteActualId === 'player' && !subastaActiva.revelacionPendiente;

    const infoSubasta = document.getElementById('info-subasta');
    if (infoSubasta) {
        infoSubasta.innerHTML = `
            <h2>En Subasta: ${subastaActiva.revelacionPendiente ? '🔒 CERRADA' : (jugador ? `🎭 Jugador Misterioso (${jugador.puesto})` : '⏳ Esperando...')}</h2>
            <p>Precio Sugerido: <b>${jugador ? formatoDinero(jugador.precio_sugerido) : 'N/A'}</b></p>
            <p>Oferta Actual: <b style="color: red; font-size: 1.5em;">${formatoDinero(subastaActiva.ofertaActual)}</b> (Postor: ${postorNombre})</p>
            ${!subastaActiva.revelacionPendiente && participanteActualId ? `<p style="background: ${esTuTurno ? '#4CAF50' : '#FF9800'}; color: white; padding: 10px; border-radius: 5px; font-weight: bold;">⏰ TURNO: ${PARTICIPANTES[participanteActualId].nombre} (${subastaActiva.tiempoRestante}s)</p>` : ''}
        `;
    }

    const infoParticipantes = document.getElementById('info-participantes');
    if (infoParticipantes) {
        infoParticipantes.innerHTML = `
            <h3>💰 Presupuestos y Equipos</h3>
            <p><b>${PARTICIPANTES.player.nombre}</b>: ${formatoDinero(PARTICIPANTES.player.presupuesto)} | Equipo: ${PARTICIPANTES.player.equipo.length} (${PARTICIPANTES.player.posicionesOcupadas.join(', ') || 'Ninguna'}) | Salto: ${PARTICIPANTES.player.salto_usado ? '✅' : '⭕'}</p>
            <p>${PARTICIPANTES.ia1.nombre}: ${formatoDinero(PARTICIPANTES.ia1.presupuesto)} | Equipo: ${PARTICIPANTES.ia1.equipo.length} (${PARTICIPANTES.ia1.posicionesOcupadas.join(', ') || 'Ninguna'}) | Salto: ${PARTICIPANTES.ia1.salto_usado ? '✅' : '⭕'}</p>
            <p>${PARTICIPANTES.ia2.nombre}: ${formatoDinero(PARTICIPANTES.ia2.presupuesto)} | Equipo: ${PARTICIPANTES.ia2.equipo.length} (${PARTICIPANTES.ia2.posicionesOcupadas.join(', ') || 'Ninguna'}) | Salto: ${PARTICIPANTES.ia2.salto_usado ? '✅' : '⭕'}</p>
            
            ${subastaActiva.revelacionPendiente ? `<button onclick="revelarJugador()" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 10px;">🎁 REVELAR JUGADOR</button>` : ''}
        `;
    }
    
    const input = document.getElementById('input-puja');
    const botonPuja = document.getElementById('boton-puja');
    const botonSalto = document.getElementById('boton-salto');

    const deshabilitar = !esTuTurno || subastaActiva.revelacionPendiente;
    
    if (input) input.disabled = deshabilitar;
    if (botonPuja) botonPuja.disabled = deshabilitar;
    if (botonSalto) botonSalto.disabled = deshabilitar || PARTICIPANTES.player.salto_usado;
}

// Exponer funciones globalmente
window.revelarJugador = revelarJugador; 
window.pujarManual = pujarManual;
window.usarSalto = usarSalto;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        mostrarMensaje('⚠️ <b>ERROR:</b> No se encontró jugadores.js', 'alerta');
    } else {
        mostrarMensaje('✅ Juego cargado. ¡Empezando!', 'info');
        setTimeout(iniciarSiguienteSubasta, 1000);
    }
});

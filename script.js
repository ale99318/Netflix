// =======================================================
// SUBASTA POR RONDAS DE POSICIÓN (N+1 Jugadores)
// =======================================================

// --- 1. CONFIGURACIÓN ---

const POSICIONES_REQUERIDAS = ['POR', 'LI', 'DFC', 'LD', 'MCD', 'MC', 'EI', 'ED', 'MP', 'DC', 'EXT'];
const NUM_PARTICIPANTES = 3;
const JUGADORES_POR_POSICION = NUM_PARTICIPANTES + 1; // 4 jugadores por posición

const PARTICIPANTES = {
    player: { 
        id: 'player', 
        nombre: 'Jugador Humano', 
        presupuesto: 100000000, 
        equipo: [], 
        posicionesOcupadas: [],
        salto_usado: false
    },
    ia1: { 
        id: 'ia1', 
        nombre: 'Juancito', 
        presupuesto: 100000000, 
        equipo: [], 
        posicionesOcupadas: [],
        perfil: 'conservadora', 
        salto_usado: false
    },
    ia2: { 
        id: 'ia2', 
        nombre: 'FelixDeportes', 
        presupuesto: 100000000, 
        equipo: [], 
        posicionesOcupadas: [],
        perfil: 'agresiva', 
        salto_usado: false
    }
};

// --- 2. ESTADO DEL JUEGO ---

let estadoJuego = {
    posicionActualIndex: 0,
    posicionActual: null,
    jugadoresSubastadosEnRonda: 0,
    jugadoresDisponiblesRonda: [],
    
    // Subasta individual actual
    jugadorOculto: null,
    jugadorPublico: null,
    ofertaActual: 0,
    postorActualId: null,
    topePujaIA1: 0,
    topePujaIA2: 0,
    
    // Sistema de turnos
    turnoActual: 0,
    ordenTurnos: ['player', 'ia1', 'ia2'],
    participantesActivos: [],
    participantesQuePasaron: [],
    
    // Temporizador
    tiempoRestante: 10,
    intervalTemporizador: null,
    
    revelacionPendiente: false,
    revelacionEnProceso: false
};

// --- 3. UTILIDADES ---

function formatoDinero(num) {
    if (num === null || num === undefined) return '$0.0M';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    return `${sign}$${(absNum / 1000000).toFixed(1)}M`;
}

function calcularTopePuja(perfil, precioSugerido, jugadoresRestantes, participantesRestantes) {
    let factor;
    
    // Si es situación crítica (último jugador o pocos restantes)
    if (jugadoresRestantes <= participantesRestantes) {
        factor = perfil === 'conservadora' ? 
            Math.random() * (1.10 - 0.90) + 0.90 : 
            Math.random() * (1.30 - 1.00) + 1.00;
    } else {
        factor = perfil === 'conservadora' ? 
            Math.random() * (0.95 - 0.60) + 0.60 : 
            Math.random() * (1.20 - 0.90) + 0.90;
    }
    
    const topeBruto = precioSugerido * factor;
    return Math.floor(topeBruto / 1000000) * 1000000;
}

function mostrarMensaje(texto, tipo = 'normal') {
    const log = document.getElementById('log-subasta');
    if (!log) return;
    
    const mensaje = document.createElement('p');
    mensaje.innerHTML = texto;
    mensaje.style.margin = '5px 0';
    
    if (tipo === 'ganador') mensaje.style.color = '#4CAF50';
    if (tipo === 'info') mensaje.style.color = '#2196F3';
    if (tipo === 'alerta') mensaje.style.color = '#FF9800';
    if (tipo === 'turno') mensaje.style.fontWeight = 'bold';
    if (tipo === 'ronda') {
        mensaje.style.fontWeight = 'bold';
        mensaje.style.fontSize = '1.2em';
        mensaje.style.color = '#9C27B0';
    }
    
    log.appendChild(mensaje);
    log.scrollTop = log.scrollHeight;
}

function necesitaPosicion(participanteId, posicion) {
    return !PARTICIPANTES[participanteId].posicionesOcupadas.includes(posicion);
}

function contarParticipantesNecesitanPosicion(posicion) {
    return estadoJuego.ordenTurnos.filter(id => necesitaPosicion(id, posicion)).length;
}

// --- 4. SISTEMA DE TEMPORIZADOR ---

function iniciarTemporizador() {
    detenerTemporizador();
    estadoJuego.tiempoRestante = 10;
    actualizarInterfaz();
    
    estadoJuego.intervalTemporizador = setInterval(() => {
        estadoJuego.tiempoRestante--;
        actualizarInterfaz();
        
        if (estadoJuego.tiempoRestante <= 0) {
            detenerTemporizador();
            pasarTurno();
        }
    }, 1000);
}

function detenerTemporizador() {
    if (estadoJuego.intervalTemporizador) {
        clearInterval(estadoJuego.intervalTemporizador);
        estadoJuego.intervalTemporizador = null;
    }
}

// --- 5. INICIAR RONDA DE POSICIÓN ---

function iniciarRondaPosicion() {
    if (estadoJuego.posicionActualIndex >= POSICIONES_REQUERIDAS.length) {
        mostrarMensaje('🎉🎉🎉 <b>¡JUEGO COMPLETADO!</b> Todas las posiciones han sido cubiertas.', 'ganador');
        mostrarResumenFinal();
        return;
    }
    
    estadoJuego.posicionActual = POSICIONES_REQUERIDAS[estadoJuego.posicionActualIndex];
    estadoJuego.jugadoresSubastadosEnRonda = 0;
    
    // Obtener jugadores disponibles de esta posición
    if (typeof TODOS_LOS_JUGADORES === 'undefined') {
        mostrarMensaje('❌ ERROR: No se encontró TODOS_LOS_JUGADORES', 'alerta');
        return;
    }
    
    estadoJuego.jugadoresDisponiblesRonda = TODOS_LOS_JUGADORES.filter(j => 
        j.puesto === estadoJuego.posicionActual && !j.vendido
    );
    
    if (estadoJuego.jugadoresDisponiblesRonda.length < JUGADORES_POR_POSICION) {
        mostrarMensaje(`⚠️ Solo hay ${estadoJuego.jugadoresDisponiblesRonda.length} jugadores de ${estadoJuego.posicionActual}. Saltando...`, 'alerta');
        estadoJuego.posicionActualIndex++;
        setTimeout(iniciarRondaPosicion, 2000);
        return;
    }
    
    const participantesNecesitan = contarParticipantesNecesitanPosicion(estadoJuego.posicionActual);
    
    mostrarMensaje(`<br>═══════════════════════════════════════`, 'ronda');
    mostrarMensaje(`🏆 <b>NUEVA RONDA: ${estadoJuego.posicionActual}</b>`, 'ronda');
    mostrarMensaje(`📊 Se subastarán ${JUGADORES_POR_POSICION} jugadores`, 'info');
    mostrarMensaje(`👥 ${participantesNecesitan} participantes necesitan esta posición`, 'info');
    mostrarMensaje(`═══════════════════════════════════════<br>`, 'ronda');
    
    setTimeout(() => iniciarSubastaIndividual(), 2000);
}

// --- 6. SUBASTA INDIVIDUAL ---

function iniciarSubastaIndividual() {
    // Verificar si la ronda terminó
    if (estadoJuego.jugadoresSubastadosEnRonda >= JUGADORES_POR_POSICION) {
        finalizarRondaPosicion();
        return;
    }
    
    // Verificar si todos ya tienen la posición
    const participantesNecesitan = contarParticipantesNecesitanPosicion(estadoJuego.posicionActual);
    if (participantesNecesitan === 0) {
        finalizarRondaPosicion();
        return;
    }
    
    // Seleccionar jugador aleatorio de los disponibles
    const disponibles = estadoJuego.jugadoresDisponiblesRonda.filter(j => !j.vendido);
    if (disponibles.length === 0) {
        finalizarRondaPosicion();
        return;
    }
    
    const jugadorSeleccionado = disponibles[Math.floor(Math.random() * disponibles.length)];
    
    // Configurar subasta
    estadoJuego.jugadorOculto = jugadorSeleccionado;
    estadoJuego.jugadorPublico = {
        puesto: jugadorSeleccionado.puesto,
        precio_sugerido: jugadorSeleccionado.precio_sugerido
    };
    estadoJuego.ofertaActual = 0;
    estadoJuego.postorActualId = null;
    estadoJuego.participantesQuePasaron = [];
    estadoJuego.revelacionPendiente = false;
    estadoJuego.revelacionEnProceso = false;
    
    // Calcular jugadores restantes y participantes que aún necesitan
    const jugadoresRestantes = disponibles.length;
    const participantesRestantes = participantesNecesitan;
    
    // Calcular topes para IAs (ajustados según urgencia)
    estadoJuego.topePujaIA1 = calcularTopePuja('conservadora', jugadorSeleccionado.precio_sugerido, jugadoresRestantes, participantesRestantes);
    estadoJuego.topePujaIA2 = calcularTopePuja('agresiva', jugadorSeleccionado.precio_sugerido, jugadoresRestantes, participantesRestantes);
    
    mostrarMensaje(`<br>--- 📢 <b>SUBASTA ${estadoJuego.jugadoresSubastadosEnRonda + 1}/${JUGADORES_POR_POSICION}</b> de ${estadoJuego.posicionActual} ---`, 'info');
    mostrarMensaje(`🎭 Jugador Misterioso | 💰 Precio Sugerido: ${formatoDinero(jugadorSeleccionado.precio_sugerido)}`, 'info');
    mostrarMensaje(`📊 Quedan ${jugadoresRestantes} jugadores | ${participantesRestantes} participantes sin posición`, 'alerta');
    
    actualizarInterfaz();
    
    setTimeout(() => iniciarTurnos(), 2000);
}

// --- 7. SISTEMA DE TURNOS ---

function iniciarTurnos() {
    // Filtrar solo los que necesitan esta posición
    estadoJuego.participantesActivos = estadoJuego.ordenTurnos.filter(id => 
        necesitaPosicion(id, estadoJuego.posicionActual)
    );
    
    if (estadoJuego.participantesActivos.length === 0) {
        cerrarSubasta();
        return;
    }
    
    estadoJuego.participantesQuePasaron = [];
    estadoJuego.turnoActual = 0;
    
    empezarTurno();
}

function empezarTurno() {
    if (estadoJuego.revelacionPendiente) return;
    
    // CORRECCIÓN 2: Verificar cierre antes de empezar turno
    const participantesActivos = estadoJuego.participantesActivos.filter(
        id => !estadoJuego.participantesQuePasaron.includes(id)
    );
    
    if (participantesActivos.length === 0) {
        cerrarSubasta();
        return;
    }
    
    if (participantesActivos.length === 1) {
        if (estadoJuego.postorActualId && participantesActivos[0] === estadoJuego.postorActualId) {
            mostrarMensaje(`🏆 <b>${PARTICIPANTES[estadoJuego.postorActualId].nombre}</b> gana automáticamente!`, 'ganador');
            setTimeout(() => cerrarSubasta(), 1500);
            return;
        }
    }
    
    // Encontrar el siguiente participante activo que no haya pasado
    let intentos = 0;
    while (intentos < estadoJuego.participantesActivos.length) {
        const participanteId = estadoJuego.participantesActivos[estadoJuego.turnoActual];
        
        if (!estadoJuego.participantesQuePasaron.includes(participanteId)) {
            const participante = PARTICIPANTES[participanteId];
            mostrarMensaje(`<br>⏰ <b>TURNO: ${participante.nombre}</b> (10 segundos)`, 'turno');
            
            iniciarTemporizador();
            
            if (participanteId !== 'player') {
                const tiempoEspera = Math.random() * 3000 + 5000;
                setTimeout(() => {
                    if (estadoJuego.participantesActivos[estadoJuego.turnoActual] === participanteId) {
                        ejecutarTurnoIA(participanteId);
                    }
                }, tiempoEspera);
            }
            
            actualizarInterfaz();
            return;
        }
        
        estadoJuego.turnoActual = (estadoJuego.turnoActual + 1) % estadoJuego.participantesActivos.length;
        intentos++;
    }
    
    // Si llegamos aquí, todos pasaron
    cerrarSubasta();
}

function pasarTurno() {
    detenerTemporizador();
    
    const participanteActualId = estadoJuego.participantesActivos[estadoJuego.turnoActual];
    
    if (!estadoJuego.participantesQuePasaron.includes(participanteActualId)) {
        estadoJuego.participantesQuePasaron.push(participanteActualId);
        mostrarMensaje(`⏭️ <b>${PARTICIPANTES[participanteActualId].nombre}</b> pasó su turno.`, 'alerta');
    }
    
    // CORRECCIÓN 2: Verificar condición de cierre inmediato
    const participantesActivos = estadoJuego.participantesActivos.filter(
        id => !estadoJuego.participantesQuePasaron.includes(id)
    );
    
    // Si no queda nadie activo o solo queda el postor actual
    if (participantesActivos.length === 0) {
        cerrarSubasta();
        return;
    }
    
    if (participantesActivos.length === 1) {
        if (estadoJuego.postorActualId && participantesActivos[0] === estadoJuego.postorActualId) {
            // Solo queda el postor actual, gana automáticamente
            mostrarMensaje(`🏆 <b>${PARTICIPANTES[estadoJuego.postorActualId].nombre}</b> gana por ser el único que queda!`, 'ganador');
            setTimeout(() => cerrarSubasta(), 1500);
            return;
        }
    }
    
    // Si todavía hay 2 o más activos, continuar con el siguiente turno
    if (participantesActivos.length >= 2 || 
        (participantesActivos.length === 1 && estadoJuego.postorActualId === null)) {
        estadoJuego.turnoActual = (estadoJuego.turnoActual + 1) % estadoJuego.participantesActivos.length;
        setTimeout(() => empezarTurno(), 2000);
        return;
    }
    
    // En cualquier otro caso, cerrar
    cerrarSubasta();
}

function cerrarSubasta() {
    detenerTemporizador();
    
    if (estadoJuego.postorActualId === null) {
        estadoJuego.ofertaActual = 0;
    }
    
    estadoJuego.revelacionPendiente = true;
    mostrarMensaje("🔒 <b>SUBASTA CERRADA</b> - Presiona REVELAR JUGADOR", 'info');
    actualizarInterfaz();
}

// --- 8. LÓGICA DE PUJA ---

function pujar(monto, postorId = 'player') {
    if (estadoJuego.revelacionPendiente) return;
    
    const participanteActualId = estadoJuego.participantesActivos[estadoJuego.turnoActual];
    if (participanteActualId !== postorId) {
        if (postorId === 'player') {
            mostrarMensaje('❌ No es tu turno.', 'alerta');
        }
        return;
    }

    const postor = PARTICIPANTES[postorId];
    
    if (monto > postor.presupuesto) {
        if (postorId === 'player') {
            mostrarMensaje('❌ No tienes suficiente presupuesto.', 'alerta');
        }
        return;
    }
    
    if (monto <= estadoJuego.ofertaActual) {
        if (postorId === 'player') {
            mostrarMensaje('❌ La oferta debe ser mayor a la actual.', 'alerta');
        }
        return;
    }

    estadoJuego.ofertaActual = monto;
    estadoJuego.postorActualId = postorId;
    
    // CORRECCIÓN 1: NO limpiar participantesQuePasaron
    // Una vez que alguien pasa, permanece fuera de esta subasta

    actualizarInterfaz();
    mostrarMensaje(`📈 <b>${postor.nombre}</b> puja <b>${formatoDinero(monto)}</b>`, 'ganador');

    // CORRECCIÓN 2: Verificar cierre inmediato si solo queda 1 activo
    const participantesActivos = estadoJuego.participantesActivos.filter(
        id => !estadoJuego.participantesQuePasaron.includes(id)
    );
    
    if (participantesActivos.length === 1 && participantesActivos[0] === postorId) {
        // Solo queda el postor actual, cerrar subasta inmediatamente
        detenerTemporizador();
        mostrarMensaje(`🏆 <b>${postor.nombre}</b> es el único que queda. ¡Subasta ganada!`, 'ganador');
        setTimeout(() => cerrarSubasta(), 1500);
        return;
    }

    detenerTemporizador();
    estadoJuego.turnoActual = (estadoJuego.turnoActual + 1) % estadoJuego.participantesActivos.length;
    
    setTimeout(() => empezarTurno(), 2000);
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
    if (estadoJuego.revelacionPendiente) return;
    if (estadoJuego.participantesActivos[estadoJuego.turnoActual] !== iaId) return;

    const ia = PARTICIPANTES[iaId];
    const precioSugerido = estadoJuego.jugadorOculto.precio_sugerido;
    const topePuja = iaId === 'ia1' ? estadoJuego.topePujaIA1 : estadoJuego.topePujaIA2;
    
    // Calcular situación crítica
    const jugadoresRestantes = estadoJuego.jugadoresDisponiblesRonda.filter(j => !j.vendido).length;
    const participantesRestantes = contarParticipantesNecesitanPosicion(estadoJuego.posicionActual);
    const esSituacionCritica = jugadoresRestantes <= participantesRestantes;

    // Salto solo si NO es situación crítica
    if (!esSituacionCritica && !ia.salto_usado) {
        const probabilidadSalto = ia.perfil === 'conservadora' ? 0.15 : 0.10;
        if (Math.random() < probabilidadSalto) {
            ia.salto_usado = true;
            mostrarMensaje(`⏭️ <b>${ia.nombre}</b> usa su SALTO`, 'alerta');
            pasarTurno();
            return;
        }
    }

    const ofertaMinima = estadoJuego.ofertaActual + 1000000;
    
    // Si es situación crítica, DEBE pujar si puede
    if (esSituacionCritica) {
        if (ofertaMinima <= ia.presupuesto && ofertaMinima <= topePuja) {
            const nuevaOferta = Math.min(ofertaMinima + 1000000, topePuja, ia.presupuesto);
            pujar(nuevaOferta, iaId);
            return;
        }
    }
    
    // Lógica normal
    if (ofertaMinima > topePuja || ofertaMinima > ia.presupuesto) {
        mostrarMensaje(`🚫 <b>${ia.nombre}</b> se retira`, 'alerta');
        pasarTurno();
        return;
    }

    let incremento = Math.floor(Math.random() * 3 + 1) * 1000000;
    if (ia.perfil === 'agresiva') {
        incremento = Math.floor(Math.random() * 5 + 2) * 1000000;
    }
    
    const nuevaOferta = Math.min(ofertaMinima + incremento, topePuja, ia.presupuesto);
    pujar(nuevaOferta, iaId);
}

function usarSalto() {
    const player = PARTICIPANTES.player;
    
    if (player.salto_usado) {
        mostrarMensaje('❌ Ya usaste tu salto.', 'alerta');
        return;
    }
    
    const participanteActualId = estadoJuego.participantesActivos[estadoJuego.turnoActual];
    if (participanteActualId !== 'player') {
        mostrarMensaje('❌ No es tu turno.', 'alerta');
        return;
    }
    
    player.salto_usado = true;
    mostrarMensaje('⏭️ Has usado tu SALTO', 'alerta');
    pasarTurno();
}

// --- 9. REVELACIÓN ---

function revelarJugador() {
    if (!estadoJuego.revelacionPendiente || estadoJuego.revelacionEnProceso) return;
    
    estadoJuego.revelacionEnProceso = true;
    detenerTemporizador();
    actualizarInterfaz();
    
    const jugadorReal = estadoJuego.jugadorOculto;
    const precio = estadoJuego.ofertaActual;
    
    mostrarMensaje(`<br>🥁🥁🥁 <b>¡REVELACIÓN!</b> 🥁🥁🥁`, 'ganador');
    
    setTimeout(() => {
        mostrarMensaje(`<br>🎭 El jugador era... <b style="font-size: 1.3em; color: #4CAF50;">${jugadorReal.nombre}</b>!`, 'ganador');
        mostrarMensaje(`📊 Media: <b>${jugadorReal.media}</b> | Puesto: <b>${jugadorReal.puesto}</b>`, 'info');

        if (estadoJuego.postorActualId === null || precio === 0) {
            mostrarMensaje(`<br>❌ Nadie lo quiso. <b>${jugadorReal.nombre}</b> no se vendió.`, 'alerta');
        } else {
            const ganador = PARTICIPANTES[estadoJuego.postorActualId];

            ganador.presupuesto -= precio;
            ganador.equipo.push({ 
                nombre: jugadorReal.nombre, 
                media: jugadorReal.media, 
                puesto: jugadorReal.puesto,
                precio: precio
            });
            ganador.posicionesOcupadas.push(jugadorReal.puesto);
            
            jugadorReal.vendido = true;

            mostrarMensaje(`<br>🏆 <b>${ganador.nombre}</b> GANÓ!`, 'ganador');
            mostrarMensaje(`💰 Pagó: <b>${formatoDinero(precio)}</b>`, 'ganador');
            mostrarMensaje(`✅ Posición ocupada: <b>${jugadorReal.puesto}</b>`, 'info');
        }
        
        estadoJuego.jugadoresSubastadosEnRonda++;
        
        setTimeout(() => {
            mostrarMensaje(`<br><button onclick="continuarSiguiente()" style="padding: 15px 30px; background: #2196F3; color: white; border: none; cursor: pointer; font-size: 18px; font-weight: bold; border-radius: 8px;">➡️ CONTINUAR</button>`, 'info');
        }, 1500);
        
    }, 2000);
}

function continuarSiguiente() {
    estadoJuego.revelacionPendiente = false;
    estadoJuego.jugadorOculto = null;
    estadoJuego.jugadorPublico = null;
    estadoJuego.revelacionEnProceso = false;
    
    actualizarInterfaz();
    setTimeout(() => iniciarSubastaIndividual(), 1000);
}

function finalizarRondaPosicion() {
    mostrarMensaje(`<br>✅ <b>RONDA COMPLETADA: ${estadoJuego.posicionActual}</b>`, 'ganador');
    estadoJuego.posicionActualIndex++;
    setTimeout(() => iniciarRondaPosicion(), 3000);
}

function mostrarResumenFinal() {
    mostrarMensaje('<br>=== 📊 <b>RESUMEN FINAL</b> ===', 'ganador');
    
    Object.values(PARTICIPANTES).forEach(p => {
        const totalGastado = 100000000 - p.presupuesto;
        mostrarMensaje(`<b>${p.nombre}</b>: ${p.equipo.length} jugadores | Gastó: ${formatoDinero(totalGastado)}`, 'info');
    });
}

// --- 10. INTERFAZ ---

function actualizarInterfaz() {
    const jugador = estadoJuego.jugadorPublico;
    const postorNombre = estadoJuego.postorActualId ? PARTICIPANTES[estadoJuego.postorActualId].nombre : 'Nadie';
    const participanteActualId = estadoJuego.participantesActivos[estadoJuego.turnoActual];
    const esTuTurno = participanteActualId === 'player' && !estadoJuego.revelacionPendiente;

    const infoSubasta = document.getElementById('info-subasta');
    if (infoSubasta) {
        infoSubasta.innerHTML = `
            <h2>${estadoJuego.revelacionPendiente ? '🔒 CERRADA' : (jugador ? `🎭 Jugador Misterioso (${jugador.puesto})` : '⏳ Esperando...')}</h2>
            <p>Precio Sugerido: <b>${jugador ? formatoDinero(jugador.precio_sugerido) : 'N/A'}</b></p>
            <p>Oferta Actual: <b style="color: red; font-size: 1.5em;">${formatoDinero(estadoJuego.ofertaActual)}</b> (${postorNombre})</p>
            ${!estadoJuego.revelacionPendiente && participanteActualId ? `<p style="background: ${esTuTurno ? '#4CAF50' : '#FF9800'}; color: white; padding: 10px; border-radius: 5px; font-weight: bold;">⏰ TURNO: ${PARTICIPANTES[participanteActualId].nombre} (${estadoJuego.tiempoRestante}s)</p>` : ''}
            ${estadoJuego.posicionActual ? `<p style="font-size: 0.9em; color: #666;">📍 Ronda: ${estadoJuego.posicionActual} (${estadoJuego.jugadoresSubastadosEnRonda}/${JUGADORES_POR_POSICION})</p>` : ''}
        `;
    }

    const infoParticipantes = document.getElementById('info-participantes');
    if (infoParticipantes) {
        infoParticipantes.innerHTML = `
            <h3>💰 Presupuestos y Equipos</h3>
            <p><b>${PARTICIPANTES.player.nombre}</b>: ${formatoDinero(PARTICIPANTES.player.presupuesto)} | ${PARTICIPANTES.player.equipo.length} jugadores | Salto: ${PARTICIPANTES.player.salto_usado ? '✅' : '⭕'}</p>
            <p>${PARTICIPANTES.ia1.nombre}: ${formatoDinero(PARTICIPANTES.ia1.presupuesto)} | ${PARTICIPANTES.ia1.equipo.length} jugadores | Salto: ${PARTICIPANTES.ia1.salto_usado ? '✅' : '⭕'}</p>
            <p>${PARTICIPANTES.ia2.nombre}: ${formatoDinero(PARTICIPANTES.ia2.presupuesto)} | ${PARTICIPANTES.ia2.equipo.length} jugadores | Salto: ${PARTICIPANTES.ia2.salto_usado ? '✅' : '⭕'}</p>
            
            ${estadoJuego.revelacionPendiente && !estadoJuego.revelacionEnProceso ? `<button onclick="revelarJugador()" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 10px;">🎁 REVELAR JUGADOR</button>` : ''}
        `;
    }
    
    const input = document.getElementById('input-puja');
    const botonPuja = document.getElementById('boton-puja');
    const botonSalto = document.getElementById('boton-salto');

    const deshabilitar = !esTuTurno || estadoJuego.revelacionPendiente;
    
    if (input) input.disabled = deshabilitar;
    if (botonPuja) botonPuja.disabled = deshabilitar;
    if (botonSalto) botonSalto.disabled = deshabilitar || PARTICIPANTES.player.salto_usado;
}

// --- EXPORTAR FUNCIONES ---

window.revelarJugador = revelarJugador;
window.continuarSiguiente = continuarSiguiente;
window.pujarManual = pujarManual;
window.usarSalto = usarSalto;

// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', () => {
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        mostrarMensaje('❌ ERROR: No se encontró jugadores.js', 'alerta');
    } else {
        mostrarMensaje('✅ Juego cargado correctamente', 'info');
        setTimeout(() => iniciarRondaPosicion(), 1000);
    }
});

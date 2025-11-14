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
    // NUEVA BANDERA: Pausa el juego para la revelación
    revelacionPendiente: false 
};

// --- 2. FUNCIONES DE UTILIDAD Y LÓGICA DE LA IA (Mantener solo esta sección de utilidades) ---

function formatoDinero(num) {
    if (num === null) return '$0.0M';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    return `${sign}${(absNum / 1000000).toFixed(1)}M`;
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

// =======================================================
// --- 3. LÓGICA PRINCIPAL DEL JUEGO (REVISADA) ---
// =======================================================

function gestionarTurnoIA(iaId) {
    if (!subastaActiva.jugadorOculto || subastaActiva.revelacionPendiente) return;

    const ia = PARTICIPANTES[iaId];
    const precioSugerido = subastaActiva.jugadorOculto.precio_sugerido;
    const topePuja = iaId === 'ia1' ? subastaActiva.topePujaIA1 : subastaActiva.topePujaIA2;

    if (subastaActiva.participantesQuePasaron.includes(iaId)) {
        return; 
    }

    // Lógica de Salto y Puja aquí (la lógica es la misma)
    // ...

    // Si la IA decide pasar (por tope, presupuesto, o salto):
    if (/* Condiciones de pase de IA */ true) { // Simplificando por espacio, pero la lógica de decisión debe ser llamada aquí
        subastaActiva.participantesQuePasaron.push(iaId);
        verificarFinSubasta();
        return;
    }

    // Si la IA decide pujar:
    // pujar(nuevaOferta, iaId);
    // ...
}

function pujar(monto, postorId = 'player') {
    if (subastaActiva.revelacionPendiente) return;

    const postor = PARTICIPANTES[postorId];
    // ... (Validaciones)

    subastaActiva.ofertaActual = monto;
    subastaActiva.postorActualId = postorId;
    postor.ultimaPuja = monto;

    subastaActiva.participantesQuePasaron = subastaActiva.participantesActivos.filter(id => id === postorId);

    actualizarInterfaz();
    mostrarMensaje(`📈 [${postor.nombre}] puja con **${formatoDinero(monto)}**.`);

    if (postorId === 'player') {
        setTimeout(() => gestionarTurnoIA('ia1'), 1500); 
        setTimeout(() => gestionarTurnoIA('ia2'), 3000); 
    }
    
    // Dar un tiempo para que todas las IAs reaccionen antes de verificar el fin.
    clearTimeout(subastaActiva.timerFinSubasta);
    subastaActiva.timerFinSubasta = setTimeout(verificarFinSubasta, 4500); 
}

function verificarFinSubasta() {
    clearTimeout(subastaActiva.timerFinSubasta);
    if (!subastaActiva.jugadorOculto || subastaActiva.revelacionPendiente) return;

    // Condición de fin: Si el número de participantes que pasaron es igual al total de participantes activos
    // Y si el último postor es el único que no ha pasado, o si nadie ha pujado.
    if (subastaActiva.participantesQuePasaron.length === subastaActiva.participantesActivos.length ||
        (subastaActiva.postorActualId !== null && subastaActiva.participantesQuePasaron.length === subastaActiva.participantesActivos.length - 1)) 
    {
         // Si todos pasaron y no hubo postor, nadie lo gana (oferta 0).
         if(subastaActiva.postorActualId === null || subastaActiva.ofertaActual <= subastaActiva.jugadorOculto.precio_sugerido * 0.1) {
             subastaActiva.postorActualId = null; // Nadie lo ganó por falta de interés
         }
         
         // Entramos en la FASE DE PAUSA/REVELACIÓN
         subastaActiva.revelacionPendiente = true;
         mostrarMensaje("--- SUBASTA CERRADA --- Presiona REVELAR JUGADOR para ver el resultado.", 'info');
         actualizarInterfaz();
         return;
    }

    // Si el jugador humano aún no ha pasado y las IAs ya terminaron su turno:
    if (!subastaActiva.participantesQuePasaron.includes('player')) {
        // ... (Mensaje de turno)
    }
}


// =======================================================
// --- 4. NUEVA FASE DE REVELACIÓN Y AVANCE ---
// =======================================================

function revelarJugador() {
    if (!subastaActiva.revelacionPendiente) return;

    const jugadorReal = subastaActiva.jugadorOculto;
    const precio = subastaActiva.ofertaActual;

    mostrarMensaje(`🥁 ¡REVELACIÓN! El jugador era **${jugadorReal.nombre}** (Media: ${jugadorReal.media})`, 'ganador');

    if (subastaActiva.postorActualId === null || precio === 0) {
        mostrarMensaje(`❌ Nadie lo quiso. ${jugadorReal.nombre} no se vendió.`, 'info');
    } else {
        const ganador = PARTICIPANTES[subastaActiva.postorActualId];

        // Actualizar estado (solo si fue vendido)
        ganador.presupuesto -= precio;
        // Solo guardamos el nombre y datos esenciales, no el objeto completo si no es necesario
        ganador.equipo.push({ nombre: jugadorReal.nombre, media: jugadorReal.media, puesto: jugadorReal.puesto });
        
        const jugadorGlobal = TODOS_LOS_JUGADORES.find(j => j.id === jugadorReal.id);
        if (jugadorGlobal) jugadorGlobal.vendido = true;

        mostrarMensaje(`🏆 ¡${ganador.nombre} ha pagado ${formatoDinero(precio)} por el jugador!`, 'ganador');
    }
    
    // --- Limpieza y Avance ---
    subastaActiva.revelacionPendiente = false;
    subastaActiva.jugadorOculto = null;
    subastaActiva.jugadorPublico = null;
    actualizarInterfaz();
    
    // Iniciar la siguiente subasta después de un breve descanso
    setTimeout(iniciarSiguienteSubasta, 3000); 
}

// La función iniciarSiguienteSubasta debe mantenerse igual que en el código anterior.
// La función actualizarInterfaz debe modificarse para mostrar el botón de revelación.

// =======================================================
// --- 5. GESTIÓN DE LA INTERFAZ (AJUSTADA) ---
// =======================================================

function actualizarInterfaz() {
    const jugador = subastaActiva.jugadorPublico;
    const postorNombre = subastaActiva.postorActualId ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie';

    // 1. Actualizar la información de la subasta (#info-subasta)
    document.getElementById('info-subasta').innerHTML = `
        <h2>En Subasta: ${subastaActiva.revelacionPendiente ? 'SUBASTA CERRADA' : (jugador ? `Jugador: ${jugador.puesto}` : 'Esperando Siguiente...')}</h2>
        <p>Precio Sugerido: <b>${jugador ? formatoDinero(jugador.precio_sugerido) : 'N/A'}</b></p>
        <p>Oferta Actual: <b style="color: red; font-size: 1.5em;">${formatoDinero(subastaActiva.ofertaActual)}</b> (Postor: ${postorNombre})</p>
    `;

    // 2. Actualizar info de participantes (#info-participantes)
    document.getElementById('info-participantes').innerHTML = `
        <h3>Presupuestos y Equipos</h3>
        <p><b>${PARTICIPANTES.player.nombre}</b>: ${formatoDinero(PARTICIPANTES.player.presupuesto)} | Equipo: ${PARTICIPANTES.player.equipo.length} jugadores (Salto: ${PARTICIPANTES.player.salto_usado ? 'SI' : 'NO'})</p>
        <p>${PARTICIPANTES.ia1.nombre}: ${formatoDinero(PARTICIPANTES.ia1.presupuesto)} | Equipo: ${PARTICIPANTES.ia1.equipo.length} jugadores (Salto: ${PARTICIPANTES.ia1.salto_usado ? 'SI' : 'NO'})</p>
        <p>${PARTICIPANTES.ia2.nombre}: ${formatoDinco(PARTICIPANTES.ia2.presupuesto)} | Equipo: ${PARTICIPANTES.ia2.equipo.length} jugadores (Salto: ${PARTICIPANTES.ia2.salto_usado ? 'SI' : 'NO'})</p>
        
        ${subastaActiva.revelacionPendiente ? `<button onclick="revelarJugador()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; cursor: pointer;">REVELAR JUGADOR</button>` : ''}
    `;
    
    // 3. Controlar botones (deshabilitar durante la revelación o espera)
    const input = document.getElementById('input-puja');
    const botonPuja = document.getElementById('boton-puja');
    const botonSalto = document.getElementById('boton-salto');

    const deshabilitar = !subastaActiva.jugadorOculto || subastaActiva.revelacionPendiente;
    
    input.disabled = deshabilitar;
    botonPuja.disabled = deshabilitar;
    botonSalto.disabled = deshabilitar;
}

// Hacemos la nueva función accesible globalmente
window.revelarJugador = revelarJugador; 
window.pujarManual = pujarManual;
window.usarSalto = usarSalto;
window.verificarFinSubasta = verificarFinSubasta;


document.addEventListener('DOMContentLoaded', () => {
    // ... (Verificación de jugadores)
    iniciarSiguienteSubasta(); 
});

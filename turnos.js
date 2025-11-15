// =======================================================
// turnos.js - Gestión de turnos y condiciones de cierre
// =======================================================

import { subastaActiva, PARTICIPANTES, POSICIONES_REQUERIDAS, MAPEO_POSICIONES } from './config.js';
import { mostrarMensaje } from './utils.js';
import { detenerTemporizador, reiniciarTemporizador } from './temporizador.js'; // Necesario para controlar el flujo

// -----------------------------------------------------------------
// A. LÓGICA DE POSICIONES
// -----------------------------------------------------------------

// Determina si un participante todavía necesita cubrir una posición en particular.
export function necesitaPosicion(participanteId, posicionRequerida) {
    const participante = PARTICIPANTES[participanteId];
    // Verifica si la posición requerida (ej. 'POR') ya está en las posiciones ocupadas del equipo.
    return !participante.posicionesOcupadas.includes(posicionRequerida);
}

// Inicializa la lista de participantes activos para la subasta de la posición actual
export function iniciarTurnos() {
    const jugador = subastaActiva.jugadorOculto;
    if (!jugador) return;

    // Obtener la posición requerida del equipo (ej. 'POR') a partir del puesto del jugador (ej. 'POR')
    const posicionRequerida = MAPEO_POSICIONES[jugador.puesto];

    // Resetear el estado de turnos para la nueva subasta
    subastaActiva.participantesActivos = [];
    subastaActiva.participantesQuePasaron = [];
    subastaActiva.turnoActual = 0;

    // 1. Filtrar solo los participantes que NECESITAN esta posición.
    subastaActiva.ordenTurnos.forEach(id => {
        if (necesitaPosicion(id, posicionRequerida)) {
            subastaActiva.participantesActivos.push(id);
        }
    });

    if (subastaActiva.participantesActivos.length === 0) {
        mostrarMensaje(`Nadie necesita un ${posicionRequerida}. El jugador se retira.`, 'alerta');
        cerrarSubasta(false); // Cierra sin ganador
        return;
    }

    // 2. Si solo queda un activo, ese es el ganador por descarte (solo si la puja base es 0). 
    // Como ahora empezamos con precio sugerido, debe haber al menos 1 puja.
    
    // Iniciar el primer turno con el primer participante activo
    empezarTurno();
}

// -----------------------------------------------------------------
// B. GESTIÓN DE FLUJO Y CIERRE
// -----------------------------------------------------------------

export function empezarTurno() {
    // Si la subasta está pendiente de cierre, no se inicia un nuevo turno.
    if (subastaActiva.revelacionPendiente) return;
    
    // 1. Encontrar el siguiente participante que NO haya pasado
    let proximoParticipanteId = null;
    let intento = 0;
    const numActivos = subastaActiva.participantesActivos.length;

    while (intento < numActivos * 2) { // Evita bucles infinitos en caso de error
        const id = subastaActiva.participantesActivos[subastaActiva.turnoActual % numActivos];
        
        // El participante solo toma turno si NO ha pasado en esta subasta
        if (!subastaActiva.participantesQuePasaron.includes(id)) {
            proximoParticipanteId = id;
            break;
        }

        subastaActiva.turnoActual++;
        intento++;
    }

    if (proximoParticipanteId === null) {
        // Esto solo debería pasar si la lógica de cierre falló.
        mostrarMensaje('Error: Todos han pasado el turno, forzando cierre.', 'alerta');
        cerrarSubasta();
        return;
    }

    subastaActiva.turnoActual++;
    
    // 2. Ejecutar Turno
    subastaActiva.tiempoRestante = 10;
    
    if (proximoParticipanteId === 'player') {
        mostrarMensaje(`Tu turno. Puja o Pasa. Oferta actual: ${subastaActiva.ofertaActual > 0 ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie'}`, 'turno');
        reiniciarTemporizador();
    } else {
        mostrarMensaje(`Turno de la IA: ${PARTICIPANTES[proximoParticipanteId].nombre}`, 'info');
        detenerTemporizador();
        
        // Llamar a la lógica de IA (debe ser implementada en ia.js)
        setTimeout(() => {
             // Esta función será global en main.js o exportada
             window.ejecutarTurnoIA(proximoParticipanteId); 
        }, 1500); // Pequeño retraso para simular pensamiento de IA
    }
}

// Se llama cuando el tiempo se agota o un participante decide pasar.
export function pasarTurno(participanteId = 'player') {
    detenerTemporizador();
    
    // 1. Añadir al participante que pasó a la lista de exclusión.
    if (!subastaActiva.participantesQuePasaron.includes(participanteId)) {
        subastaActiva.participantesQuePasaron.push(participanteId);
        mostrarMensaje(`${PARTICIPANTES[participanteId].nombre} ha pasado el turno.`, 'info');
    }

    // 2. **CONDICIÓN DE CIERRE CRÍTICA (Ganador por descarte)**
    const numActivos = subastaActiva.participantesActivos.length;
    const numPasados = subastaActiva.participantesQuePasaron.length;

    // Si (Total de activos - Pasados) es 1, y el postor actual es ese 1 restante, GANA.
    // O si (Total de activos - Pasados) es 0 (solo ocurre si el último que faltaba por pujar pasa).
    if (numActivos - numPasados <= 1) {
        if (subastaActiva.postorActualId !== null) {
            mostrarMensaje(`🎉 ¡${PARTICIPANTES[subastaActiva.postorActualId].nombre} gana la subasta por descarte!`, 'ganador');
            cerrarSubasta();
        } else {
            // Caso donde la subasta es la primera (oferta = precio base) y todos pasaron.
            mostrarMensaje('La subasta termina sin ganador, nadie quiso el precio base.', 'alerta');
            cerrarSubasta(false);
        }
        return;
    }

    // 3. Continuar la subasta con el siguiente turno.
    empezarTurno();
}

// Finaliza la subasta actual, prepara el estado para el resumen.
export function cerrarSubasta(huboGanador = true) {
    detenerTemporizador();
    subastaActiva.revelacionPendiente = true;

    if (huboGanador) {
        // La lógica de pago y traspaso se realiza en revelacion.js
        mostrarMensaje('Subasta terminada. Revelación pendiente...', 'info');
        // Esta función será global en main.js o exportada
        window.actualizarInterfaz();
    } else {
        // Nadie ganó (jugador descartado)
        subastaActiva.jugadorOculto.vendido = true;
        subastaActiva.rondaActual++;
        // Esta función será global en main.js o exportada
        window.iniciarSiguienteSubasta(); 
    }
}

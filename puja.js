// =======================================================
// puja.js - Lógica de ofertas del jugador
// =======================================================

import { subastaActiva, PARTICIPANTES } from './config.js';
import { mostrarMensaje, formatoDinero } from './utils.js';
import { detenerTemporizador } from './temporizador.js';
import { empezarTurno, pasarTurno } from './turnos.js';

// NOTA: actualizarInterfaz y ejecutarTurnoIA serán globales (window.X)

/**
 * Función principal que procesa cualquier puja válida.
 */
export function pujar(monto, postorId) {
    if (subastaActiva.revelacionPendiente) return;

    // Verificar que sea el turno del postor
    const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual - 1];
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
            mostrarMensaje(`❌ La oferta debe ser mayor a ${formatoDinero(subastaActiva.ofertaActual)}.`, 'alerta');
        }
        return;
    }

    // Aceptar la puja
    subastaActiva.ofertaActual = monto;
    subastaActiva.postorActualId = postorId;
    postor.ultimaPuja = monto;

    // CORRECCIÓN CRÍTICA: NO resetear participantesQuePasaron.
    // Quien puja sigue activo, pero quien pasó permanece fuera de esta subasta.

    // Actualizar interfaz y notificar
    window.actualizarInterfaz();
    mostrarMensaje(`📈 <b>[${postor.nombre}]</b> puja con <b>${formatoDinero(monto)}</b>.`, 'ganador');

    // Pasar al siguiente turno
    detenerTemporizador();
    
    // El turno ya fue incrementado en empezarTurno, así que solo llamamos a empezarTurno con un pequeño delay
    setTimeout(() => empezarTurno(), 1500);
}

/**
 * Lógica para los botones de puja rápida.
 */
export function pujarConAumento(montoAumento) {
    if (subastaActiva.revelacionPendiente) return;

    const postorId = 'player';
    const postor = PARTICIPANTES[postorId];
    
    // La puja mínima debe ser la Oferta Actual + 1 Millón.
    const ofertaMinimaParaPujar = subastaActiva.ofertaActual + 1000000;
    
    // Si no hay oferta actual (solo el precio base), la nueva oferta es el precio base + el aumento.
    // Si ya hay una puja, la nueva oferta es la última puja + el aumento.
    
    // La puja base es la oferta actual + el monto de aumento
    const pujaBase = subastaActiva.ofertaActual + montoAumento;
    
    // Aseguramos que el monto final sea AL MENOS la oferta mínima para pujar.
    // Si la subasta está en 100M y el jugador presiona +1M, la puja debe ser 101M.
    const monto = Math.max(pujaBase, ofertaMinimaParaPujar); 
    
    if (monto > postor.presupuesto) {
         mostrarMensaje('❌ No tienes suficiente presupuesto para ese aumento.', 'alerta');
         return;
    }

    pujar(monto, postorId);
}

/**
 * Permite al jugador usar su Salto y pasar la subasta de forma permanente.
 */
export function usarSalto() {
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
    const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual - 1];
    if (participanteActualId !== 'player') {
        mostrarMensaje('❌ No es tu turno.', 'alerta');
        return;
    }
    
    player.salto_usado = true;
    mostrarMensaje('⏭️ Has usado tu SALTO. Pasas esta subasta.', 'alerta');
    
    pasarTurno('player');
}

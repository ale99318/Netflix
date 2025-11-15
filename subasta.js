// =======================================================
// subasta.js - Gestión de rondas y subastas
// =======================================================

import { subastaActiva, PARTICIPANTES, POSICIONES_REQUERIDAS } from './config.js';
import { mostrarMensaje, formatoDinero } from './utils.js';
import { calcularTopePuja } from './ia.js';
import { iniciarTurnos } from './turnos.js';

// NOTA: Asumimos que TODOS_LOS_JUGADORES está disponible globalmente (ej. cargado en jugadores.js antes de main.js)
// Y que actualizarInterfaz se exporta en main.js

/**
 * Inicia la siguiente ronda de subasta seleccionando un jugador disponible al azar.
 *
 * @returns {void}
 */
export function iniciarSiguienteSubasta() {
    // Verificar si la lista de jugadores está disponible
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        mostrarMensaje('❌ ERROR: No se encontró la lista de jugadores.js', 'alerta');
        return;
    }

    // --- 1. Chequeo de fin de juego ---

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
        mostrarMensaje('🎉 <b>¡JUEGO TERMINADO!</b> No hay más jugadores disponibles.', 'ganador');
        mostrarResumenFinal();
        return;
    }

    // --- 2. Selección e Inicialización ---

    // Seleccionar jugador aleatorio de los disponibles
    const jugadorSeleccionado = disponibles[Math.floor(Math.random() * disponibles.length)];
    
    subastaActiva.rondaActual++;
    subastaActiva.jugadorOculto = jugadorSeleccionado;
    
    // Inicialización del estado de la subasta
    subastaActiva.jugadorPublico = {
        puesto: jugadorSeleccionado.puesto,
        precio_sugerido: jugadorSeleccionado.precio_sugerido
    };
    
    // CORRECCIÓN CRÍTICA: La oferta actual comienza en el precio sugerido
    subastaActiva.ofertaActual = jugadorSeleccionado.precio_sugerido; 
    subastaActiva.postorActualId = null; 
    subastaActiva.participantesQuePasaron = [];
    subastaActiva.revelacionPendiente = false;
    
    // Calcular topes de puja para las IAs
    subastaActiva.topePujaIA1 = calcularTopePuja('conservadora', jugadorSeleccionado.precio_sugerido);
    subastaActiva.topePujaIA2 = calcularTopePuja('agresiva', jugadorSeleccionado.precio_sugerido);
    
    // --- 3. Notificación e Inicio ---
    
    // La interfaz debe ser global (window.actualizarInterfaz)
    if (typeof window.actualizarInterfaz === 'function') {
        window.actualizarInterfaz();
    }
    
    mostrarMensaje(`<br>--- 🏁 <b>RONDA ${subastaActiva.rondaActual}</b> ---`, 'info');
    mostrarMensaje(`📢 Subasta: <b>Jugador Misterioso (${jugadorSeleccionado.puesto})</b> - Precio BASE: ${formatoDinero(jugadorSeleccionado.precio_sugerido)}`, 'info');
    
    iniciarTurnos(); // Inicia el ciclo de turnos para esta subasta
}

/**
 * Muestra el resumen final del juego en el log.
 * * @returns {void}
 */
export function mostrarResumenFinal() {
    mostrarMensaje('<br>=== 📊 <b>RESUMEN FINAL</b> ===', 'ganador');
    
    Object.values(PARTICIPANTES).forEach(p => {
        const totalGastado = 1000000000 - p.presupuesto; // Presupuesto es 1000M
        mostrarMensaje(`<br><b>${p.nombre}</b>: ${p.equipo.length} jugadores (${p.posicionesOcupadas.join(', ')}) - Gastó: <b>${formatoDinero(totalGastado)}</b>`, 'info');
        
        // Asumimos que mostrarEquipo es global o importado correctamente
        if (typeof window.utils.mostrarEquipo === 'function') {
             mostrarMensaje(`Equipo: ${window.utils.mostrarEquipo(p)}`);
        }
    });
}

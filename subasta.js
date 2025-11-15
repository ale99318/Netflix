// =======================================================
// subasta.js - Gestión de rondas y subastas
// =======================================================
import { subastaActiva, PARTICIPANTES, POSICIONES_REQUERIDAS } from './config.js';
import { mostrarMensaje, formatoDinero } from './utils.js';
import { calcularTopePuja } from './ia.js';
import { iniciarTurnos } from './turnos.js';
import { TODOS_LOS_JUGADORES } from './jugadores.js'; // IMPORTACIÓN CORREGIDA

/**
 * Inicia la siguiente ronda de subasta seleccionando un jugador disponible al azar.
 * @returns {void}
 */
export function iniciarSiguienteSubasta() {
    // Verificar si la lista de jugadores está disponible
    if (!Array.isArray(TODOS_LOS_JUGADORES) || TODOS_LOS_JUGADORES.length === 0) {
        mostrarMensaje('❌ ERROR: No se encontró la lista de jugadores', 'alerta');
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
        posicion: jugadorSeleccionado.posicion, // Corregido: era 'puesto'
        precio_base: jugadorSeleccionado.precio_base // Corregido: era 'precio_sugerido'
    };
    
    // La oferta actual comienza en el precio base
    subastaActiva.ofertaActual = jugadorSeleccionado.precio_base; 
    subastaActiva.postorActualId = null; 
    subastaActiva.participantesQuePasaron = [];
    subastaActiva.revelacionPendiente = false;
    
    // Calcular topes de puja para las IAs
    subastaActiva.topePujaIA1 = calcularTopePuja('conservadora', jugadorSeleccionado.precio_base);
    subastaActiva.topePujaIA2 = calcularTopePuja('agresiva', jugadorSeleccionado.precio_base);
    
    // --- 3. Notificación e Inicio ---
    
    // Actualizar interfaz (debe estar expuesta globalmente)
    if (typeof window.actualizarInterfaz === 'function') {
        window.actualizarInterfaz();
    }
    
    // CORRECCIÓN CRÍTICA: Sintaxis correcta de mostrarMensaje
    mostrarMensaje(`<br>--- 🏁 <b>RONDA ${subastaActiva.rondaActual}</b> ---`, 'info');
    mostrarMensaje(`📢 Subasta: <b>Jugador Misterioso (${jugadorSeleccionado.posicion})</b> - Precio BASE: ${formatoDinero(jugadorSeleccionado.precio_base)}`, 'info');
    
    iniciarTurnos(); // Inicia el ciclo de turnos para esta subasta
}

/**
 * Muestra el resumen final del juego en el log.
 * @returns {void}
 */
export function mostrarResumenFinal() {
    mostrarMensaje('<br>=== 📊 <b>RESUMEN FINAL</b> ===', 'ganador');
    
    Object.values(PARTICIPANTES).forEach(p => {
        const totalGastado = 1000000000 - p.presupuesto; // Presupuesto inicial: 1000M
        mostrarMensaje(`<br><b>${p.nombre}</b>: ${p.equipo.length} jugadores (${p.posicionesOcupadas.join(', ')}) - Gastó: <b>${formatoDinero(totalGastado)}</b>`, 'info');
        
        // Mostrar equipo si la función está disponible
        if (typeof window.utils.mostrarEquipo === 'function') {
            mostrarMensaje(`Equipo: ${window.utils.mostrarEquipo(p)}`, 'info');
        }
    });
}

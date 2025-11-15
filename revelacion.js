// =======================================================
// revelacion.js - Sistema de revelación de jugadores
// =======================================================

import { subastaActiva, PARTICIPANTES, MAPEO_POSICIONES } from './config.js';
import { mostrarMensaje, formatoDinero } from './utils.js';
import { detenerTemporizador } from './temporizador.js';
import { iniciarSiguienteSubasta } from './subasta.js';

// NOTA: Asumimos que TODOS_LOS_JUGADORES está disponible globalmente
// y que actualizarInterfaz es global (window.actualizarInterfaz)

export function revelarJugador() {
    if (!subastaActiva.revelacionPendiente) return;
    
    detenerTemporizador();

    const jugadorReal = subastaActiva.jugadorOculto;
    const precio = subastaActiva.ofertaActual;
    const posicionRequerida = MAPEO_POSICIONES[jugadorReal.puesto]; // La posición que el equipo va a cubrir

    mostrarMensaje(`<br>🥁 <b>¡REVELACIÓN!</b> El jugador era <b>${jugadorReal.nombre}</b> (Media: ${jugadorReal.media}, Puesto: ${jugadorReal.puesto})`, 'ganador');

    if (subastaActiva.postorActualId === null || precio === 0) {
        // Esto solo debería pasar si la subasta inició en 0 (lo cual corregimos), o si nadie pujó el precio base.
        mostrarMensaje(`❌ Nadie lo quiso. ${jugadorReal.nombre} no se vendió.`, 'info');
        jugadorReal.vendido = true; // El jugador queda fuera del pool de disponibles.
    } else {
        const ganador = PARTICIPANTES[subastaActiva.postorActualId];

        // 1. Deducir Presupuesto y Asignar Posición
        ganador.presupuesto -= precio;
        ganador.equipo.push({ 
            nombre: jugadorReal.nombre, 
            media: jugadorReal.media, 
            puesto: jugadorReal.puesto,
            puesto_equipo: posicionRequerida, // Guardamos la posición que cubre en el equipo
            precio: precio
        });
        
        // 2. Marcar la posición como ocupada en el equipo
        ganador.posicionesOcupadas.push(posicionRequerida);
        
        // 3. Marcar el jugador como vendido en la lista global
        if (typeof TODOS_LOS_JUGADORES !== 'undefined') {
            const jugadorGlobal = TODOS_LOS_JUGADORES.find(j => j.id === jugadorReal.id);
            if (jugadorGlobal) jugadorGlobal.vendido = true;
        }

        mostrarMensaje(`🏆 ¡<b>${ganador.nombre}</b> ganó y pagó <b>${formatoDinero(precio)}</b>! Posición ocupada: ${posicionRequerida}`, 'ganador');
    }
    
    // 4. Resetear estado de subasta para el siguiente
    subastaActiva.revelacionPendiente = false;
    subastaActiva.jugadorOculto = null;
    subastaActiva.jugadorPublico = null;
    
    // Actualizar interfaz (la interfaz muestra ahora los nuevos presupuestos)
    if (typeof window.actualizarInterfaz === 'function') {
        window.actualizarInterfaz();
    }
    
    // 5. Iniciar la siguiente ronda con un retraso
    setTimeout(iniciarSiguienteSubasta, 3000); 
}

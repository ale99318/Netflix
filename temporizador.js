// =======================================================
// temporizador.js - Sistema de conteo regresivo
// =======================================================

import { subastaActiva } from './config.js';
import { pasarTurno } from './turnos.js';

// NOTA: 'actualizarInterfaz' se debe importar o llamar globalmente. 
// Asumiremos que es global (window.actualizarInterfaz) para evitar dependencias circulares complejas.

export function iniciarTemporizador() {
    detenerTemporizador();
    // Reinicia el tiempo restante a 10s (aunque ya se suele hacer en empezarTurno)
    subastaActiva.tiempoRestante = 10; 
    
    // Si la interfaz está definida, la actualizamos inmediatamente
    if (typeof window !== 'undefined' && window.actualizarInterfaz) {
        window.actualizarInterfaz();
    }
    
    subastaActiva.intervalTemporizador = setInterval(() => {
        subastaActiva.tiempoRestante--;
        
        // Si la interfaz está definida, la actualizamos
        if (typeof window !== 'undefined' && window.actualizarInterfaz) {
            window.actualizarInterfaz();
        }
        
        if (subastaActiva.tiempoRestante <= 0) {
            detenerTemporizador();
            
            // Forzar el paso de turno para el jugador cuyo tiempo se agotó
            const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual - 1] || 'player'; 
            // -1 porque el turnoActual ya se incrementó en empezarTurno
            
            pasarTurno(participanteActualId); 
        }
    }, 1000);
}

export function detenerTemporizador() {
    if (subastaActiva.intervalTemporizador) {
        clearInterval(subastaActiva.intervalTemporizador);
        subastaActiva.intervalTemporizador = null;
    }
}

export function reiniciarTemporizador() {
    subastaActiva.tiempoRestante = 10;
    iniciarTemporizador();
}

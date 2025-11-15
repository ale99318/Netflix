// =======================================================
// main.js - Inicialización y arranque del juego
// =======================================================

// 1. Importar funciones de la interfaz y lógica de acción
import { actualizarInterfaz, revelarJugador, pujarConAumento, usarSalto } from './interfaz.js';
// 2. Importar funciones de flujo
import { iniciarSiguienteSubasta } from './subasta.js';
import { ejecutarTurnoIA } from './ia.js';
// 3. Importar TODAS las utilidades (formato, log, equipo)
import { mostrarEquipo, formatoDinero, mostrarMensaje } from './utils.js'; 


// --- Exponer funciones al Ámbito Global (Window) ---
// Esto es CRUCIAL para que:
// 1. El HTML pueda llamar a funciones con 'onclick'.
// 2. Módulos con dependencia circular (como temporizador/turnos llamando a interfaz) puedan comunicarse.

// 3A. Exponer funciones de Interfaz y Flujo de Juego
window.actualizarInterfaz = actualizarInterfaz;
window.revelarJugador = revelarJugador;
window.pujarConAumento = pujarConAumento;
window.usarSalto = usarSalto;
window.iniciarSiguienteSubasta = iniciarSiguienteSubasta;
window.ejecutarTurnoIA = ejecutarTurnoIA;

// 3B. Exponer las Utilidades (CORRECCIÓN CRÍTICA)
// Las utilidades se agrupan bajo 'window.utils' para que otros módulos
// (como subasta.js, ia.js, etc.) puedan acceder al log y al formato.
window.utils = {
    mostrarEquipo: mostrarEquipo,
    formatoDinero: formatoDinero,
    // La función que causaba el error de TypeError
    mostrarMensaje: mostrarMensaje 
};

// --- Inicialización del Juego ---
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si la lista de jugadores está disponible (asumiendo que jugadores.js se carga primero)
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        // Usamos la función globalmente expuesta para el mensaje de error
        window.utils.mostrarMensaje('⚠️ <b>ERROR:</b> No se encontró la lista de jugadores. Verifica que jugadores.js se cargue antes.', 'alerta');
    } else {
        window.utils.mostrarMensaje('✅ Juego cargado. ¡Empezando Subasta!', 'info');
        
        // Usamos un pequeño retraso para que los mensajes de inicio se vean
        setTimeout(window.iniciarSiguienteSubasta, 1000);
    }
});

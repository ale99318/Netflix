// =======================================================
// main.js - Inicialización y arranque del juego
// =======================================================

// Importar todos los módulos
import { actualizarInterfaz, revelarJugador, pujarConAumento, usarSalto } from './interfaz.js';
import { iniciarSiguienteSubasta } from './subasta.js';
import { mostrarEquipo, formatoDinero } from './utils.js';
import { ejecutarTurnoIA } from './ia.js';

// --- Exponer funciones al Ámbito Global (Window) ---
// Esto es necesario para que el HTML (onclick) y las funciones con dependencias circulares (ej. temporizador llamando a interfaz) funcionen correctamente.

window.actualizarInterfaz = actualizarInterfaz;
window.revelarJugador = revelarJugador;
window.pujarConAumento = pujarConAumento;
window.usarSalto = usarSalto;
window.iniciarSiguienteSubasta = iniciarSiguienteSubasta;
window.ejecutarTurnoIA = ejecutarTurnoIA;

// Exportamos las funciones de utilidad para que puedan ser usadas por otros módulos globales
window.utils = {
    mostrarEquipo: mostrarEquipo,
    formatoDinero: formatoDinero
};

// --- Inicialización del Juego ---
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si la lista de jugadores está disponible (asumiendo que jugadores.js se carga primero)
    if (typeof TODOS_LOS_JUGADORES === 'undefined' || TODOS_LOS_JUGADORES.length === 0) {
        // En un entorno modular, este mensaje es crucial si falta la dependencia
        window.utils.mostrarMensaje('⚠️ <b>ERROR:</b> No se encontró la lista de jugadores (TODOS_LOS_JUGADORES). Verifica que jugadores.js se cargue primero.', 'alerta');
    } else {
        window.utils.mostrarMensaje('✅ Juego cargado. ¡Empezando Subasta!', 'info');
        // Usamos un pequeño retraso para que los mensajes de inicio se vean
        setTimeout(iniciarSiguienteSubasta, 1000);
    }
});

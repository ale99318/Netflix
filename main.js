// =======================================================
// main.js - Inicialización y arranque del juego
// =======================================================

// 1. Importar funciones de interfaz
import { 
    actualizarInterfaz, 
    revelarJugador, 
    pujarConAumento, 
    usarSalto 
} from './interfaz.js';

// 2. Importar funciones de flujo
import { iniciarSiguienteSubasta } from './subasta.js';
import { ejecutarTurnoIA } from './ia.js';

// 3. Importar utilidades
import { 
    mostrarEquipo, 
    formatoDinero, 
    mostrarMensaje 
} from './utils.js';

// 4. Importar jugadores
import { TODOS_LOS_JUGADORES } from './jugadores.js';

// --- Exponer funciones al Ámbito Global ---
// Esto es CRUCIAL para que:
// 1. El HTML pueda llamar a funciones con 'onclick'.
// 2. Módulos con dependencia circular puedan comunicarse.
function exponerAPI() {
    // Funciones de Interfaz y Flujo
    window.actualizarInterfaz = actualizarInterfaz;
    window.revelarJugador = revelarJugador;
    window.pujarConAumento = pujarConAumento;
    window.usarSalto = usarSalto;
    window.iniciarSiguienteSubasta = iniciarSiguienteSubasta;
    window.ejecutarTurnoIA = ejecutarTurnoIA;
    
    // Utilidades agrupadas
    window.utils = {
        mostrarEquipo,
        formatoDinero,
        mostrarMensaje
    };
    
    console.log('✅ API expuesta globalmente');
}

// --- Inicialización del Juego ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Iniciando juego...');
        
        // Validar jugadores
        if (!Array.isArray(TODOS_LOS_JUGADORES) || TODOS_LOS_JUGADORES.length === 0) {
            throw new Error('❌ Lista de jugadores inválida o vacía');
        }
        
        // Exponer API al ámbito global
        exponerAPI();
        
        // Mensajes de éxito
        mostrarMensaje('✅ Sistema cargado correctamente', 'info');
        mostrarMensaje(
            `🎮 ${TODOS_LOS_JUGADORES.length} jugadores disponibles para la subasta`, 
            'info'
        );
        
        console.log(`📊 Jugadores cargados: ${TODOS_LOS_JUGADORES.length}`);
        
        // Iniciar la primera subasta con pequeño delay
        setTimeout(() => {
            console.log('⚽ Iniciando primera subasta...');
            iniciarSiguienteSubasta();
        }, 1500);
        
    } catch (error) {
        // Manejo de errores robusto
        console.error('❌ Error al inicializar el juego:', error);
        
        const mensajeError = `
            <strong>⚠️ ERROR DE INICIALIZACIÓN</strong><br>
            ${error.message}<br>
            <small>Abre la consola (F12) para más detalles.</small>
        `;
        
        // Intentar mostrar error en la UI
        try {
            mostrarMensaje(mensajeError, 'alerta');
        } catch {
            // Si mostrarMensaje falla, usar DOM directamente
            const contenedorMensajes = document.getElementById('mensajes');
            if (contenedorMensajes) {
                const div = document.createElement('div');
                div.className = 'mensaje alerta';
                div.innerHTML = mensajeError;
                contenedorMensajes.appendChild(div);
            } else {
                // Último recurso: alert nativo
                alert(`Error de inicialización: ${error.message}`);
            }
        }
    }
});

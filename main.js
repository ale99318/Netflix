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

// --- Validación de Importaciones ---
function validarImportaciones() {
    const funcionesRequeridas = {
        'actualizarInterfaz': actualizarInterfaz,
        'revelarJugador': revelarJugador,
        'pujarConAumento': pujarConAumento,
        'usarSalto': usarSalto,
        'iniciarSiguienteSubasta': iniciarSiguienteSubasta,
        'ejecutarTurnoIA': ejecutarTurnoIA,
        'mostrarEquipo': mostrarEquipo,
        'formatoDinero': formatoDinero,
        'mostrarMensaje': mostrarMensaje
    };
    
    for (const [nombre, funcion] of Object.entries(funcionesRequeridas)) {
        if (typeof funcion !== 'function') {
            throw new Error(`❌ Fallo al importar función: ${nombre}`);
        }
    }
    
    if (!Array.isArray(TODOS_LOS_JUGADORES) || TODOS_LOS_JUGADORES.length === 0) {
        throw new Error('❌ Lista de jugadores inválida o vacía');
    }
    
    console.log('✅ Todas las importaciones validadas correctamente');
    return true;
}

// --- Exponer funciones al Ámbito Global ---
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
    
    // Datos de jugadores (para debugging en consola)
    // Solo se expone si detectamos que estamos en desarrollo
    // Verificamos si la URL contiene 'localhost' o '127.0.0.1'
    const esDesarrollo = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '';
    
    if (esDesarrollo) {
        window.JUGADORES_DEBUG = TODOS_LOS_JUGADORES;
        console.log('🔧 Modo desarrollo detectado. Escribe "JUGADORES_DEBUG" en consola para ver los jugadores.');
    }
    
    console.log('✅ API expuesta globalmente');
}

// --- Inicialización del Juego ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Iniciando juego...');
        
        // Validar que todo se importó correctamente
        validarImportaciones();
        
        // Exponer API al ámbito global
        exponerAPI();
        
        // Mensaje de éxito
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
            <small>Verifica la consola del navegador (F12) para más detalles.</small>
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
                alert(`Error: ${error.message}`);
            }
        }
    }
});

// Exportar para tests (opcional)
export { validarImportaciones, exponerAPI };

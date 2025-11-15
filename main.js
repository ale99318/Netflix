// =======================================================
// main.js - Inicialización y arranque del juego
// =======================================================

// 1. Importar funciones de la interfaz y lógica de acción
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

// 4. IMPORTAR JUGADORES (CRÍTICO)
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
            throw new Error(`❌ Fallo al importar: ${nombre}`);
        }
    }
    
    if (!Array.isArray(TODOS_LOS_JUGADORES) || TODOS_LOS_JUGADORES.length === 0) {
        throw new Error('❌ Lista de jugadores inválida o vacía');
    }
    
    return true;
}

// --- Exponer funciones al Ámbito Global ---
// Necesario para onclick en HTML y comunicación entre módulos

function exponerAPI() {
    // 3A. Funciones de Interfaz y Flujo
    window.actualizarInterfaz = actualizarInterfaz;
    window.revelarJugador = revelarJugador;
    window.pujarConAumento = pujarConAumento;
    window.usarSalto = usarSalto;
    window.iniciarSiguienteSubasta = iniciarSiguienteSubasta;
    window.ejecutarTurnoIA = ejecutarTurnoIA;
    
    // 3B. Utilidades agrupadas
    window.utils = {
        mostrarEquipo,
        formatoDinero,
        mostrarMensaje
    };
    
    // 3C. Datos (opcional, para debugging)
    if (process.env.NODE_ENV === 'development') {
        window.JUGADORES_DEBUG = TODOS_LOS_JUGADORES;
    }
}

// --- Inicialización del Juego ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Validar que todo se importó correctamente
        validarImportaciones();
        
        // Exponer API al ámbito global
        exponerAPI();
        
        // Mensaje de éxito
        mostrarMensaje('✅ Juego cargado correctamente', 'info');
        mostrarMensaje(
            `🎮 ${TODOS_LOS_JUGADORES.length} jugadores disponibles. ¡Comenzando subasta!`, 
            'info'
        );
        
        // Iniciar la primera subasta con pequeño delay
        setTimeout(() => {
            iniciarSiguienteSubasta();
        }, 1500);
        
    } catch (error) {
        // Manejo de errores robusto
        console.error('Error al inicializar el juego:', error);
        
        const mensajeError = `
            ⚠️ <b>ERROR DE INICIALIZACIÓN:</b><br>
            ${error.message}<br>
            <small>Verifica la consola del navegador para más detalles.</small>
        `;
        
        // Mostrar error incluso si utils falla
        const contenedorMensajes = document.getElementById('mensajes');
        if (contenedorMensajes) {
            const div = document.createElement('div');
            div.className = 'mensaje alerta';
            div.innerHTML = mensajeError;
            contenedorMensajes.appendChild(div);
        } else {
            alert(error.message);
        }
    }
});

// Exportar validación para tests (opcional)
export { validarImportaciones, exponerAPI };

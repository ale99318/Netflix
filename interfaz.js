// =======================================================
// interfaz.js - Actualización visual y manejo de botones
// =======================================================

import { subastaActiva, PARTICIPANTES } from './config.js';
import { formatoDinero, mostrarEquipo } from './utils.js';
import { revelarJugador } from './revelacion.js'; 
import { pujarConAumento, usarSalto } from './puja.js'; 

// Exportamos las funciones para que el HTML pueda acceder a ellas
export { revelarJugador, pujarConAumento, usarSalto };

/**
 * Función principal para actualizar toda la información en pantalla
 */
export function actualizarInterfaz() {
    const jugador = subastaActiva.jugadorPublico;
    const postorNombre = subastaActiva.postorActualId 
        ? PARTICIPANTES[subastaActiva.postorActualId].nombre 
        : 'Nadie';
    
    // Determinar si es el turno del jugador humano
    const esTuTurno = subastaActiva.turnoActual === 'jugador' && !subastaActiva.revelacionPendiente;

    // --- 1. Info de la Subasta (info-subasta) ---
    const infoSubasta = document.getElementById('info-subasta');
    if (infoSubasta) {
        const precioBase = jugador ? formatoDinero(jugador.precio_base) : 'N/A';
        const ofertaActual = formatoDinero(subastaActiva.ofertaActual);
        const posicionJugador = jugador ? jugador.posicion : 'N/A';

        infoSubasta.innerHTML = `
            <h2>${subastaActiva.revelacionPendiente 
                ? '🔒 SUBASTA CERRADA' 
                : (jugador ? `🎭 Jugador Misterioso (${posicionJugador})` : '⏳ Esperando Subasta...')
            }</h2>
            <p>Precio Base: <b>${precioBase}</b></p>
            <p>Oferta Actual: <b style="color: red; font-size: 1.5em;">${ofertaActual}</b></p>
            <p>Postor Actual: <b>${postorNombre}</b></p>
            ${!subastaActiva.revelacionPendiente && subastaActiva.turnoActual ? 
                `<p style="background: ${esTuTurno ? '#4CAF50' : '#FF9800'}; color: white; padding: 10px; border-radius: 5px; font-weight: bold;">
                    ⏰ TURNO: ${PARTICIPANTES[subastaActiva.turnoActual]?.nombre || 'N/A'} ${subastaActiva.tiempoRestante ? `(${subastaActiva.tiempoRestante}s)` : ''}
                </p>` 
            : ''}
        `;
    }

    // --- 2. Info de Participantes y Controles ---
    const infoParticipantes = document.getElementById('info-participantes');
    if (infoParticipantes) {
        const jugadorHumano = PARTICIPANTES.jugador;
        const ia1 = PARTICIPANTES.ia1;
        const ia2 = PARTICIPANTES.ia2;

        infoParticipantes.innerHTML = `
            <h3>💰 Presupuestos y Equipos</h3>
            
            <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h4>👤 ${jugadorHumano.nombre}</h4>
                <p><b>Presupuesto:</b> ${formatoDinero(jugadorHumano.presupuesto)}</p>
                <p><b>Posiciones Cubiertas:</b> ${jugadorHumano.posicionesOcupadas.join(', ') || 'Ninguna'}</p>
                <p><b>Saltos:</b> ${jugadorHumano.saltosRestantes > 0 ? `⭕ ${jugadorHumano.saltosRestantes} disponible(s)` : '✅ Usado'}</p>
                
                <div style="border-left: 3px solid #4CAF50; padding-left: 10px; margin-top: 10px;">
                    <h5>Equipo:</h5>
                    ${mostrarEquipo(jugadorHumano)}
                </div>
            </div>

            <div style="background: #fff4e6; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                <p><b>🤖 ${ia1.nombre}:</b> ${formatoDinero(ia1.presupuesto)} | Posiciones: ${ia1.posicionesOcupadas.join(', ') || 'Ninguna'} | Saltos: ${ia1.saltosRestantes}</p>
            </div>

            <div style="background: #ffe6e6; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                <p><b>🤖 ${ia2.nombre}:</b> ${formatoDinero(ia2.presupuesto)} | Posiciones: ${ia2.posicionesOcupadas.join(', ') || 'Ninguna'} | Saltos: ${ia2.saltosRestantes}</p>
            </div>
            
            <div id="controles-puja" style="margin-top: 20px;">
                ${generarBotones(esTuTurno, jugadorHumano)}
            </div>
        `;
    }
}

/**
 * Genera los botones de control según el estado del juego
 */
function generarBotones(esTuTurno, jugadorHumano) {
    if (subastaActiva.revelacionPendiente) {
        return `
            <button onclick="revelarJugador()" 
                style="padding: 15px 30px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 18px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                🎁 REVELAR JUGADOR
            </button>
        `;
    }
    
    if (esTuTurno) {
        return `
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                <button onclick="pujarConAumento(1000000)" class="btn-puja">+$1M</button>
                <button onclick="pujarConAumento(5000000)" class="btn-puja">+$5M</button>
                <button onclick="pujarConAumento(10000000)" class="btn-puja">+$10M</button>
                <button onclick="pujarConAumento(15000000)" class="btn-puja">+$15M</button>
                <button onclick="pujarConAumento(20000000)" class="btn-puja" style="background-color: #f4d03f;">+$20M</button>
                <button onclick="pujarConAumento(50000000)" class="btn-puja" style="background-color: #f44336;">🔥 +$50M</button>
                <button onclick="pujarConAumento(100000000)" class="btn-puja" style="background-color: #9c27b0;">🚀 +$100M</button>
            </div>
            
            <button id="boton-salto" onclick="usarSalto()" 
                ${jugadorHumano.saltosRestantes <= 0 ? 'disabled' : ''} 
                style="padding: 12px 24px; background: ${jugadorHumano.saltosRestantes > 0 ? '#007bff' : '#ccc'}; color: white; border: none; cursor: ${jugadorHumano.saltosRestantes > 0 ? 'pointer' : 'not-allowed'}; border-radius: 5px; font-weight: bold;">
                ⏭️ Usar Salto (${jugadorHumano.saltosRestantes} disponible${jugadorHumano.saltosRestantes !== 1 ? 's' : ''})
            </button>
        `;
    }
    
    // No es tu turno
    const turnoActual = subastaActiva.turnoActual;
    const nombreTurno = turnoActual && PARTICIPANTES[turnoActual] 
        ? PARTICIPANTES[turnoActual].nombre 
        : 'otro participante';
    
    return `
        <p style="color: #666; font-style: italic; padding: 15px; background: #f5f5f5; border-radius: 5px;">
            ⏳ Esperando el turno de <b>${nombreTurno}</b>...
        </p>
    `;
}

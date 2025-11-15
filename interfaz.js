// =======================================================
// interfaz.js - Actualización visual y manejo de botones (AJUSTADO)
// =======================================================

import { subastaActiva, PARTICIPANTES } from './config.js';
import { formatoDinero, mostrarEquipo } from './utils.js';
import { revelarJugador } from './revelacion.js'; 
import { pujarConAumento, usarSalto } from './puja.js'; 

// Exportamos las funciones para que el HTML pueda acceder a ellas (se hará en main.js)
export { revelarJugador, pujarConAumento, usarSalto };

// Función principal para actualizar toda la información en pantalla
export function actualizarInterfaz() {
    const jugador = subastaActiva.jugadorPublico;
    const postorNombre = subastaActiva.postorActualId ? PARTICIPANTES[subastaActiva.postorActualId].nombre : 'Nadie';
    
    // Determinar el participante actual que tiene el turno
    // Se usa turnoActual - 1 porque el turno se incrementa ANTES de empezar el turno
    const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual - 1]; 
    const esTuTurno = participanteActualId === 'player' && !subastaActiva.revelacionPendiente;

    // --- 1. Info de la Subasta (info-subasta) ---
    const infoSubasta = document.getElementById('info-subasta');
    if (infoSubasta) {
        const precioBase = jugador ? formatoDinero(jugador.precio_sugerido) : 'N/A';
        const ofertaActual = formatoDinero(subastaActiva.ofertaActual);

        infoSubasta.innerHTML = `
            <h2>${subastaActiva.revelacionPendiente ? '🔒 SUBASTA CERRADA' : (jugador ? `🎭 Jugador Misterioso (${jugador.puesto})` : '⏳ Esperando Subasta...')}</h2>
            <p>Precio Base/Sugerido: <b>${precioBase}</b></p>
            <p>Oferta Actual: <b style="color: red; font-size: 1.5em;">${ofertaActual}</b> (Postor: ${postorNombre})</p>
            ${!subastaActiva.revelacionPendiente && participanteActualId ? 
                `<p style="background: ${esTuTurno ? '#4CAF50' : '#FF9800'}; color: white; padding: 10px; border-radius: 5px; font-weight: bold;">
                    ⏰ TURNO: ${PARTICIPANTES[participanteActualId].nombre} (${subastaActiva.tiempoRestante}s)
                </p>` 
            : ''}
        `;
    }

    // --- 2. Info de Participantes y Controles (info-participantes) ---
    const infoParticipantes = document.getElementById('info-participantes');
    if (infoParticipantes) {
        infoParticipantes.innerHTML = `
            <h3>💰 Presupuestos y Equipos</h3>
            
            <p>
                <b>${PARTICIPANTES.player.nombre}</b>: ${formatoDinero(PARTICIPANTES.player.presupuesto)} 
                | Posiciones Cubiertas: ${PARTICIPANTES.player.posicionesOcupadas.join(', ') || 'Ninguna'} 
                | Salto: ${PARTICIPANTES.player.salto_usado ? '✅ Usado' : '⭕ Disponible'}
            </p>
            <div style="border-left: 3px solid #4CAF50; padding-left: 5px; margin-bottom: 15px;">
                <h4>Equipo (Jugador Humano):</h4>
                ${mostrarEquipo(PARTICIPANTES.player)}
            </div>

            <p>${PARTICIPANTES.ia1.nombre}: ${formatoDinero(PARTICIPANTES.ia1.presupuesto)} | Posiciones Cubiertas: ${PARTICIPANTES.ia1.posicionesOcupadas.join(', ') || 'Ninguna'} | Salto: ${PARTICIPANTES.ia1.salto_usado ? '✅' : '⭕'}</p>
            <p>${PARTICIPANTES.ia2.nombre}: ${formatoDinero(PARTICIPANTES.ia2.presupuesto)} | Posiciones Cubiertas: ${PARTICIPANTES.ia2.posicionesOcupadas.join(', ') || 'Ninguna'} | Salto: ${PARTICIPANTES.ia2.salto_usado ? '✅' : '⭕'}</p>
            
            <div id="controles-puja" style="margin-top: 20px;">
                ${subastaActiva.revelacionPendiente ? `
                    <button onclick="revelarJugador()" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 10px;">🎁 REVELAR JUGADOR</button>
                ` : esTuTurno ? `
                    <button onclick="pujarConAumento(1000000)" class="btn-puja">+$1M</button>
                    <button onclick="pujarConAumento(5000000)" class="btn-puja">+$5M</button>
                    <button onclick="pujarConAumento(10000000)" class="btn-puja">+$10M</button>
                    <button onclick="pujarConAumento(15000000)" class="btn-puja">+$15M</button>
                    <button onclick="pujarConAumento(20000000)" class="btn-puja" style="background-color: #f4d03f;">+$20M</button>
                    <button onclick="pujarConAumento(50000000)" class="btn-puja" style="background-color: #f44336;">🔥 +$50M</button>
                    <button onclick="pujarConAumento(100000000)" class="btn-puja" style="background-color: #9c27b0;">🚀 +$100M</button>
                    
                    <button id="boton-salto" onclick="usarSalto()" ${PARTICIPANTES.player.salto_usado ? 'disabled' : ''} style="margin-left: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; border-radius: 5px;">
                        ⏭️ Usar Salto (Una vez)
                    </button>
                ` : `
                    <p style="color: #666;">Esperando el turno de ${PARTICIPANTES[participanteActualId].nombre}...</p>
                `}
            </div>
        `;
    }
}

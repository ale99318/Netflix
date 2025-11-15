// =======================================================
// ia.js - Lógica de decisiones de IA
// =======================================================

import { subastaActiva, PARTICIPANTES } from './config.js';
import { mostrarMensaje } from './utils.js';
// Importamos pujar y pasarTurno para que la IA actúe
import { pujar } from './puja.js';
import { pasarTurno } from './turnos.js';

/**
 * Calcula el monto máximo que una IA está dispuesta a pagar por un jugador,
 * basado en su perfil (conservadora o agresiva) y el precio sugerido.
 */
export function calcularTopePuja(perfil, precioSugerido) {
    let factor;
    if (perfil === 'conservadora') {
        // Puja entre 60% y 95% del precio sugerido
        factor = Math.random() * (0.95 - 0.60) + 0.60;
    } else {
        // Puja entre 90% y 120% del precio sugerido
        factor = Math.random() * (1.20 - 0.90) + 0.90;
    }
    // Redondea al millón inferior más cercano
    const topeBruto = precioSugerido * factor;
    return Math.floor(topeBruto / 1000000) * 1000000; 
}

/**
 * Ejecuta la lógica de la IA para decidir si puja, pasa, o usa el salto.
 */
export function ejecutarTurnoIA(iaId) {
    if (subastaActiva.revelacionPendiente) return;

    // Se verifica de nuevo que realmente sea el turno de esta IA
    const participanteActualId = subastaActiva.participantesActivos[subastaActiva.turnoActual - 1];
    if (participanteActualId !== iaId) return;

    const ia = PARTICIPANTES[iaId];
    const precioSugerido = subastaActiva.jugadorOculto.precio_sugerido;
    const topePuja = iaId === 'ia1' ? subastaActiva.topePujaIA1 : subastaActiva.topePujaIA2;

    const ofertaMinima = subastaActiva.ofertaActual + 1000000;
    
    // --- LÓGICA DE SALTO ---
    // 1. Oportunidad de usar el Salto (15% conservadora, 10% agresiva)
    const probabilidadSalto = ia.perfil === 'conservadora' ? 0.15 : 0.10;
    if (!ia.salto_usado && Math.random() < probabilidadSalto && ofertaMinima > topePuja * 0.5) {
        // Solo usa el salto si la puja actual es medianamente alta (más del 50% de su tope)
        ia.salto_usado = true;
        mostrarMensaje(`⏭️ <b>[${ia.nombre}]</b> usa su SALTO y pasa esta subasta.`, 'alerta');
        pasarTurno(iaId);
        return;
    }

    // --- LÓGICA DE CIERRE POR OBLIGATORIEDAD (N+1) ---
    const numActivos = subastaActiva.participantesActivos.length;
    const numPasados = subastaActiva.participantesQuePasaron.length;
    
    // Si solo queda la IA y otro competidor activo, o solo la IA, debe ser más agresiva.
    const esCritico = (numActivos - numPasados) <= 2;
    
    // 2. Decidir si pasa porque superó su tope o presupuesto
    if (ofertaMinima > topePuja || ofertaMinima > ia.presupuesto) {
        mostrarMensaje(`🚫 <b>[${ia.nombre}]</b> se retira de la puja. (Fuera de tope/presupuesto)`);
        pasarTurno(iaId);
        return;
    }

    // 3. Calcular nueva oferta
    let incrementoBase;
    
    if (ia.perfil === 'agresiva') {
        // Incremento mayor y más aleatorio: 2M a 6M
        incrementoBase = Math.floor(Math.random() * 5 + 2) * 1000000;
        if (esCritico) {
            // En fase crítica, pujan agresivamente, hasta 10M o 20M más
            incrementoBase = Math.floor(Math.random() * 19 + 2) * 1000000; 
        }
    } else {
        // Incremento menor y más conservador: 1M a 3M
        incrementoBase = Math.floor(Math.random() * 3 + 1) * 1000000;
        if (esCritico) {
            // Incluso conservadores suben un poco más en fase crítica
            incrementoBase = Math.floor(Math.random() * 7 + 1) * 1000000;
        }
    }
    
    // La nueva oferta debe ser el máximo entre: (Oferta Mínima + Incremento) y el tope/presupuesto.
    const nuevaOferta = Math.min(ofertaMinima + incrementoBase, topePuja, ia.presupuesto);
   
    // 4. Ejecutar la puja
    pujar(nuevaOferta, iaId);
}

// =======================================================
// utils.js - Funciones de utilidad y formateo
// =======================================================

// Función para formatear dinero (M = Millones, B = Billones si es necesario)
export function formatoDinero(num) {
    if (num === null || num === undefined) return '$0.0M';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    
    if (absNum >= 1000000000) {
        // Billones (B)
        return `${sign}${(absNum / 1000000000).toFixed(1)}B`;
    } else {
        // Millones (M)
        return `${sign}${(absNum / 1000000).toFixed(1)}M`;
    }
}

// Función para mostrar mensajes en el log de la interfaz
export function mostrarMensaje(texto, tipo = 'normal') {
    // Asegúrate de que el DOM exista antes de intentar acceder a él
    if (typeof document === 'undefined') return; 

    const log = document.getElementById('log-subasta');
    if (!log) return;
    
    const mensaje = document.createElement('p');
    mensaje.innerHTML = texto;
    
    // Estilos
    if (tipo === 'ganador') mensaje.style.color = '#4CAF50';
    if (tipo === 'info') mensaje.style.color = '#2196F3';
    if (tipo === 'alerta') mensaje.style.color = '#FF9800';
    if (tipo === 'turno') mensaje.style.fontWeight = 'bold';
    
    log.appendChild(mensaje);
    log.scrollTop = log.scrollHeight;
}

// Función para generar la lista HTML del equipo de un participante
export function mostrarEquipo(participante) {
    // Importamos formatoDinero para su uso interno
    const { formatoDinero } = (typeof window !== 'undefined' && window.utils) ? window.utils : { formatoDinero };
    
    if (participante.equipo.length === 0) {
        return 'Sin jugadores.';
    }

    const jugadoresLista = participante.equipo.map(j => {
        // Usa el puesto (puesto) real del jugador en el club y el puesto del equipo (puesto_equipo)
        return `<li>${j.nombre} (${j.puesto_equipo} / ${j.puesto}) - ${formatoDinero(j.precio)}</li>`;
    }).join('');

    return `<ul style="list-style-type: none; padding-left: 10px; margin-top: 5px; font-size: 0.9em;">${jugadoresLista}</ul>`;
}

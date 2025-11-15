// =======================================================
// config.js - Configuración y constantes del juego
// =======================================================

// A. POSICIONES REQUERIDAS Y MAPEO DE PUESTOS
// Las posiciones que cada equipo debe tener.
export const POSICIONES_REQUERIDAS = ['POR', 'LI', 'DFC', 'LD', 'MCD', 'MC', 'EI', 'ED', 'MP', 'DC', 'EXT'];

// Mapeo de los puestos reales de los jugadores a las POSICIONES_REQUERIDAS del equipo
// Esto es VITAL para que el juego sepa qué puesto cubre un jugador.
export const MAPEO_POSICIONES = {
    'POR': 'POR',           // Portero
    'DEF-CENTRAL': 'DFC',   // Defensa Central
    'LATERAL-EXTREMO': 'LI', // Lateral Izquierdo (Usamos LI para LATERAL-EXTREMO en la izquierda)
    'LATERAL': 'LD',        // Lateral Derecho (Usamos LD para LATERAL)
    'CONTENCION-MIXTO': 'MCD', // Mediocentro Defensivo / Contención Mixto
    'M-CENTRAL': 'MC',      // Mediocentro Central
    'M-CREADOR': 'MP',      // Mediocentro de Creación / Media Punta
    'EXTREMO-IZQUIERDO': 'EI', // Extremo Izquierdo
    'EXTREMO-DERECHO': 'ED',   // Extremo Derecho
    'DEL': 'DC',            // Delantero Central
    // Nota: 'EXT' (Extremo genérico) no se usa si ya tienes EI/ED.
};

// B. PARTICIPANTES (Presupuesto Corregido: 1000 millones)
export const PARTICIPANTES = {
    player: { 
        id: 'player', 
        nombre: 'Jugador Humano', 
        presupuesto: 1000000000, 
        equipo: [], 
        posicionesOcupadas: [],
        salto_usado: false, 
        ultimaPuja: 0 
    },
    ia1: { 
        id: 'ia1', 
        nombre: 'IA Conservadora', 
        presupuesto: 1000000000, 
        equipo: [], 
        posicionesOcupadas: [],
        perfil: 'conservadora', 
        salto_usado: false, 
        ultimaPuja: 0 
    },
    ia2: { 
        id: 'ia2', 
        nombre: 'IA Agresiva', 
        presupuesto: 1000000000, 
        equipo: [], 
        posicionesOcupadas: [],
        perfil: 'agresiva', 
        salto_usado: false, 
        ultimaPuja: 0 
    }
};

// C. ESTADO DE LA SUBASTA
export const subastaActiva = {
    jugadorOculto: null,     
    jugadorPublico: null,    
    ofertaActual: 0,         
    postorActualId: null,    
    topePujaIA1: 0,          
    topePujaIA2: 0,
    
    // Sistema de turnos
    turnoActual: 0, 
    ordenTurnos: ['player', 'ia1', 'ia2'],
    participantesActivos: [], 
    participantesQuePasaron: [],
    
    // Temporizador
    tiempoRestante: 10,
    intervalTemporizador: null,
    
    revelacionPendiente: false,
    rondaActual: 0
};

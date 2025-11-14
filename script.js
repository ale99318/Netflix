// script.js

// 1. PARTICIPANTES Y ESTADO INICIAL
const PARTICIPANTES = {
    // El jugador humano
    player: {
        id: 'player',
        presupuesto: 100000000, // $100 millones
        equipo: [],
        salto_usado: false
    },
    // IA 1 - Conservadora
    ia1: {
        id: 'ia1',
        presupuesto: 100000000,
        equipo: [],
        perfil: 'conservadora', // Factor de riesgo: 0.60 - 0.95
        salto_usado: false
    },
    // IA 2 - Agresiva
    ia2: {
        id: 'ia2',
        presupuesto: 100000000,
        equipo: [],
        perfil: 'agresiva', // Factor de riesgo: 0.90 - 1.20
        salto_usado: false
    }
};

// 2. ESTADO DE LA SUBASTA
let subastaActiva = {
    jugador: null,           // El objeto del jugador actual subastado
    ofertaActual: 0,         // La oferta más alta actual
    postorActualId: null,    // ID del participante con la oferta más alta
    puestoActual: null,      // Puesto que se está subastando
    jugadoresParaSubastar: [] // Array de jugadores sorteados para el turno
};

// 3. DATOS DE JUGADORES (Una pequeña muestra)
const TODOS_LOS_JUGADORES = [
    // Leyendas (Media 95+)
    { id: 1, nombre: "Messi", media: 98, precio_sugerido: 120000000, puesto: 'DEL', vendido: false },
    // Buenos (Media 80-90)
    { id: 2, nombre: "De Bruyne", media: 89, precio_sugerido: 95000000, puesto: 'MED', vendido: false },
    { id: 3, nombre: "Van Dijk", media: 88, precio_sugerido: 90000000, puesto: 'DEF', vendido: false },
    // Promedio (Media 70-80)
    { id: 4, nombre: "Fernández", media: 78, precio_sugerido: 65000000, puesto: 'MED', vendido: false },
    { id: 5, nombre: "Bale", media: 75, precio_sugerido: 50000000, puesto: 'DEL', vendido: false },
    // Malos (Media 45-70)
    { id: 6, nombre: "Malo IV", media: 55, precio_sugerido: 30000000, puesto: 'DEF', vendido: false },
    { id: 7, nombre: "Guardameta", media: 65, precio_sugerido: 40000000, puesto: 'POR', vendido: false },
    // ... añade más jugadores aquí
];

// =======================================================
// jugadores.js - Base de datos de jugadores
// =======================================================
// ⚽ Cada jugador tiene:
// - nombre: Nombre del jugador
// - posicion: POR (Portero), DEF (Defensa), MED (Mediocampista), DEL (Delantero)
// - overall: Calificación de 1-99 (habilidad general)
// - precio_base: Precio inicial en la subasta

export const TODOS_LOS_JUGADORES = [
    // === PORTEROS (POR) ===
    {
        nombre: "Alisson Becker",
        posicion: "POR",
        overall: 89,
        precio_base: 8000000
    },
    {
        nombre: "Thibaut Courtois",
        posicion: "POR",
        overall: 90,
        precio_base: 9000000
    },
    {
        nombre: "Ederson",
        posicion: "POR",
        overall: 88,
        precio_base: 7500000
    },
    {
        nombre: "Marc-André ter Stegen",
        posicion: "POR",
        overall: 87,
        precio_base: 7000000
    },
    {
        nombre: "Jan Oblak",
        posicion: "POR",
        overall: 89,
        precio_base: 8500000
    },

    // === DEFENSAS (DEF) ===
    {
        nombre: "Virgil van Dijk",
        posicion: "DEF",
        overall: 90,
        precio_base: 12000000
    },
    {
        nombre: "Rúben Dias",
        posicion: "DEF",
        overall: 88,
        precio_base: 10000000
    },
    {
        nombre: "Antonio Rüdiger",
        posicion: "DEF",
        overall: 87,
        precio_base: 9000000
    },
    {
        nombre: "Marquinhos",
        posicion: "DEF",
        overall: 87,
        precio_base: 9500000
    },
    {
        nombre: "Trent Alexander-Arnold",
        posicion: "DEF",
        overall: 87,
        precio_base: 11000000
    },
    {
        nombre: "Theo Hernández",
        posicion: "DEF",
        overall: 85,
        precio_base: 8500000
    },
    {
        nombre: "Kyle Walker",
        posicion: "DEF",
        overall: 84,
        precio_base: 7000000
    },
    {
        nombre: "Alphonso Davies",
        posicion: "DEF",
        overall: 84,
        precio_base: 8000000
    },
    {
        nombre: "Joško Gvardiol",
        posicion: "DEF",
        overall: 82,
        precio_base: 7500000
    },
    {
        nombre: "William Saliba",
        posicion: "DEF",
        overall: 84,
        precio_base: 8000000
    },

    // === MEDIOCAMPISTAS (MED) ===
    {
        nombre: "Kevin De Bruyne",
        posicion: "MED",
        overall: 91,
        precio_base: 15000000
    },
    {
        nombre: "Luka Modrić",
        posicion: "MED",
        overall: 88,
        precio_base: 10000000
    },
    {
        nombre: "Rodri",
        posicion: "MED",
        overall: 89,
        precio_base: 12000000
    },
    {
        nombre: "Jude Bellingham",
        posicion: "MED",
        overall: 87,
        precio_base: 13000000
    },
    {
        nombre: "Bruno Fernandes",
        posicion: "MED",
        overall: 86,
        precio_base: 11000000
    },
    {
        nombre: "Frenkie de Jong",
        posicion: "MED",
        overall: 87,
        precio_base: 11500000
    },
    {
        nombre: "Federico Valverde",
        posicion: "MED",
        overall: 86,
        precio_base: 10500000
    },
    {
        nombre: "Bernardo Silva",
        posicion: "MED",
        overall: 88,
        precio_base: 12000000
    },
    {
        nombre: "Joshua Kimmich",
        posicion: "MED",
        overall: 88,
        precio_base: 11000000
    },
    {
        nombre: "Martin Ødegaard",
        posicion: "MED",
        overall: 86,
        precio_base: 10000000
    },
    {
        nombre: "Casemiro",
        posicion: "MED",
        overall: 85,
        precio_base: 8500000
    },
    {
        nombre: "Declan Rice",
        posicion: "MED",
        overall: 85,
        precio_base: 9500000
    },
    {
        nombre: "Aurélien Tchouaméni",
        posicion: "MED",
        overall: 84,
        precio_base: 9000000
    },
    {
        nombre: "Pedri",
        posicion: "MED",
        overall: 85,
        precio_base: 10000000
    },
    {
        nombre: "İlkay Gündoğan",
        posicion: "MED",
        overall: 85,
        precio_base: 8000000
    },

    // === DELANTEROS (DEL) ===
    {
        nombre: "Kylian Mbappé",
        posicion: "DEL",
        overall: 91,
        precio_base: 18000000
    },
    {
        nombre: "Erling Haaland",
        posicion: "DEL",
        overall: 91,
        precio_base: 17500000
    },
    {
        nombre: "Harry Kane",
        posicion: "DEL",
        overall: 90,
        precio_base: 15000000
    },
    {
        nombre: "Mohamed Salah",
        posicion: "DEL",
        overall: 89,
        precio_base: 14000000
    },
    {
        nombre: "Vinícius Jr.",
        posicion: "DEL",
        overall: 89,
        precio_base: 15000000
    },
    {
        nombre: "Robert Lewandowski",
        posicion: "DEL",
        overall: 89,
        precio_base: 12000000
    },
    {
        nombre: "Victor Osimhen",
        posicion: "DEL",
        overall: 88,
        precio_base: 13000000
    },
    {
        nombre: "Lautaro Martínez",
        posicion: "DEL",
        overall: 87,
        precio_base: 11500000
    },
    {
        nombre: "Bukayo Saka",
        posicion: "DEL",
        overall: 87,
        precio_base: 12000000
    },
    {
        nombre: "Rafael Leão",
        posicion: "DEL",
        overall: 86,
        precio_base: 11000000
    },
    {
        nombre: "Son Heung-min",
        posicion: "DEL",
        overall: 87,
        precio_base: 11500000
    },
    {
        nombre: "Khvicha Kvaratskhelia",
        posicion: "DEL",
        overall: 85,
        precio_base: 10500000
    },
    {
        nombre: "Phil Foden",
        posicion: "DEL",
        overall: 85,
        precio_base: 10000000
    },
    {
        nombre: "Julián Álvarez",
        posicion: "DEL",
        overall: 84,
        precio_base: 9500000
    },
    {
        nombre: "Christopher Nkunku",
        posicion: "DEL",
        overall: 84,
        precio_base: 9000000
    }
];

// === INSTRUCCIONES PARA AGREGAR JUGADORES ===
// Copia y pega este template al final del array:
/*
{
    nombre: "Nombre del Jugador",
    posicion: "POR/DEF/MED/DEL",
    overall: 85,
    precio_base: 10000000
},
*/

// === GUÍA DE PRECIOS ===
// Porteros:     5M - 10M
// Defensas:     6M - 12M
// Mediocampistas: 8M - 15M
// Delanteros:   9M - 18M

// === GUÍA DE OVERALL ===
// 90-99: Crack mundial
// 85-89: Jugador elite
// 80-84: Jugador sólido
// 75-79: Jugador promedio
// 70-74: Jugador básico

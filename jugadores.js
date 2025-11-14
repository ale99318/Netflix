const TODOS_LOS_JUGADORES = [
    // =================================================================
    // DELANTERO (DEL) - 8 JUGADORES
    // =================================================================
    { id: 1, nombre: "Messi", media: 98, precio_sugerido: 150000000, puesto: 'DEL', vendido: false },
    { id: 2, nombre: "Cristiano Ronaldo", media: 95, precio_sugerido: 130000000, puesto: 'DEL', vendido: false },
    { id: 3, nombre: "Salah", media: 87, precio_sugerido: 95000000, puesto: 'DEL', vendido: false },
    { id: 4, nombre: "Lewandowski", media: 91, precio_sugerido: 110000000, puesto: 'DEL', vendido: false },
    { id: 5, nombre: "Son Heung-min", media: 85, precio_sugerido: 80000000, puesto: 'DEL', vendido: false },
    { id: 6, nombre: "Hulk (Wuhan Three Towns)", media: 78, precio_sugerido: 55000000, puesto: 'DEL', vendido: false },
    { id: 7, nombre: "A. Gignac (Tigres UANL)", media: 70, precio_sugerido: 40000000, puesto: 'DEL', vendido: false },
    { id: 8, nombre: "K. Al-Ghanam (Al-Nassr)", media: 65, precio_sugerido: 35000000, puesto: 'DEL', vendido: false },
  { id: 9, nombre: "Miroslav Klose (Retirado)", media: 88, precio_sugerido: 90000000, puesto: 'DEL', vendido: false }, // Leyenda de Nicho
    { id: 10, nombre: "Borja Mayoral (Getafe)", media: 80, precio_sugerido: 65000000, puesto: 'DEL', vendido: false }, // Jugador promedio de La Liga
    { id: 11, nombre: "Jamie Vardy (Leicester)", media: 79, precio_sugerido: 55000000, puesto: 'DEL', vendido: false }, // Niche/Club Legend
    { id: 12, nombre: "A. Gignac (Tigres UANL)", media: 70, precio_sugerido: 40000000, puesto: 'DEL', vendido: false }, // Niche Ligas
    { id: 13, nombre: "Salvador Cabañas (Leyenda)", media: 75, precio_sugerido: 50000000, puesto: 'DEL', vendido: false }, // Leyenda Niche
    { id: 14, nombre: "R. Falcao (Rayo Vallecano)", media: 72, precio_sugerido: 45000000, puesto: 'DEL', vendido: false }, // Viejas glorias
    { id: 15, nombre: "M. Icardi (Galatasaray)", media: 83, precio_sugerido: 75000000, puesto: 'DEL', vendido: false }, // Estrella en liga menor
    { id: 16, nombre: "Lucas Pratto (Velez)", media: 68, precio_sugerido: 38000000, puesto: 'DEL', vendido: false }, // Sudamérica Niche
    { id: 17, nombre: "K. Al-Ghanam (Al-Nassr)", media: 65, precio_sugerido: 35000000, puesto: 'DEL', vendido: false }, // Jugador Desconocido
    { id: 18, nombre: "Djaniny Tavares (Estambul)", media: 74, precio_sugerido: 48000000, puesto: 'DEL', vendido: false },
    { id: 19, nombre: "Paolo Guerrero (UCV)", media: 82, precio_sugerido: 75000000, puesto: 'DEL', vendido: false }, 
    { id: 20, nombre: "Hernán Barcos (Alianza Lima)", media: 80, precio_sugerido: 68000000, puesto: 'DEL', vendido: false }, 
    { id: 21, nombre: "Alex Valera (Universitario)", media: 78, precio_sugerido: 60000000, puesto: 'DEL', vendido: false }, 
    { id: 22, nombre: "Santiago Giordana (Millonarios)", media: 76, precio_sugerido: 55000000, puesto: 'DEL', vendido: false }, 
    { id: 23, nombre: "Brenner Marlos (Sporting Cristal)", media: 75, precio_sugerido: 52000000, puesto: 'DEL', vendido: false }, 
    { id: 24, nombre: "Y. Celi (Universitario)", media: 70, precio_sugerido: 40000000, puesto: 'DEL', vendido: false }, 
    { id: 25, nombre: "R. Costa (Alianza Lima)", media: 72, precio_sugerido: 45000000, puesto: 'DEL', vendido: false }, 
    { id: 26, nombre: "Luis Benites (Sport Huancayo)", media: 74, precio_sugerido: 48000000, puesto: 'DEL', vendido: false }, 
    { id: 27, nombre: "Hohberg (Univ. César Vallejo)", media: 77, precio_sugerido: 58000000, puesto: 'DEL', vendido: false }, 
    { id: 28, nombre: "Janio Pósito (ADT)", media: 69, precio_sugerido: 38000000, puesto: 'DEL', vendido: false },// Liga de Turquía Niche

  // =================================================================
    // EXTREMO IZQUIERDO (EXTREMO-IZQUIERDO) - 15 JUGADORES (ID INICIA EN 146)
    // =================================================================
    
    // --- LIGAS TOP EUROPEAS (5 JUGADORES) ---
    { id: 146, nombre: "Vinícius Júnior (R. Madrid)", media: 90, precio_sugerido: 108000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false }, // La Liga TOP
    { id: 147, nombre: "Rafael Leão (AC Milan)", media: 88, precio_sugerido: 95000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false }, // Serie A TOP
    { id: 148, nombre: "Heung-min Son (Tottenham)", media: 87, precio_sugerido: 90000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false }, // Premier League TOP
    { id: 149, nombre: "Kingsley Coman (Bayern)", media: 84, precio_sugerido: 78000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false }, // Bundesliga
    { id: 150, nombre: "Gabriel Martinelli (Arsenal)", media: 83, precio_sugerido: 75000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false }, // Premier League Promedio Alto

    // --- LIGA BRASILEÑA (3 JUGADORES) ---
    { id: 151, nombre: "Dudu (Palmeiras)", media: 81, precio_sugerido: 70000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false },
    { id: 152, nombre: "Éverton Cebolinha (Flamengo)", media: 79, precio_sugerido: 62000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false },
    { id: 153, nombre: "Léo Jardim (Vasco da Gama)", media: 75, precio_sugerido: 50000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false },

    // --- LIGA ARGENTINA (3 JUGADORES) ---
    { id: 154, nombre: "Nicolás de la Cruz (River Plate)", media: 80, precio_sugerido: 65000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false },
    { id: 155, nombre: "Sebastián Villa (Boca Juniors)", media: 78, precio_sugerido: 60000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false },
    { id: 156, nombre: "Cristian Medina (Boca Juniors)", media: 76, precio_sugerido: 55000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false },

    // --- LIGA CHILENA (1 JUGADOR) ---
    { id: 157, nombre: "Carlos Palacios (Colo-Colo)", media: 76, precio_sugerido: 53000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false },

    // --- LIGA VENEZOLANA (1 JUGADOR) ---
    { id: 158, nombre: "Darwin Machís (Real Valladolid)", media: 78, precio_sugerido: 60000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false }, // Figura venezolana en el extranjero

    // --- LIGA BOLIVIANA (1 JUGADOR) ---
    { id: 159, nombre: "Jhasmani Campos (Nacional Potosí)", media: 70, precio_sugerido: 45000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false }, // Veterano Niche

    // --- LIGA PERUANA (1 JUGADOR - SIN AL, U, SC) ---
    { id: 160, nombre: "Andy Polar (Deportivo Binacional)", media: 70, precio_sugerido: 40000000, puesto: 'EXTREMO-IZQUIERDO', vendido: false },

  // =================================================================
    // EXTREMO DERECHO (EXTREMO-DERECHO) - 15 JUGADORES (ID INICIA EN 131)
    // =================================================================
    
    // --- LIGAS TOP EUROPEAS (5 JUGADORES) ---
    { id: 131, nombre: "Mohamed Salah (Liverpool)", media: 91, precio_sugerido: 105000000, puesto: 'EXTREMO-DERECHO', vendido: false }, // Premier League TOP
    { id: 132, nombre: "Rodrygo (R. Madrid)", media: 87, precio_sugerido: 90000000, puesto: 'EXTREMO-DERECHO', vendido: false }, // La Liga TOP
    { id: 133, nombre: "Serge Gnabry (Bayern)", media: 85, precio_sugerido: 85000000, puesto: 'EXTREMO-DERECHO', vendido: false }, // Bundesliga TOP
    { id: 134, nombre: "Raphinha (FC Barcelona)", media: 84, precio_sugerido: 80000000, puesto: 'EXTREMO-DERECHO', vendido: false }, // La Liga Promedio Alto
    { id: 135, nombre: "Riyad Mahrez (Al-Ahli)", media: 83, precio_sugerido: 75000000, puesto: 'EXTREMO-DERECHO', vendido: false }, // Ex-Top / Nicho

    // --- LIGA BRASILEÑA (3 JUGADORES) ---
    { id: 136, nombre: "Yeferson Soteldo (Santos)", media: 78, precio_sugerido: 60000000, puesto: 'EXTREMO-DERECHO', vendido: false },
    { id: 137, nombre: "Artur (Palmeiras)", media: 76, precio_sugerido: 55000000, puesto: 'EXTREMO-DERECHO', vendido: false },
    { id: 138, nombre: "Everaldo (Bahia)", media: 74, precio_sugerido: 50000000, puesto: 'EXTREMO-DERECHO', vendido: false },

    // --- LIGA ARGENTINA (3 JUGADORES) ---
    { id: 139, nombre: "Cristian Pavón (Grêmio)", media: 79, precio_sugerido: 62000000, puesto: 'EXTREMO-DERECHO', vendido: false }, // Gremio (Ex-Arg)
    { id: 140, nombre: "Luca Langoni (Boca Juniors)", media: 75, precio_sugerido: 52000000, puesto: 'EXTREMO-DERECHO', vendido: false },
    { id: 141, nombre: "Esequiel Barco (River Plate)", media: 77, precio_sugerido: 58000000, puesto: 'EXTREMO-DERECHO', vendido: false },

    // --- LIGA CHILENA (1 JUGADOR) ---
    { id: 142, nombre: "Alexander Aravena (U. Católica)", media: 76, precio_sugerido: 55000000, puesto: 'EXTREMO-DERECHO', vendido: false },

    // --- LIGA VENEZOLANA (1 JUGADOR) ---
    { id: 143, nombre: "Jefferson Savarino (Botafogo)", media: 78, precio_sugerido: 60000000, puesto: 'EXTREMO-DERECHO', vendido: false }, // Representante de valor

    // --- LIGA BOLIVIANA (1 JUGADOR) ---
    { id: 144, nombre: "Diego Bejarano (Bolívar)", media: 73, precio_sugerido: 48000000, puesto: 'EXTREMO-DERECHO', vendido: false },

    // --- LIGA PERUANA (1 JUGADOR - SIN AL, U, SC) ---
    { id: 145, nombre: "Facundo Rodríguez (U. César Vallejo)", media: 70, precio_sugerido: 40000000, puesto: 'EXTREMO-DERECHO', vendido: false },

    // =================================================================
    // MEDIOCAMPISTA (MIXTOS / CENTRALES) - 8 JUGADORES
    // =================================================================
    { id: 29, nombre: "Maradona", media: 97, precio_sugerido: 140000000, puesto: 'M-CENTRAL', vendido: false },
    { id: 30, nombre: "De Bruyne", media: 89, precio_sugerido: 100000000, puesto: 'M-CENTRAL', vendido: false },
    { id: 31, nombre: "Kimmich", media: 88, precio_sugerido: 90000000, puesto: 'CONTENCION-MIXTO', vendido: false },
    { id: 32, nombre: "Toni Kroos", media: 84, precio_sugerido: 78000000, puesto: 'M-CENTRAL', vendido: false },
    { id: 33, nombre: "Frenkie de Jong", media: 83, precio_sugerido: 75000000, puesto: 'CONTENCION-MIXTO', vendido: false },
    { id: 34, nombre: "J. Henderson (Al-Ettifaq)", media: 76, precio_sugerido: 50000000, puesto: 'CONTENCION-MIXTO', vendido: false },
    { id: 35, nombre: "A. Guardado (Real Betis)", media: 72, precio_sugerido: 45000000, puesto: 'M-CENTRAL', vendido: false },
    { id: 36, nombre: "G. Wijnaldum (Al-Ettifaq)", media: 68, precio_sugerido: 35000000, puesto: 'M-CENTRAL', vendido: false },
    { id: 37, nombre: "Ramiro Vaca (Bolívar)", media: 75, precio_sugerido: 50000000, puesto: 'M-CREADOR', vendido: false }, // MCO Liga Boliviana
    { id: 38, nombre: "Ben White (Arsenal)", media: 84, precio_sugerido: 78000000, puesto: 'LATERAL-EXTREMO', vendido: false }, // Premier League
    { id: 39, nombre: "Douglas Luiz (Aston Villa)", media: 83, precio_sugerido: 75000000, puesto: 'CONTENCION-MIXTO', vendido: false }, // Premier League
    { id: 40, nombre: "Adama Traoré (Sheriff Tiraspol)", media: 71, precio_sugerido: 45000000, puesto: 'DEL', vendido: false }, // Liga de Moldavia (Estrella Local)
    { id: 41, nombre: "M. Kaba (Sheriff Tiraspol)", media: 68, precio_sugerido: 38000000, puesto: 'DEF-CENTRAL', vendido: false }, // Liga de Moldavia (Promedio)
    { id: 42, nombre: "Íñigo Martínez (FC Barcelona)", media: 82, precio_sugerido: 72000000, puesto: 'DEF-CENTRAL', vendido: false }, // La Liga Española

    // =================================================================
    // =================================================================
    // DEFENSA CENTRAL (DEF-CENTRAL) - 15 JUGADORES (ID INICIA EN 43)
    // =================================================================
    
    // --- LIGAS TOP EUROPEAS (6 JUGADORES) ---
    { id: 43, nombre: "Rúben Dias (Man. City)", media: 90, precio_sugerido: 110000000, puesto: 'DEF-CENTRAL', vendido: false }, // Premier League
    { id: 44, nombre: "Antonio Rüdiger (R. Madrid)", media: 87, precio_sugerido: 90000000, puesto: 'DEF-CENTRAL', vendido: false }, // La Liga
    { id: 45, nombre: "Matthijs de Ligt (Bayern)", media: 86, precio_sugerido: 85000000, puesto: 'DEF-CENTRAL', vendido: false }, // Bundesliga
    { id: 46, nombre: "Alessandro Bastoni (Inter)", media: 84, precio_sugerido: 78000000, puesto: 'DEF-CENTRAL', vendido: false }, // Serie A
    { id: 47, nombre: "Presnel Kimpembe (PSG)", media: 83, precio_sugerido: 75000000, puesto: 'DEF-CENTRAL', vendido: false }, // Ligue 1
    { id: 48, nombre: "Kalidou Koulibaly (Al-Hilal)", media: 81, precio_sugerido: 68000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 49, nombre: "Gustavo Gómez (Palmeiras)", media: 83, precio_sugerido: 70000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 50, nombre: "Fabricio Bruno (Flamengo)", media: 79, precio_sugerido: 60000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 51, nombre: "Léo Ortiz (Red Bull Bragantino)", media: 77, precio_sugerido: 55000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 52, nombre: "Lucas Veríssimo (Corinthians)", media: 76, precio_sugerido: 52000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 53, nombre: "Marcos Rojo (Boca Juniors)", media: 80, precio_sugerido: 65000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 54, nombre: "Franco Armani (River Plate)", media: 78, precio_sugerido: 58000000, puesto: 'DEF-CENTRAL', vendido: false },// Aunque es POR, lo listamos como DEF por necesidad de cuota y valor
    { id: 55, nombre: "Cristian Lema (Lanús)", media: 75, precio_sugerido: 50000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 56, nombre: "Lautaro Gianetti (Vélez Sarsfield)", media: 74, precio_sugerido: 48000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 57, nombre: "Nilson Loyola (Sport Boys)", media: 70, precio_sugerido: 40000000, puesto: 'DEF-CENTRAL', vendido: false },// Defensa de club "nicho"
    { id: 58, nombre: "Piero Guzmán (Cusco FC)", media: 68, precio_sugerido: 35000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 59, nombre: "Christian Ramos (Univ. César Vallejo)", media: 72, precio_sugerido: 45000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 60, nombre: "Rubert Quijada (Caracas FC)", media: 71, precio_sugerido: 42000000, puesto: 'DEF-CENTRAL', vendido: false },
    { id: 61, nombre: "Adrián Jusino (The Strongest)", media: 70, precio_sugerido: 40000000, puesto: 'DEF-CENTRAL', vendido: false },


    // =================================================================
    // LATERAL IZQUIERDO (LATERAL-EXTREMO) - 15 JUGADORES (ID INICIA EN 72)
    // =================================================================
    
    // --- LIGAS TOP EUROPEAS (6 JUGADORES) ---
    { id: 72, nombre: "Alphonso Davies (Bayern)", media: 87, precio_sugerido: 90000000, puesto: 'LATERAL-EXTREMO', vendido: false }, // Bundesliga
    { id: 73, nombre: "Andrew Robertson (Liverpool)", media: 86, precio_sugerido: 85000000, puesto: 'LATERAL-EXTREMO', vendido: false }, // Premier League
    { id: 74, nombre: "Nuno Mendes (PSG)", media: 83, precio_sugerido: 75000000, puesto: 'LATERAL-EXTREMO', vendido: false }, // Ligue 1
    { id: 75, nombre: "Alejandro Balde (FC Barcelona)", media: 81, precio_sugerido: 68000000, puesto: 'LATERAL-EXTREMO', vendido: false }, // La Liga
    { id: 76, nombre: "Leonardo Spinazzola (Roma)", media: 80, precio_sugerido: 65000000, puesto: 'LATERAL-EXTREMO', vendido: false }, // Serie A
    { id: 77, nombre: "Sergio Reguilón (Brentford)", media: 78, precio_sugerido: 55000000, puesto: 'LATERAL-EXTREMO', vendido: false }, // Premier League (Promedio)

    // --- LIGA BRASILEÑA (4 JUGADORES) ---
    { id: 78, nombre: "Guilherme Arana (Atlético Mineiro)", media: 82, precio_sugerido: 70000000, puesto: 'LATERAL-EXTREMO', vendido: false },
    { id: 79, nombre: "Marcelo (Fluminense)", media: 79, precio_sugerido: 60000000, puesto: 'LATERAL-EXTREMO', vendido: false }, // Veterano de Valor
    { id: 80, nombre: "Juninho Capixaba (Red Bull Bragantino)", media: 77, precio_sugerido: 55000000, puesto: 'LATERAL-EXTREMO', vendido: false },
    { id: 81, nombre: "Piquerez (Palmeiras)", media: 76, precio_sugerido: 52000000, puesto: 'LATERAL-EXTREMO', vendido: false },

    // --- LIGA ARGENTINA (4 JUGADORES) ---
    { id: 82, nombre: "Frank Fabra (Boca Juniors)", media: 80, precio_sugerido: 65000000, puesto: 'LATERAL-EXTREMO', vendido: false },
    { id: 83, nombre: "Milton Casco (River Plate)", media: 78, precio_sugerido: 58000000, puesto: 'LATERAL-EXTREMO', vendido: false },
    { id: 84, nombre: "Gabriel Rojas (Racing Club)", media: 75, precio_sugerido: 50000000, puesto: 'LATERAL-EXTREMO', vendido: false },
    { id: 85, nombre: "Leonel Vangioni (Newell's)", media: 74, precio_sugerido: 48000000, puesto: 'LATERAL-EXTREMO', vendido: false },
    
    // --- LIGA PERUANA (1 JUGADOR - SIN AL, U, SC) ---
    { id: 86, nombre: "Sebastián La Torre (Melgar)", media: 70, precio_sugerido: 40000000, puesto: 'LATERAL-EXTREMO', vendido: false },

    // =================================================================
    // LATERAL DERECHO (LATERAL) - 15 JUGADORES (ID INICIA EN 87)
    // =================================================================
    
    // --- LEYENDAS (2 JUGADORES) ---
    { id: 87, nombre: "Cafú (Leyenda)", media: 92, precio_sugerido: 120000000, puesto: 'LATERAL', vendido: false }, 
    { id: 88, nombre: "Dani Alves (Leyenda)", media: 88, precio_sugerido: 95000000, puesto: 'LATERAL', vendido: false }, 

    // --- LIGAS TOP EUROPEAS (4 JUGADORES) ---
    { id: 89, nombre: "Trent Alexander-Arnold (Liverpool)", media: 87, precio_sugerido: 90000000, puesto: 'LATERAL', vendido: false }, 
    { id: 90, nombre: "Achraf Hakimi (PSG)", media: 85, precio_sugerido: 80000000, puesto: 'LATERAL', vendido: false }, 
    { id: 91, nombre: "Kyle Walker (Man. City)", media: 84, precio_sugerido: 78000000, puesto: 'LATERAL', vendido: false }, 
    { id: 92, nombre: "Juan Cuadrado (Inter)", media: 80, precio_sugerido: 65000000, puesto: 'LATERAL', vendido: false }, 

    // --- LIGA BRASILEÑA (4 JUGADORES) ---
    { id: 93, nombre: "Samuel Xavier (Fluminense)", media: 78, precio_sugerido: 58000000, puesto: 'LATERAL', vendido: false },
    { id: 94, nombre: "Mayke (Palmeiras)", media: 77, precio_sugerido: 55000000, puesto: 'LATERAL', vendido: false },
    { id: 95, nombre: "Rodinei (Olympiacos)", media: 75, precio_sugerido: 50000000, puesto: 'LATERAL', vendido: false }, 
    { id: 96, nombre: "Fágner (Corinthians)", media: 76, precio_sugerido: 52000000, puesto: 'LATERAL', vendido: false },

    // --- LIGA ARGENTINA (4 JUGADORES) ---
    { id: 97, nombre: "Leonardo Godoy (Estudiantes)", media: 79, precio_sugerido: 60000000, puesto: 'LATERAL', vendido: false },
    { id: 98, nombre: "Ángelo Martino (River Plate)", media: 75, precio_sugerido: 50000000, puesto: 'LATERAL', vendido: false },
    { id: 99, nombre: "Luis Advíncula (Boca Juniors)", media: 77, precio_sugerido: 56000000, puesto: 'LATERAL', vendido: false },
    { id: 100, nombre: "Facundo Mura (Racing Club)", media: 74, precio_sugerido: 48000000, puesto: 'LATERAL', vendido: false },
    
   // =================================================================
    // PORTEROS (POR) - 20 JUGADORES (ID INICIA EN 102)
    // =================================================================
    
    // --- LEYENDAS / TOP MUNDIAL (4 JUGADORES) ---
    { id: 102, nombre: "Lev Yashin (Leyenda)", media: 98, precio_sugerido: 140000000, puesto: 'POR', vendido: false }, // Leyenda Máxima
    { id: 103, nombre: "Gianluigi Buffon (Leyenda)", media: 93, precio_sugerido: 125000000, puesto: 'POR', vendido: false }, // Leyenda Reciente
    { id: 104, nombre: "Thibaut Courtois (R. Madrid)", media: 91, precio_sugerido: 105000000, puesto: 'POR', vendido: false }, // TOP Mundial
    { id: 105, nombre: "Marc-André ter Stegen (FC Barcelona)", media: 90, precio_sugerido: 98000000, puesto: 'POR', vendido: false }, // TOP Mundial

    // --- LIGAS TOP EUROPEAS / MEDIO NIVEL (6 JUGADORES) ---
    { id: 106, nombre: "Jan Oblak (Atlético de Madrid)", media: 88, precio_sugerido: 90000000, puesto: 'POR', vendido: false }, // Liga Española
    { id: 107, nombre: "David de Gea (Agente Libre)", media: 86, precio_sugerido: 80000000, puesto: 'POR', vendido: false }, // Premier (Alto Valor / Nicho)
    { id: 108, nombre: "Wojciech Szczęsny (Juventus)", media: 84, precio_sugerido: 75000000, puesto: 'POR', vendido: false }, // Serie A
    { id: 109, nombre: "Gregor Kobel (B. Dortmund)", media: 83, precio_sugerido: 70000000, puesto: 'POR', vendido: false }, // Bundesliga (Medio Nivel Europeo)
    { id: 110, nombre: "Yassine Bounou 'Bono' (Al-Hilal)", media: 85, precio_sugerido: 78000000, puesto: 'POR', vendido: false }, // Nicho/Mundialista
    { id: 111, nombre: "Péter Gulácsi (RB Leipzig)", media: 81, precio_sugerido: 65000000, puesto: 'POR', vendido: false }, // Medio Nivel Europeo

    // --- LIGA BRASILEÑA (2 JUGADORES) ---
    { id: 112, nombre: "Weverton (Palmeiras)", media: 80, precio_sugerido: 60000000, puesto: 'POR', vendido: false },
    { id: 113, nombre: "Cássio (Corinthians)", media: 78, precio_sugerido: 55000000, puesto: 'POR', vendido: false },

    // --- LIGA ARGENTINA (2 JUGADORES) ---
    { id: 114, nombre: "Franco Armani (River Plate)", media: 79, precio_sugerido: 58000000, puesto: 'POR', vendido: false },
    { id: 115, nombre: "Sergio Romero (Boca Juniors)", media: 77, precio_sugerido: 52000000, puesto: 'POR', vendido: false },

    // --- LIGA CHILENA (1 JUGADOR) ---
    { id: 116, nombre: "Brayan Cortés (Colo-Colo)", media: 76, precio_sugerido: 50000000, puesto: 'POR', vendido: false },

    // --- LIGA VENEZOLANA (1 JUGADOR) ---
    { id: 117, nombre: "Joel Graterol (América de Cali)", media: 74, precio_sugerido: 45000000, puesto: 'POR', vendido: false }, // Portero venezolano en liga cercana

    // --- LIGA BOLIVIANA (1 JUGADOR) ---
    { id: 118, nombre: "Carlos Lampe (Bolívar)", media: 73, precio_sugerido: 42000000, puesto: 'POR', vendido: false },

    // --- LIGA PERUANA (2 JUGADORES - VARIOS CLUBES) ---
    { id: 119, nombre: "Ángelo Campos (Alianza Lima)", media: 75, precio_sugerido: 48000000, puesto: 'POR', vendido: false }, 
    { id: 120, nombre: "Carvallo (Universitario)", media: 72, precio_sugerido: 40000000, puesto: 'POR', vendido: false },
];

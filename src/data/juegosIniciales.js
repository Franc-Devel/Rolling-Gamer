const req = {
  minimos: { so: "Windows 10 64-bit", procesador: "Intel i5 / AMD Ryzen 5", memoria: "8 GB RAM", graficos: "GTX 1060 6GB", almacenamiento: "50 GB SSD" },
  recomendados: { so: "Windows 11 64-bit", procesador: "Intel i7 / AMD Ryzen 7", memoria: "16 GB RAM", graficos: "RTX 3070 8GB", almacenamiento: "50 GB SSD" }
};

const crearJuego = (id, nombre, precio, descuento, categoria, desarrollador, imagen, destacado, breve) => ({
  id, nombre, precio, descuento, categoria, desarrollador, editor: desarrollador,
  fechaLanzamiento: "2023-01-01", destacado, imagen, galeria: [imagen],
  descripcion_breve: breve, descripcion_amplia: breve, requisitos: req,
  resenas: [{ id: `r-${id}`, usuario: "GamerPro", fecha: "2024-01-15", esPositiva: true, comentario: "Excelente experiencia de juego." }]
});

export const juegosIniciales = [
  crearJuego("game-1", "Cyberpunk 2077", 35000, 25, "RPG", "CD PROJEKT RED", "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80", true, "Aventura de rol y acción futurista en Night City."),
  crearJuego("game-2", "The Witcher 3: Wild Hunt", 22000, 40, "RPG", "CD PROJEKT RED", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80", true, "RPG de fantasía oscura y cacería de monstruos."),
  crearJuego("game-3", "Red Dead Redemption 2", 42000, 20, "Acción", "Rockstar Games", "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80", true, "Aventura de forajidos en el salvaje oeste americano."),
  crearJuego("game-4", "God of War Ragnarök", 48000, 15, "Acción", "Santa Monica Studio", "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80", true, "Viaje mítico nórdico de Kratos y Atreus."),
  crearJuego("game-5", "Resident Evil 4 Remake", 38000, 30, "Terror", "Capcom", "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1200&q=80", true, "Survival horror legendario reimaginado."),
  crearJuego("game-6", "EA Sports FC 24", 36000, 35, "Deportes", "EA Canada", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80", false, "La nueva era del fútbol mundial con licencias oficiales."),
  crearJuego("game-7", "Age of Empires IV", 28000, 25, "Estrategia", "Relic Entertainment", "https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=1200&q=80", false, "Estrategia en tiempo real con batallas históricas."),
  crearJuego("game-8", "Microsoft Flight Simulator", 32000, 10, "Simulación", "Asobo Studio", "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80", false, "Simulador de aviación fotorrealista por el mundo."),
  crearJuego("game-9", "Hollow Knight", 12000, 50, "Indie", "Team Cherry", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", false, "Metroidvania 2D desafiante en el reino de Hallownest."),
  crearJuego("game-10", "Elden Ring", 45000, 20, "Aventura", "FromSoftware", "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80", false, "Mundo abierto de fantasía oscura en las Tierras Intermedias.")
];

export default juegosIniciales;

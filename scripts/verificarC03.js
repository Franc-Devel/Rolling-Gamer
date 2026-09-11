/* eslint-disable no-undef */
/**
 * Script de validación automatizada de los Criterios de Aceptación para la Card C03:
 * 1. Inicialización y persistencia en 'productosKey'
 * 2. Conservación de cambios al recargar aunque queden menos de 10 juegos
 * 3. Recuperación de datos inválidos sin bloquearse
 * 4. Firmas acordadas: crearProducto, borrarProducto, buscarProducto, modificarProducto
 * 5. Modificar producto conserva inmutables el ID y las reseñas existentes
 * 6. agregarResena agrega la opinión al juego correcto y actualiza persistencia
 */

// Mock de localStorage en entorno Node.js
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
};

import {
  PRODUCTOS_KEY,
  obtenerProductos,
  crearProducto,
  borrarProducto,
  buscarProducto,
  modificarProducto,
  agregarResena,
  recargarCatalogoInicial
} from "../src/services/catalogoService.js";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALLÓ: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ APROBADO: ${message}`);
  }
}

console.log("=== INICIANDO VALIDACIÓN DE CRITERIOS CARD C03 ===");

// 1. Inicialización en localStorage
storage.clear();
const iniciales = obtenerProductos();
assert(Array.isArray(iniciales) && iniciales.length >= 10, "1. Inicializa catálogo base cuando productosKey no existe.");
assert(storage.has(PRODUCTOS_KEY), "1.1. Persiste bajo la clave 'productosKey'.");

// 2. Conservación de cambios aunque queden menos de 10 juegos
borrarProducto(iniciales[0].id);
borrarProducto(iniciales[1].id);
borrarProducto(iniciales[2].id);
const restantes = obtenerProductos();
assert(restantes.length === 7, `2. Conserva cambios al recargar quedando menos de 10 juegos (quedan ${restantes.length}).`);

// 3. Recuperación de datos inválidos sin bloquearse
storage.set(PRODUCTOS_KEY, "ESTO_NO_ES_UN_JSON_VALIDO{{{}}");
let recuperados;
try {
  recuperados = obtenerProductos();
  assert(Array.isArray(recuperados) && recuperados.length >= 10, "3. Recupera datos corruptos sin bloquearse devolviendo catálogo restaurado.");
} catch (e) {
  assert(false, `3. Arrojó excepción con JSON corrupto: ${e.message}`);
}

// 4. Crear producto
const nuevoJuego = {
  nombre: "Test Game 2026",
  precio: 25000,
  descuento: 10,
  categoria: "Acción",
  desarrollador: "Indie Studio",
  imagen: "https://example.com/img.jpg"
};
const creado = crearProducto(nuevoJuego);
assert(creado && creado.id, "4. crearProducto genera ID único.");
assert(Array.isArray(creado.resenas), "4.1. crearProducto inicializa array de reseñas.");

// 5. Buscar producto
const buscado = buscarProducto(creado.id);
assert(buscado && buscado.nombre === "Test Game 2026", "5. buscarProducto encuentra el juego por ID.");

// 6. Agregar reseña
const resena = {
  usuario: "Francisco",
  comentario: "Excelente rendimiento y jugabilidad.",
  esPositiva: true
};
const juegoConResena = agregarResena(creado.id, resena);
assert(
  juegoConResena.resenas.some((r) => r.usuario === "Francisco"),
  "6. agregarResena agrega la opinión al juego correcto."
);
const persistidoConResena = buscarProducto(creado.id);
assert(
  persistidoConResena.resenas.length > 0 && persistidoConResena.resenas[0].usuario === "Francisco",
  "6.1. La reseña queda persistida en productosKey."
);

// 7. Modificar producto conservando ID y reseñas
const resenasPreviasCount = persistidoConResena.resenas.length;
const idOriginal = persistidoConResena.id;
const modificado = modificarProducto({
  id: idOriginal,
  nombre: "Test Game 2026 - Edición Deluxe",
  precio: 32000,
  desarrollador: "Indie Studio Master"
});
assert(modificado.id === idOriginal, "7. modificarProducto conserva el ID original inmutable.");
assert(modificado.resenas.length === resenasPreviasCount, "7.1. modificarProducto conserva las reseñas previas.");
assert(modificado.nombre === "Test Game 2026 - Edición Deluxe", "7.2. modificarProducto actualiza los campos modificables.");

// 8. Borrar producto
const borrado = borrarProducto(creado.id);
assert(borrado === true, "8. borrarProducto retorna true al eliminar.");
assert(buscarProducto(creado.id) === null, "8.1. Producto eliminado ya no existe en productosKey.");

// 9. Recargar catálogo
const restaurados = recargarCatalogoInicial();
assert(restaurados.length === 10, "9. recargarCatalogoInicial restaura los 10 juegos de fábrica.");

console.log("=== TODOS LOS CRITERIOS DE ACEPTACIÓN VALIDADOS CON ÉXITO ===");

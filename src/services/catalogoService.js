import juegosIniciales from "../data/juegosIniciales.js";

export const PRODUCTOS_KEY = "productosKey";

/**
 * Recupera el catálogo de videojuegos desde localStorage.
 * Garantiza que:
 * 1. Si no existe la clave, se inicializa con los juegos iniciales predeterminados.
 * 2. Si ya existen datos (incluso si quedan menos de 10 juegos por eliminaciones), se conservan los cambios.
 * 3. Si los datos almacenados están corruptos o son inválidos, se recupera sin bloquear la aplicación.
 *
 * @returns {Array<Object>} Lista de videojuegos válidos
 */
export const obtenerProductos = () => {
  try {
    const datosAlmacenados = localStorage.getItem(PRODUCTOS_KEY);

    if (datosAlmacenados === null || datosAlmacenados === undefined) {
      guardarProductos(juegosIniciales);
      return [...juegosIniciales];
    }

    const productosParseados = JSON.parse(datosAlmacenados);

    if (Array.isArray(productosParseados)) {
      return productosParseados;
    }

    console.warn("Los datos de productosKey no son un arreglo válido. Restaurando catálogo base.");
    guardarProductos(juegosIniciales);
    return [...juegosIniciales];
  } catch (error) {
    console.error("Error al parsear productosKey desde localStorage. Recuperando datos base sin bloquearse:", error);
    guardarProductos(juegosIniciales);
    return [...juegosIniciales];
  }
};

/**
 * Persiste la lista de productos en localStorage bajo la clave acordada.
 *
 * @param {Array<Object>} productos Lista de videojuegos a persistir
 */
export const guardarProductos = (productos) => {
  try {
    if (!Array.isArray(productos)) {
      throw new Error("El valor a guardar en productosKey debe ser un arreglo.");
    }
    localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
  } catch (error) {
    console.error("Error al guardar productos en localStorage:", error);
  }
};

/**
 * Busca un producto en el catálogo persistente mediante su identificador.
 *
 * @param {string} id Identificador único del videojuego
 * @returns {Object|null} El producto coincidente o null si no se encuentra
 */
export const buscarProducto = (id) => {
  if (!id) return null;
  const productos = obtenerProductos();
  const productoEncontrado = productos.find((item) => String(item.id) === String(id));
  return productoEncontrado ? { ...productoEncontrado } : null;
};

/**
 * Crea un nuevo videojuego en el catálogo persistente asignando ID y estructura base.
 *
 * @param {Object} nuevoProducto Datos del videojuego a dar de alta
 * @returns {Object} El videojuego creado y persistido
 */
export const crearProducto = (nuevoProducto) => {
  if (!nuevoProducto || typeof nuevoProducto !== "object") {
    throw new Error("Datos inválidos para la creación del videojuego.");
  }

  const productosActuales = obtenerProductos();
  const nuevoId = nuevoProducto.id || `game-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const productoListo = {
    ...nuevoProducto,
    id: String(nuevoId),
    precio: Number(nuevoProducto.precio) || 0,
    descuento: Number(nuevoProducto.descuento) || 0,
    destacado: Boolean(nuevoProducto.destacado),
    resenas: Array.isArray(nuevoProducto.resenas) ? nuevoProducto.resenas : [],
    fechaLanzamiento: nuevoProducto.fechaLanzamiento || new Date().toISOString().split("T")[0]
  };

  const listaActualizada = [productoListo, ...productosActuales];
  guardarProductos(listaActualizada);

  return productoListo;
};


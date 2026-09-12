import usuariosIniciales from "../data/usuariosIniciales.js";

export const USUARIOS_KEY = "rollingGamer_usuariosRegistrados";
export const SESION_KEY = "rollingGamer_usuario";
export const WISHLISTS_KEY = "rollingGamer_wishlists";

/**
 * Elimina la contraseña de un objeto de usuario antes de guardarlo en sesión o exponerlo.
 * @param {Object} usuario 
 * @returns {Object|null}
 */
export const sanitizarUsuario = (usuario) => {
  if (!usuario) return null;
  // eslint-disable-next-line no-unused-vars
  const { password, ...usuarioSeguro } = usuario;
  return usuarioSeguro;
};

/**
 * Obtiene la lista de usuarios registrados en localStorage.
 * Si no existen o los datos están corruptos, inicializa con usuariosIniciales.
 * @returns {Array}
 */
export const obtenerUsuarios = () => {
  try {
    const datos = localStorage.getItem(USUARIOS_KEY);
    if (!datos) {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciales));
      return [...usuariosIniciales];
    }
    const parseados = JSON.parse(datos);
    if (!Array.isArray(parseados)) {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciales));
      return [...usuariosIniciales];
    }
    return parseados;
  } catch (err) {
    console.error("Error al leer usuarios de localStorage, restaurando base:", err);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciales));
    return [...usuariosIniciales];
  }
};

/**
 * Guarda la lista de usuarios en localStorage de forma persistente.
 * @param {Array} usuarios 
 */
export const guardarUsuarios = (usuarios) => {
  try {
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  } catch (err) {
    console.error("Error al guardar usuarios:", err);
  }
};

/**
 * Recupera la sesión persistente del usuario activo.
 * @returns {Object|null}
 */
export const obtenerSesionActual = () => {
  try {
    const sesion = localStorage.getItem(SESION_KEY);
    if (!sesion) return null;
    const datos = JSON.parse(sesion);
    return sanitizarUsuario(datos);
  } catch (err) {
    console.error("Error al leer sesión activa:", err);
    return null;
  }
};

/**
 * Persiste la sesión del usuario activo eliminando previamente la contraseña.
 * @param {Object} usuario 
 * @returns {Object|null}
 */
export const guardarSesionActual = (usuario) => {
  try {
    const sesionSegura = sanitizarUsuario(usuario);
    if (sesionSegura) {
      localStorage.setItem(SESION_KEY, JSON.stringify(sesionSegura));
    } else {
      localStorage.removeItem(SESION_KEY);
    }
    return sesionSegura;
  } catch (err) {
    console.error("Error al guardar sesión activa:", err);
    return null;
  }
};

/**
 * Elimina la sesión persistente de localStorage.
 * @returns {Object}
 */
export const eliminarSesionActual = () => {
  try {
    localStorage.removeItem(SESION_KEY);
    return { success: true, exito: true, mensaje: "Sesión finalizada exitosamente." };
  } catch (err) {
    console.error("Error al eliminar sesión:", err);
    return { success: false, exito: false, mensaje: "No se pudo cerrar la sesión." };
  }
};

/**
 * Registra un nuevo usuario en el sistema garantizando unicidad de correo electrónico
 * insensible a mayúsculas/minúsculas, rol 'usuario' e inicio de sesión automático.
 * @param {Object|string} datosOEmail 
 * @param {string} [password] 
 * @param {string} [nombreParam] 
 * @returns {Object}
 */
export const registrarUsuario = (datosOEmail, password = "", nombreParam = "") => {
  try {
    let nombre = "";
    let email = "";
    let contrasena = "";

    if (typeof datosOEmail === "object" && datosOEmail !== null) {
      nombre = datosOEmail.nombre || "";
      email = datosOEmail.email || "";
      contrasena = datosOEmail.password || "";
    } else {
      email = datosOEmail || "";
      contrasena = password || "";
      nombre = nombreParam || (email ? email.split("@")[0] : "Usuario");
    }

    if (!nombre.trim()) {
      return { success: false, exito: false, mensaje: "El nombre es obligatorio." };
    }
    if (!email.trim()) {
      return { success: false, exito: false, mensaje: "El correo electrónico es obligatorio." };
    }
    if (!contrasena) {
      return { success: false, exito: false, mensaje: "La contraseña es obligatoria." };
    }

    const emailNormalizado = email.trim().toLowerCase();
    const usuarios = obtenerUsuarios();

    // Verificación de email duplicado insensible a mayúsculas/minúsculas
    const existeDuplicado = usuarios.some(
      (u) => u.email.trim().toLowerCase() === emailNormalizado
    );

    if (existeDuplicado) {
      return {
        success: false,
        exito: false,
        mensaje: "El correo electrónico ya se encuentra registrado."
      };
    }

    const nuevoUsuario = {
      id: `user-${Date.now()}`,
      nombre: nombre.trim(),
      email: emailNormalizado,
      password: String(contrasena),
      rol: "usuario",
      fechaRegistro: new Date().toISOString().split("T")[0]
    };

    const usuariosActualizados = [...usuarios, nuevoUsuario];
    guardarUsuarios(usuariosActualizados);

    // Iniciar sesión automáticamente sin guardar la contraseña en la copia de sesión
    const sesionIniciada = guardarSesionActual(nuevoUsuario);

    return {
      success: true,
      exito: true,
      usuario: sesionIniciada,
      usuarios: usuariosActualizados,
      mensaje: "Cuenta creada con éxito. Sesión iniciada automáticamente."
    };
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return {
      success: false,
      exito: false,
      mensaje: "Ocurrió un error inesperado durante el registro."
    };
  }
};

/**
 * Autentica un usuario mediante sus credenciales.
 * Verifica correo (insensible a mayúsculas) y contraseña,
 * generando una sesión persistente desprovista de contraseñas.
 * @param {string} email 
 * @param {string} password 
 * @returns {Object}
 */
export const autenticarUsuario = (email, password) => {
  try {
    if (!email || !password) {
      return {
        success: false,
        exito: false,
        mensaje: "Por favor proporciona correo electrónico y contraseña."
      };
    }

    const emailNormalizado = email.trim().toLowerCase();
    const listaUsuarios = obtenerUsuarios();

    const usuarioEncontrado = listaUsuarios.find(
      (u) => u.email.trim().toLowerCase() === emailNormalizado && u.password === password
    );

    if (!usuarioEncontrado) {
      return {
        success: false,
        exito: false,
        mensaje: "Credenciales inválidas. Verifica tu correo y contraseña."
      };
    }

    // Persistir copia de sesión libre de contraseñas
    const sesion = guardarSesionActual(usuarioEncontrado);

    return {
      success: true,
      exito: true,
      usuario: sesion,
      mensaje: `¡Bienvenido de vuelta, ${sesion.nombre}!`
    };
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    return {
      success: false,
      exito: false,
      mensaje: "Error inesperado al iniciar sesión."
    };
  }
};

/**
 * Da de baja a un usuario registrado en el sistema.
 * Impide explícitamente la eliminación de la cuenta que se encuentra actualmente activa.
 * Tras la baja, una cuenta eliminada queda inhabilitada para iniciar nueva sesión.
 * @param {string} idAEliminar 
 * @param {string|null} idUsuarioActivo 
 * @returns {Object}
 */
export const eliminarUsuario = (idAEliminar, idUsuarioActivo = null) => {
  try {
    if (!idAEliminar) {
      return {
        success: false,
        exito: false,
        mensaje: "Identificador de usuario no proporcionado."
      };
    }

    // Regla de aceptación: la baja de usuarios impide eliminar la cuenta activa
    if (idUsuarioActivo && String(idAEliminar) === String(idUsuarioActivo)) {
      return {
        success: false,
        exito: false,
        mensaje: "No es posible eliminar la cuenta que tiene la sesión activa actualmente."
      };
    }

    const usuarios = obtenerUsuarios();
    const usuarioAEliminar = usuarios.find((u) => String(u.id) === String(idAEliminar));

    if (!usuarioAEliminar) {
      return {
        success: false,
        exito: false,
        mensaje: "El usuario especificado no existe o ya fue eliminado."
      };
    }

    const usuariosFiltrados = usuarios.filter((u) => String(u.id) !== String(idAEliminar));
    guardarUsuarios(usuariosFiltrados);

    return {
      success: true,
      exito: true,
      usuarioEliminado: sanitizarUsuario(usuarioAEliminar),
      usuarios: usuariosFiltrados,
      mensaje: `El usuario "${usuarioAEliminar.nombre}" fue dado de baja exitosamente.`
    };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return {
      success: false,
      exito: false,
      mensaje: "Ocurrió un error inesperado al eliminar el usuario."
    };
  }
};

/**
 * Obtiene el mapa completo de listas de deseos indexadas por identificador de cuenta.
 * @returns {Object}
 */
export const obtenerMapaWishlists = () => {
  try {
    const datos = localStorage.getItem(WISHLISTS_KEY);
    return datos ? JSON.parse(datos) : {};
  } catch (err) {
    console.error("Error al leer mapa de wishlists:", err);
    return {};
  }
};

/**
 * Persiste el mapa de listas de deseos por cuenta en localStorage.
 * @param {Object} mapa 
 */
export const guardarMapaWishlists = (mapa) => {
  try {
    localStorage.setItem(WISHLISTS_KEY, JSON.stringify(mapa));
  } catch (err) {
    console.error("Error al guardar mapa de wishlists:", err);
  }
};

/**
 * Obtiene los identificadores de juegos en la lista de deseos de una cuenta específica.
 * Garantiza ausencia de IDs duplicados.
 * @param {string|null} usuarioId 
 * @returns {Array<string>}
 */
export const obtenerWishlistDeCuenta = (usuarioId) => {
  if (!usuarioId) return [];
  const mapa = obtenerMapaWishlists();
  const lista = Array.isArray(mapa[usuarioId]) ? mapa[usuarioId] : [];
  // Garantizar sin duplicados
  return Array.from(new Set(lista.map(String)));
};

/**
 * Alterna el estado de un videojuego en la lista de deseos de un usuario.
 * Si el usuario no está autenticado, devuelve requireAuth: true.
 * Evita IDs duplicados y persiste el resultado por cuenta.
 * @param {string|null} usuarioId 
 * @param {string|number} juegoId 
 * @returns {Object}
 */
export const alternarDeseo = (usuarioId, juegoId) => {
  // Criterio de aceptación: Sin autenticación, alternar deseos devuelve requireAuth
  if (!usuarioId) {
    return {
      success: false,
      exito: false,
      requireAuth: true,
      isWishlisted: false,
      wishlistIds: [],
      mensaje: "Debes iniciar sesión para agregar videojuegos a tu lista de deseos."
    };
  }

  if (!juegoId && juegoId !== 0) {
    return {
      success: false,
      exito: false,
      requireAuth: false,
      isWishlisted: false,
      mensaje: "Identificador de juego inválido."
    };
  }

  const strJuegoId = String(juegoId);
  const mapa = obtenerMapaWishlists();
  const actuales = Array.isArray(mapa[usuarioId]) ? mapa[usuarioId].map(String) : [];

  const yaExiste = actuales.includes(strJuegoId);
  const nuevaLista = yaExiste
    ? actuales.filter((id) => id !== strJuegoId)
    : Array.from(new Set([...actuales, strJuegoId]));

  mapa[usuarioId] = nuevaLista;
  guardarMapaWishlists(mapa);

  const isWishlisted = !yaExiste;

  return {
    success: true,
    exito: true,
    requireAuth: false,
    isWishlisted,
    wishlistIds: nuevaLista,
    mensaje: isWishlisted
      ? "Videojuego agregado a tu lista de deseos."
      : "Videojuego eliminado de tu lista de deseos."
  };
};

/**
 * Obtiene los objetos completos de videojuegos de la lista de deseos de un usuario.
 * @param {string|null} usuarioId 
 * @param {Array} catalogoProductos 
 * @returns {Array}
 */
export const obtenerJuegosDeseados = (usuarioId, catalogoProductos = []) => {
  if (!usuarioId) return [];
  const ids = obtenerWishlistDeCuenta(usuarioId);
  if (ids.length === 0 || !Array.isArray(catalogoProductos)) return [];
  return catalogoProductos.filter((prod) => ids.includes(String(prod.id)));
};

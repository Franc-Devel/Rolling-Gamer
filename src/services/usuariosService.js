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

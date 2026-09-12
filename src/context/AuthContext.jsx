/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import {
  obtenerUsuarios,
  obtenerSesionActual,
  guardarSesionActual,
  eliminarSesionActual,
  registrarUsuario as registrarUsuarioServicio,
  autenticarUsuario,
  eliminarUsuario as eliminarUsuarioServicio,
  obtenerWishlistDeCuenta,
  alternarDeseo,
  obtenerJuegosDeseados,
  USUARIOS_KEY,
  SESION_KEY,
  WISHLISTS_KEY
} from "../services/usuariosService.js";
import { obtenerProductos } from "../services/catalogoService.js";
import usuariosIniciales from "../data/usuariosIniciales.js";

const AuthContext = createContext();

export const USUARIO_KEY = SESION_KEY;
export const USUARIOS_REGISTRADOS_KEY = USUARIOS_KEY;
export { WISHLISTS_KEY };

export const AuthProvider = ({ children }) => {
  // Inicialización perezosa de usuarios registrados y sesión activa
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
  const [usuarioActual, setUsuarioActual] = useState(() => obtenerSesionActual());
  const [wishlistIds, setWishlistIds] = useState(() =>
    obtenerWishlistDeCuenta(obtenerSesionActual()?.id)
  );
  const [cargando] = useState(false);

  /**
   * Inicia sesión verificando credenciales del usuario registrado.
   * Genera sesión limpia desprovista de contraseñas.
   */
  const login = useCallback((email, password) => {
    const resultado = autenticarUsuario(email, password);
    if (resultado.success) {
      setUsuarioActual(resultado.usuario);
      setWishlistIds(obtenerWishlistDeCuenta(resultado.usuario.id));
    }
    return resultado;
  }, []);

  /**
   * Registra un nuevo usuario previniendo duplicados de email insensible a mayúsculas,
   * asigna rol 'usuario', persiste en localStorage e inicia sesión de inmediato.
   */
  const register = useCallback((datosOEmail, password, nombre) => {
    const resultado = registrarUsuarioServicio(datosOEmail, password, nombre);
    if (resultado.success) {
      setUsuarios(resultado.usuarios);
      setUsuarioActual(resultado.usuario);
      setWishlistIds(obtenerWishlistDeCuenta(resultado.usuario.id));
    }
    return resultado;
  }, []);

  /**
   * Cierra la sesión activa eliminando los datos de localStorage.
   */
  const logout = useCallback(() => {
    const resultado = eliminarSesionActual();
    setUsuarioActual(null);
    setWishlistIds([]);
    return resultado;
  }, []);

  /**
   * Da de baja a un usuario registrado. Impide eliminar la cuenta activa actual.
   * La cuenta eliminada no podrá iniciar nueva sesión.
   */
  const borrarUsuario = useCallback((id) => {
    const resultado = eliminarUsuarioServicio(id, usuarioActual?.id);
    if (resultado.success) {
      setUsuarios(resultado.usuarios);
    }
    return resultado;
  }, [usuarioActual]);

  /**
   * Comprueba si un juego se encuentra en la lista de deseos del usuario activo.
   */
  const isWishlisted = useCallback((juegoId) => {
    if (!usuarioActual) return false;
    return wishlistIds.includes(String(juegoId));
  }, [usuarioActual, wishlistIds]);

  /**
   * Alterna un videojuego en la lista de deseos del usuario autenticado.
   * Si no está autenticado, devuelve requireAuth: true.
   */
  const toggleWishlist = useCallback((juegoId) => {
    if (!usuarioActual) {
      return {
        success: false,
        exito: false,
        requireAuth: true,
        isWishlisted: false,
        wishlistIds: [],
        mensaje: "Debes iniciar sesión para gestionar tu lista de deseos."
      };
    }
    const resultado = alternarDeseo(usuarioActual.id, juegoId);
    if (resultado.success) {
      setWishlistIds(resultado.wishlistIds);
    }
    return resultado;
  }, [usuarioActual]);

  /**
   * Recupera los objetos de videojuegos en la lista de deseos de la cuenta activa.
   */
  const getWishlistJuegos = useCallback((catalogoOpcional) => {
    if (!usuarioActual) return [];
    let catalogo = catalogoOpcional;
    if (!catalogo) {
      try {
        catalogo = obtenerProductos();
      } catch (err) {
        console.error("Error al obtener catálogo para wishlist:", err);
        catalogo = [];
      }
    }
    return obtenerJuegosDeseados(usuarioActual.id, catalogo);
  }, [usuarioActual]);

  /**
   * Acceso rápido para pruebas y evaluación docente
   */
  const loginRapido = useCallback((tipo) => {
    const lista = obtenerUsuarios();
    const cuenta = lista.find((u) => u.rol === tipo) || usuariosIniciales.find((u) => u.rol === tipo);
    if (cuenta) {
      const sesion = guardarSesionActual(cuenta);
      setUsuarioActual(sesion);
      setWishlistIds(obtenerWishlistDeCuenta(sesion.id));
      return sesion;
    }
    return null;
  }, []);

  const esAdmin = Boolean(usuarioActual && usuarioActual.rol === "admin");
  const estaAutenticado = Boolean(usuarioActual);

  const value = {
    usuarios,
    usuarioActual,
    usuario: usuarioActual, // Compatibilidad retrospectiva con Card C03
    cargando,
    esAdmin,
    estaAutenticado,
    login,
    register,
    logout,
    borrarUsuario,
    wishlistIds,
    isWishlisted,
    toggleWishlist,
    getWishlistJuegos,
    loginRapido
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;

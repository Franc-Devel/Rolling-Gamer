/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  obtenerUsuarios,
  obtenerSesionActual,
  guardarSesionActual,
  eliminarSesionActual,
  registrarUsuario as registrarUsuarioServicio,
  autenticarUsuario,
  eliminarUsuario as eliminarUsuarioServicio,
  USUARIOS_KEY,
  SESION_KEY,
  WISHLISTS_KEY
} from "../services/usuariosService.js";
import usuariosIniciales from "../data/usuariosIniciales.js";

const AuthContext = createContext();

export const USUARIO_KEY = SESION_KEY;
export const USUARIOS_REGISTRADOS_KEY = USUARIOS_KEY;
export { WISHLISTS_KEY };

export const AuthProvider = ({ children }) => {
  // Inicialización perezosa de usuarios registrados y sesión activa
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
  const [usuarioActual, setUsuarioActual] = useState(() => obtenerSesionActual());
  const [cargando] = useState(false);

  // Asegurar consistencia de usuarios en localStorage al montar
  useEffect(() => {
    try {
      const lista = obtenerUsuarios();
      setUsuarios(lista);
    } catch (error) {
      console.error("Error al sincronizar usuarios en AuthProvider:", error);
    }
  }, []);

  /**
   * Inicia sesión verificando credenciales del usuario registrado.
   * Genera sesión limpia desprovista de contraseñas.
   */
  const login = useCallback((email, password) => {
    const resultado = autenticarUsuario(email, password);
    if (resultado.success) {
      setUsuarioActual(resultado.usuario);
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
    }
    return resultado;
  }, []);

  /**
   * Cierra la sesión activa eliminando los datos de localStorage.
   */
  const logout = useCallback(() => {
    const resultado = eliminarSesionActual();
    setUsuarioActual(null);
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
   * Acceso rápido para pruebas y evaluación docente
   */
  const loginRapido = useCallback((tipo) => {
    const lista = obtenerUsuarios();
    const cuenta = lista.find((u) => u.rol === tipo) || usuariosIniciales.find((u) => u.rol === tipo);
    if (cuenta) {
      const sesion = guardarSesionActual(cuenta);
      setUsuarioActual(sesion);
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

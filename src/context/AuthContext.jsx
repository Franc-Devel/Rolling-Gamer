/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import usuariosIniciales from "../data/usuariosIniciales.js";

const AuthContext = createContext();

export const USUARIO_KEY = "rollingGamer_usuario";
export const USUARIOS_REGISTRADOS_KEY = "rollingGamer_usuariosRegistrados";

export const AuthProvider = ({ children }) => {
  // Inicialización perezosa de la sesión sin efectos secundarios síncronos
  const [usuario, setUsuario] = useState(() => {
    try {
      const usuarioGuardado = localStorage.getItem(USUARIO_KEY);
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    } catch (err) {
      console.error("Error al leer sesión inicial:", err);
      return null;
    }
  });

  const [cargando] = useState(false);

  // Inicialización de la lista de usuarios si no existe
  useEffect(() => {
    try {
      const usuariosRegistrados = localStorage.getItem(USUARIOS_REGISTRADOS_KEY);
      if (!usuariosRegistrados) {
        localStorage.setItem(USUARIOS_REGISTRADOS_KEY, JSON.stringify(usuariosIniciales));
      }
    } catch (error) {
      console.error("Error al inicializar lista de usuarios:", error);
    }
  }, []);

  const login = useCallback((email, password) => {
    try {
      const datosUsuarios = localStorage.getItem(USUARIOS_REGISTRADOS_KEY);
      const listaUsuarios = datosUsuarios ? JSON.parse(datosUsuarios) : usuariosIniciales;

      const usuarioEncontrado = listaUsuarios.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (!usuarioEncontrado) {
        return { exito: false, mensaje: "Credenciales inválidas. Verifica tu correo y contraseña." };
      }

      const datosSesion = {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        email: usuarioEncontrado.email,
        rol: usuarioEncontrado.rol
      };

      setUsuario(datosSesion);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(datosSesion));

      return { exito: true, usuario: datosSesion };
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      return { exito: false, mensaje: "Error inesperado al iniciar sesión." };
    }
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem(USUARIO_KEY);
  }, []);

  // Función para acceso rápido demo
  const loginRapido = useCallback((tipo) => {
    const cuenta = usuariosIniciales.find((u) => u.rol === tipo);
    if (cuenta) {
      const datosSesion = {
        id: cuenta.id,
        nombre: cuenta.nombre,
        email: cuenta.email,
        rol: cuenta.rol
      };
      setUsuario(datosSesion);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(datosSesion));
      return datosSesion;
    }
    return null;
  }, []);

  const value = {
    usuario,
    cargando,
    esAdmin: Boolean(usuario && usuario.rol === "admin"),
    estaAutenticado: Boolean(usuario),
    login,
    logout,
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

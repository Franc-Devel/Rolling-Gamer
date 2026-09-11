/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  obtenerProductos,
  crearProducto as crearProductoService,
  borrarProducto as borrarProductoService,
  buscarProducto as buscarProductoService,
  modificarProducto as modificarProductoService,
  agregarResena as agregarResenaService,
  recargarCatalogoInicial as recargarCatalogoService,
  PRODUCTOS_KEY
} from "../services/catalogoService.js";

const ProductosContext = createContext();

export const ProductosProvider = ({ children }) => {
  // Inicialización perezosa de estado según mejores prácticas de React 19
  const [productos, setProductos] = useState(() => {
    try {
      return obtenerProductos();
    } catch (error) {
      console.error("Error al inicializar productos:", error);
      return [];
    }
  });

  const [cargando] = useState(false);

  // Escuchar cambios en otras pestañas o ventanas
  useEffect(() => {
    const sincronizarStorage = (e) => {
      if (e.key === PRODUCTOS_KEY && e.newValue) {
        try {
          const nuevos = JSON.parse(e.newValue);
          if (Array.isArray(nuevos)) {
            setProductos(nuevos);
          }
        } catch (err) {
          console.error("Error al sincronizar localStorage en pestaña:", err);
        }
      }
    };
    window.addEventListener("storage", sincronizarStorage);
    return () => window.removeEventListener("storage", sincronizarStorage);
  }, []);

  const crearProducto = useCallback((nuevoProducto) => {
    const productoCreado = crearProductoService(nuevoProducto);
    setProductos(obtenerProductos());
    return productoCreado;
  }, []);

  const borrarProducto = useCallback((id) => {
    const exito = borrarProductoService(id);
    if (exito) {
      setProductos(obtenerProductos());
    }
    return exito;
  }, []);

  const buscarProducto = useCallback((id) => {
    return buscarProductoService(id);
  }, []);

  const modificarProducto = useCallback((productoActualizado) => {
    const productoModificado = modificarProductoService(productoActualizado);
    setProductos(obtenerProductos());
    return productoModificado;
  }, []);

  const agregarResena = useCallback((idJuego, nuevaResena) => {
    const productoConResena = agregarResenaService(idJuego, nuevaResena);
    setProductos(obtenerProductos());
    return productoConResena;
  }, []);

  const recargarCatalogo = useCallback(() => {
    const catalogoBase = recargarCatalogoService();
    setProductos(catalogoBase);
    return catalogoBase;
  }, []);

  const value = {
    productos,
    cargando,
    crearProducto,
    borrarProducto,
    buscarProducto,
    modificarProducto,
    agregarResena,
    recargarCatalogo
  };

  return (
    <ProductosContext.Provider value={value}>
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductos = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error("useProductos debe ser utilizado dentro de un ProductosProvider");
  }
  return context;
};

export default ProductosContext;

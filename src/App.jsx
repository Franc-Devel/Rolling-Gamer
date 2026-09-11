import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UIModalProvider } from "./context/UIModalContext.jsx";
import { ProductosProvider } from "./context/ProductosContext.jsx";

import Menu from "./components/common/Menu.jsx";
import Footer from "./components/common/Footer.jsx";
import RutaProtegida from "./components/common/RutaProtegida.jsx";

import Inicio from "./components/pages/Inicio.jsx";
import DetalleDeProducto from "./components/pages/DetalleDeProducto.jsx";
import Login from "./components/pages/Login.jsx";
import Wishlist from "./components/pages/Wishlist.jsx";
import About from "./components/pages/About.jsx";
import Administrador from "./components/pages/Administrador.jsx";
import FormularioProducto from "./components/pages/producto/FormularioProducto.jsx";
import Error404 from "./components/pages/Error404.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIModalProvider>
          <ProductosProvider>
            <div className="d-flex flex-column min-vh-100 bg-dark text-light">
              <Menu />
              <main className="flex-grow-1">
                <Routes>
                  {/* Ruta de Inicio */}
                  <Route path="/" element={<Inicio />} />

                  {/* Ficha técnica y detalle */}
                  <Route path="/detalle/:id" element={<DetalleDeProducto />} />

                  {/* Autenticación y acceso */}
                  <Route path="/login" element={<Login />} />

                  {/* Lista de deseos */}
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/deseos" element={<Navigate to="/wishlist" replace />} />

                  {/* Equipo y metodologías */}
                  <Route path="/about" element={<About />} />
                  <Route path="/equipo" element={<Navigate to="/about" replace />} />

                  {/* Panel administrativo protegido */}
                  <Route
                    path="/admin"
                    element={
                      <RutaProtegida>
                        <Administrador />
                      </RutaProtegida>
                    }
                  />

                  {/* Creación y edición de videojuegos protegidas */}
                  <Route
                    path="/crear"
                    element={
                      <RutaProtegida>
                        <FormularioProducto />
                      </RutaProtegida>
                    }
                  />
                  <Route
                    path="/editar/:id"
                    element={
                      <RutaProtegida>
                        <FormularioProducto />
                      </RutaProtegida>
                    }
                  />

                  {/* Criterio de aceptación: /administrador redirige a /admin */}
                  <Route path="/administrador" element={<Navigate to="/admin" replace />} />

                  {/* Pantalla 404 para rutas no encontradas */}
                  <Route path="*" element={<Error404 />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ProductosProvider>
        </UIModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

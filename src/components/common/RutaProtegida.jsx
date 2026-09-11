import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Spinner from "react-bootstrap/Spinner";

/**
 * Componente guardián para proteger rutas administrativas.
 * Verifica si el usuario actual tiene sesión iniciada y posee el rol de administrador.
 * En caso negativo, redirige a la pantalla de login preservando la ubicación original.
 */
const RutaProtegida = ({ children }) => {
  const { usuario, cargando, esAdmin } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 min-vh-50">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Verificando permisos...</span>
        </Spinner>
      </div>
    );
  }

  if (!usuario || !esAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RutaProtegida;

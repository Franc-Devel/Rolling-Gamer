import { NavLink, Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../context/AuthContext.jsx";

const Menu = () => {
  const { usuario, esAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky-top">
      {/* Topbar temática Epic */}
      <div className="epic-topbar d-none d-md-block">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <span className="epic-topbar-link active">TIENDA</span>
            <Link to="/about" className="epic-topbar-link">DISTRIBUCIÓN</Link>
            <Link to="/about" className="epic-topbar-link">COMUNIDAD</Link>
            <Link to="/about" className="epic-topbar-link">SOPORTE</Link>
          </div>
          <div className="d-flex align-items-center gap-2 text-secondary small">
            <i className="bi bi-shield-check text-primary"></i>
            <span>Plataforma Oficial Rolling Gamer</span>
          </div>
        </Container>
      </div>

      {/* Barra de navegación principal */}
      <Navbar expand="lg" className="epic-navbar py-2" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <div
              className="bg-primary text-white rounded d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "36px", height: "36px", fontSize: "1.2rem" }}
            >
              <i className="bi bi-controller"></i>
            </div>
            <span className="epic-heading h5 mb-0 text-light tracking-wide">
              ROLLING<span className="text-primary">GAMER</span>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="menu-navegacion" className="border-secondary" />

          <Navbar.Collapse id="menu-navegacion">
            <Nav className="me-auto ms-lg-4 gap-1">
              <Nav.Link as={NavLink} to="/" end className="text-secondary">
                <i className="bi bi-grid me-1"></i> Catálogo
              </Nav.Link>
              <Nav.Link as={NavLink} to="/wishlist" className="text-secondary">
                <i className="bi bi-heart me-1"></i> Deseos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about" className="text-secondary">
                <i className="bi bi-people me-1"></i> Equipo
              </Nav.Link>
              {esAdmin && (
                <Nav.Link as={NavLink} to="/admin" className="text-warning fw-semibold">
                  <i className="bi bi-speedometer2 me-1"></i> Panel Admin
                </Nav.Link>
              )}
            </Nav>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {usuario ? (
                <div className="d-flex align-items-center gap-2">
                  <div className="text-end d-none d-sm-block">
                    <div className="text-light small fw-bold">{usuario.nombre}</div>
                    <span className={`badge ${esAdmin ? "bg-danger" : "bg-primary"} text-uppercase`} style={{ fontSize: "0.65rem" }}>
                      {usuario.rol}
                    </span>
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleCerrarSesion}
                    className="d-flex align-items-center gap-1"
                    title="Cerrar sesión"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span className="d-none d-sm-inline">Salir</span>
                  </Button>
                </div>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  size="sm"
                  className="epic-btn-primary px-3 fw-semibold"
                >
                  <i className="bi bi-person me-1"></i> Iniciar Sesión
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Menu;

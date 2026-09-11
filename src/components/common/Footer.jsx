import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="epic-footer mt-auto py-5 bg-black border-top border-secondary border-opacity-25 text-secondary">
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="bg-primary text-white rounded d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "32px", height: "32px" }}
              >
                <i className="bi bi-controller"></i>
              </div>
              <span className="epic-heading h5 mb-0 text-light">ROLLING GAMER</span>
            </div>
            <p className="small text-secondary mb-3">
              Plataforma e-commerce y catálogo interactivo de videojuegos. Desarrollado para el Módulo 2 de RollingCode School.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <a href="https://github.com/Franc-Devel/Rolling-Gamer" target="_blank" rel="noreferrer" className="text-secondary hover-light fs-5">
                <i className="bi bi-github"></i>
              </a>
              <span className="text-secondary fs-5"><i className="bi bi-discord"></i></span>
              <span className="text-secondary fs-5"><i className="bi bi-twitter-x"></i></span>
              <span className="text-secondary fs-5"><i className="bi bi-youtube"></i></span>
            </div>
          </Col>

          <Col sm={6} md={2} className="offset-md-2">
            <h6 className="text-light fw-bold text-uppercase small mb-3">Navegación</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-secondary text-decoration-none">Catálogo Principal</Link></li>
              <li><Link to="/wishlist" className="text-secondary text-decoration-none">Lista de Deseos</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none">Sobre el Proyecto</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none">Acceso a Cuenta</Link></li>
            </ul>
          </Col>

          <Col sm={6} md={4}>
            <h6 className="text-light fw-bold text-uppercase small mb-3">Equipo de Desarrollo</h6>
            <div className="small mb-2">
              <span className="text-light fw-semibold">Francisco Delgado:</span> <span className="text-secondary">Team Leader & Full Stack Dev</span>
            </div>
            <div className="small mb-3">
              <span className="text-light fw-semibold">Franco Triviño:</span> <span className="text-secondary">Scrum Master & Frontend Dev</span>
            </div>
            <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25">
              Cohorte 9P • RollingCode School
            </span>
          </Col>
        </Row>

        <hr className="my-4 border-secondary border-opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-muted">
          <span>&copy; {new Date().getFullYear()} ROLLING GAMER. Todos los derechos reservados.</span>
          <span className="mt-2 mt-sm-0">Inspirado en el ecosistema gaming moderno.</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <Badge bg="primary" className="text-uppercase px-3 py-1 mb-2">RollingCode School • Cohorte 9P</Badge>
        <h1 className="epic-heading display-5 text-white fw-bold mb-3">Equipo de Desarrollo</h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: "700px" }}>
          ROLLING GAMER fue concebido, diseñado y construido siguiendo metodologías ágiles Scrum, React 19 y arquitectura moderna basada en componentes.
        </p>
      </div>

      <Row className="gy-4 mb-5 justify-content-center">
        {/* Francisco Delgado */}
        <Col md={6} lg={5}>
          <Card className="h-100 bg-dark text-light border-secondary border-opacity-25 p-4 shadow-lg">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3"
                style={{ width: "64px", height: "64px" }}
              >
                FD
              </div>
              <div>
                <h3 className="h5 fw-bold text-white mb-0">Francisco Delgado</h3>
                <span className="badge bg-warning text-dark text-uppercase">Team Leader & Full Stack Dev</span>
              </div>
            </div>
            <p className="text-secondary small mb-4">
              Liderazgo técnico del proyecto, arquitectura de persistencia con `localStorage`, ruteo dinámico con React Router, seguridad y panel de administración CRUD con SweetAlert2.
            </p>
            <div className="mt-auto border-top border-secondary border-opacity-25 pt-3">
              <div className="small text-muted mb-2">Responsabilidades principales:</div>
              <ul className="small text-secondary ps-3 mb-0">
                <li>Arquitectura central y estado de inventario</li>
                <li>Integración de rutas protegidas y contextos</li>
                <li>Persistencia consistente y recuperación ante fallos</li>
              </ul>
            </div>
          </Card>
        </Col>

        {/* Franco Triviño */}
        <Col md={6} lg={5}>
          <Card className="h-100 bg-dark text-light border-secondary border-opacity-25 p-4 shadow-lg">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3"
                style={{ width: "64px", height: "64px" }}
              >
                FT
              </div>
              <div>
                <h3 className="h5 fw-bold text-white mb-0">Franco Triviño</h3>
                <span className="badge bg-info text-dark text-uppercase">Scrum Master & Frontend Dev</span>
              </div>
            </div>
            <p className="text-secondary small mb-4">
              Organización y seguimiento de sprints en Trello, implementación de estilos globales basados en el ecosistema Epic Games, diseño de componentes y experiencia de usuario.
            </p>
            <div className="mt-auto border-top border-secondary border-opacity-25 pt-3">
              <div className="small text-muted mb-2">Responsabilidades principales:</div>
              <ul className="small text-secondary ps-3 mb-0">
                <li>Gestión ágil del backlog y asignación de cards</li>
                <li>Tokens de diseño temático oscuro y microinteracciones</li>
                <li>Validaciones de formularios y feedback visual</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Metodología */}
      <Card className="bg-dark text-light border-secondary border-opacity-25 p-4 mb-4">
        <h4 className="epic-heading text-white h5 mb-3">Metodología Ágil y Organización</h4>
        <p className="text-secondary small mb-3">
          El desarrollo se organizó en tarjetas funcionales con estimación de puntos de esfuerzo. Cada entrega cuenta con validación de criterios de aceptación, pruebas manuales y trazabilidad mediante commits descriptivos en español.
        </p>
        <div className="d-flex flex-wrap gap-2">
          <Badge bg="secondary">Scrum</Badge>
          <Badge bg="secondary">Trello Board</Badge>
          <Badge bg="secondary">GitFlow</Badge>
          <Badge bg="secondary">React Router v7</Badge>
          <Badge bg="secondary">Bootstrap 5</Badge>
        </div>
      </Card>

      <div className="text-center mt-4">
        <Button as={Link} to="/" variant="primary" className="epic-btn-primary">
          <i className="bi bi-controller me-2"></i> Explorar el Catálogo
        </Button>
      </div>
    </Container>
  );
};

export default About;

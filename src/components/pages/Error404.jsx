import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <Container className="py-5 text-center min-vh-50 d-flex flex-column align-items-center justify-content-center">
      <div
        className="display-1 fw-extrabold text-primary epic-heading mb-2"
        style={{ fontSize: "6rem", letterSpacing: "2px" }}
      >
        404
      </div>
      <h1 className="epic-heading h3 text-white mb-2">¡Nivel no encontrado!</h1>
      <p className="lead text-secondary mb-4" style={{ maxWidth: "500px" }}>
        La página o coordenada que buscas ha sido destruida, movida a otra dimensión o nunca existió en este servidor.
      </p>
      <div className="d-flex gap-2">
        <Button as={Link} to="/" variant="primary" size="lg" className="epic-btn-primary fw-bold">
          <i className="bi bi-controller me-2"></i> Volver a la Tienda
        </Button>
      </div>
    </Container>
  );
};

export default Error404;

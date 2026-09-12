import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import { useProductos } from "../../context/ProductosContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUIModal } from "../../context/UIModalContext.jsx";

const Wishlist = () => {
  const { productos } = useProductos();
  const { usuarioActual, getWishlistJuegos, toggleWishlist } = useAuth();
  const { mostrarAlerta } = useUIModal();

  // Obtener juegos de la lista de deseos de la cuenta activa
  const juegosDeseados = usuarioActual ? getWishlistJuegos(productos) : [];

  const handleQuitarDeseo = (juegoId, nombre) => {
    const res = toggleWishlist(juegoId);
    if (res.success || res.exito) {
      mostrarAlerta(`"${nombre}" fue removido de tu lista de deseos.`, "info");
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="epic-heading h2 text-white mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-heart-fill text-danger"></i> Mi Lista de Deseos
            {usuarioActual && (
              <Badge bg="secondary" className="fs-6 ms-2">
                {juegosDeseados.length}
              </Badge>
            )}
          </h1>
          <p className="text-secondary small mb-0">
            {usuarioActual
              ? `Juegos guardados de forma persistente para la cuenta de ${usuarioActual.nombre} (${usuarioActual.email})`
              : "Inicia sesión para sincronizar tus videojuegos favoritos en tu cuenta personal."}
          </p>
        </div>
        <Button as={Link} to="/" variant="outline-secondary" size="sm">
          <i className="bi bi-compass me-1"></i> Explorar Más Juegos
        </Button>
      </div>

      {!usuarioActual ? (
        <div className="text-center py-5 border border-secondary border-opacity-25 rounded bg-dark p-4 shadow-sm">
          <div
            className="bg-secondary bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-warning"
            style={{ width: "64px", height: "64px", fontSize: "2rem" }}
          >
            <i className="bi bi-lock-fill"></i>
          </div>
          <h2 className="text-light h4 fw-bold mb-2">Inicia sesión para ver tu lista de deseos</h2>
          <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: "460px" }}>
            Los videojuegos que marques como favoritos se almacenan de manera persistente vinculados exclusivamente a tu cuenta registrada.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button as={Link} to="/login" variant="primary" className="epic-btn-primary px-4 fw-semibold">
              <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión / Registrarse
            </Button>
            <Button as={Link} to="/" variant="outline-secondary">
              Volver a la Tienda
            </Button>
          </div>
        </div>
      ) : juegosDeseados.length === 0 ? (
        <div className="text-center py-5 border border-secondary border-opacity-25 rounded bg-dark p-4 shadow-sm">
          <div
            className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-muted"
            style={{ width: "64px", height: "64px", fontSize: "2rem" }}
          >
            <i className="bi bi-heartbreak"></i>
          </div>
          <h2 className="text-light h4 fw-bold mb-2">Tu lista de deseos está vacía</h2>
          <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: "460px" }}>
            Aún no has agregado juegos a tu lista personal. Explora nuestro catálogo y presiona el botón del corazón para guardarlos.
          </p>
          <Button as={Link} to="/" variant="primary" className="epic-btn-primary px-4">
            <i className="bi bi-cart me-1"></i> Explorar Catálogo
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {juegosDeseados.map((juego) => (
            <Col key={juego.id}>
              <Card className="h-100 bg-dark text-light border-secondary border-opacity-25 shadow-sm position-relative overflow-hidden">
                <Card.Img
                  variant="top"
                  src={juego.imagen}
                  alt={juego.nombre}
                  style={{ height: "190px", objectFit: "cover" }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center shadow"
                  style={{ width: "32px", height: "32px", padding: 0 }}
                  onClick={() => handleQuitarDeseo(juego.id, juego.nombre)}
                  title="Quitar de mi lista de deseos"
                >
                  <i className="bi bi-x-lg"></i>
                </Button>
                <Card.Body className="d-flex flex-column p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="h6 fw-bold text-truncate mb-0">{juego.nombre}</Card.Title>
                    <Badge bg="primary" style={{ fontSize: "0.65rem" }}>{juego.categoria}</Badge>
                  </div>
                  <Card.Text className="text-muted small text-truncate-2 mb-3">
                    {juego.descripcion_breve}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-secondary border-opacity-25">
                    <span className="fw-bold text-light">${juego.precio.toLocaleString()} ARS</span>
                    <Button as={Link} to={`/detalle/${juego.id}`} variant="primary" size="sm" className="epic-btn-primary">
                      Ver Ficha
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useProductos } from "../../context/ProductosContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const Wishlist = () => {
  const { productos } = useProductos();
  const { usuario } = useAuth();

  // Mock de lista de deseos: mostramos un par de juegos recomendados para el usuario
  const juegosDeseados = productos.slice(0, 3);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="epic-heading h2 text-white mb-1">
            <i className="bi bi-heart-fill text-danger me-2"></i> Mi Lista de Deseos
          </h1>
          <p className="text-secondary small mb-0">
            {usuario ? `Juegos guardados para la cuenta de ${usuario.nombre}` : "Inicia sesión para sincronizar tus videojuegos favoritos"}
          </p>
        </div>
        <Button as={Link} to="/" variant="outline-secondary" size="sm">
          Explorar Más Juegos
        </Button>
      </div>

      {juegosDeseados.length === 0 ? (
        <div className="text-center py-5 border border-secondary border-opacity-25 rounded bg-dark p-4">
          <i className="bi bi-heartbreak fs-1 text-muted"></i>
          <p className="text-light mt-3 mb-2 fw-bold">Tu lista de deseos está vacía</p>
          <p className="text-muted small mb-4">Navega por nuestro catálogo y guarda los títulos que más te interesen.</p>
          <Button as={Link} to="/" variant="primary" className="epic-btn-primary">
            Ir a la Tienda
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {juegosDeseados.map((juego) => (
            <Col key={juego.id}>
              <Card className="h-100 bg-dark text-light border-secondary border-opacity-25 shadow-sm">
                <Card.Img
                  variant="top"
                  src={juego.imagen}
                  alt={juego.nombre}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column p-3">
                  <Card.Title className="h6 fw-bold text-truncate">{juego.nombre}</Card.Title>
                  <Card.Text className="text-muted small text-truncate-2 mb-3">
                    {juego.descripcion_breve}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
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

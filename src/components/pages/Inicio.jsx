import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { useProductos } from "../../context/ProductosContext.jsx";

const Inicio = () => {
  const { productos, cargando } = useProductos();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  const categorias = ["Todas", "RPG", "Acción", "Terror", "Deportes", "Estrategia", "Simulación", "Indie", "Aventura"];

  const productosFiltrados = productos.filter((juego) => {
    const coincideCategoria =
      categoriaSeleccionada === "Todas" || juego.categoria === categoriaSeleccionada;
    const coincideBusqueda =
      !busqueda || juego.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (juego.desarrollador && juego.desarrollador.toLowerCase().includes(busqueda.toLowerCase()));
    return coincideCategoria && coincideBusqueda;
  });

  const juegoDestacado = productos.find((j) => j.destacado) || productos[0];

  if (cargando) {
    return (
      <Container className="py-5 text-center min-vh-50 d-flex flex-column align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" />
        <p className="text-secondary mt-3">Cargando catálogo de videojuegos...</p>
      </Container>
    );
  }

  return (
    <div className="catalogo-inicio pb-5">
      {/* Hero Showcase Temático */}
      {juegoDestacado && (
        <section className="epic-hero position-relative overflow-hidden mb-5">
          <div
            className="hero-background position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(18, 18, 18, 0.95) 20%, rgba(18, 18, 18, 0.4) 60%, rgba(18, 18, 18, 0.9) 100%), url(${juegoDestacado.imagen})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.85)"
            }}
          ></div>

          <Container className="position-relative py-5 z-1" style={{ minHeight: "420px" }}>
            <Row className="align-items-center h-100 pt-4">
              <Col lg={7}>
                <Badge bg="primary" className="text-uppercase mb-2 px-2 py-1 fw-bold">
                  Destacado de la Semana
                </Badge>
                <h1 className="display-4 fw-extrabold text-white epic-heading mb-2">
                  {juegoDestacado.nombre}
                </h1>
                <p className="lead text-light text-opacity-75 mb-3" style={{ maxWidth: "600px" }}>
                  {juegoDestacado.descripcion_breve}
                </p>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="fs-3 fw-bold text-light">
                    ${juegoDestacado.precio.toLocaleString()} ARS
                  </span>
                  {juegoDestacado.descuento > 0 && (
                    <Badge bg="success" className="fs-6 px-2 py-1">
                      -{juegoDestacado.descuento}% OFF
                    </Badge>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to={`/detalle/${juegoDestacado.id}`}
                    variant="primary"
                    size="lg"
                    className="epic-btn-primary px-4 fw-bold"
                  >
                    <i className="bi bi-eye me-2"></i> Ver Detalles
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <Container className="mb-4">
        <Row className="gy-3 align-items-center justify-content-between">
          <Col md={5}>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Buscar por título o desarrollador..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button
                  className="btn btn-outline-secondary border-secondary"
                  onClick={() => setBusqueda("")}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </Col>

          <Col md={7}>
            <div className="d-flex gap-1 overflow-x-auto pb-2 justify-content-md-end">
              {categorias.map((cat) => (
                <Button
                  key={cat}
                  variant={categoriaSeleccionada === cat ? "primary" : "outline-secondary"}
                  size="sm"
                  className="text-nowrap"
                  onClick={() => setCategoriaSeleccionada(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Grilla del Catálogo */}
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="epic-heading h4 text-light mb-0">
            Catálogo Disponible
            <span className="badge bg-secondary ms-2 fs-6">{productosFiltrados.length}</span>
          </h2>
        </div>

        {productosFiltrados.length === 0 ? (
          <div className="text-center py-5 border border-secondary border-opacity-25 rounded bg-dark p-4">
            <i className="bi bi-controller fs-1 text-secondary"></i>
            <p className="text-light mt-3 mb-1 fw-bold">No se encontraron títulos con los filtros actuales</p>
            <p className="text-muted small">Intenta buscar con otro término o selecciona otra categoría.</p>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {productosFiltrados.map((juego) => (
              <Col key={juego.id}>
                <Card className="h-100 bg-dark text-light border-secondary border-opacity-25 shadow-sm epic-game-card">
                  <div className="position-relative overflow-hidden" style={{ height: "190px" }}>
                    <Card.Img
                      variant="top"
                      src={juego.imagen}
                      alt={juego.nombre}
                      className="w-100 h-100 object-fit-cover"
                    />
                    {juego.descuento > 0 && (
                      <Badge
                        bg="success"
                        className="position-absolute top-0 end-0 m-2 fw-bold"
                      >
                        -{juego.descuento}%
                      </Badge>
                    )}
                    <Badge
                      bg="dark"
                      className="position-absolute bottom-0 start-0 m-2 border border-secondary"
                    >
                      {juego.categoria}
                    </Badge>
                  </div>

                  <Card.Body className="d-flex flex-column p-3">
                    <div className="text-muted small mb-1">{juego.desarrollador}</div>
                    <Card.Title className="h6 fw-bold text-truncate mb-2" title={juego.nombre}>
                      {juego.nombre}
                    </Card.Title>
                    <Card.Text className="text-secondary small text-truncate-2 mb-3 flex-grow-1">
                      {juego.descripcion_breve}
                    </Card.Text>

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-secondary border-opacity-25">
                      <div>
                        <span className="fw-bold text-light">
                          ${juego.precio.toLocaleString()} ARS
                        </span>
                      </div>
                      <Button
                        as={Link}
                        to={`/detalle/${juego.id}`}
                        variant="primary"
                        size="sm"
                        className="epic-btn-primary"
                      >
                        Ver Detalle
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Inicio;

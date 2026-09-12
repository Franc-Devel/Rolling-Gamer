import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useProductos } from "../../context/ProductosContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUIModal } from "../../context/UIModalContext.jsx";

const DetalleDeProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { buscarProducto, agregarResena } = useProductos();
  const { usuario, isWishlisted, toggleWishlist } = useAuth();
  const { abrirModal, mostrarAlerta } = useUIModal();

  const juego = buscarProducto(id);
  const estaEnWishlist = juego ? isWishlisted(juego.id) : false;

  const [autor, setAutor] = useState(usuario ? usuario.nombre : "");
  const [comentario, setComentario] = useState("");
  const [esPositiva, setEsPositiva] = useState(true);
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");

  if (!juego) {
    return (
      <Container className="py-5 text-center min-vh-50">
        <h2 className="epic-heading text-light mb-3">Videojuego no encontrado</h2>
        <p className="text-secondary mb-4">El título que buscas no existe o fue eliminado del catálogo.</p>
        <Button as={Link} to="/" variant="primary" className="epic-btn-primary">
          <i className="bi bi-arrow-left me-2"></i> Volver al Catálogo
        </Button>
      </Container>
    );
  }

  const handleEnviarResena = (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      setErrorValidacion("Por favor escribe una opinión antes de enviar.");
      return;
    }

    try {
      agregarResena(juego.id, {
        usuario: autor.trim() || (usuario ? usuario.nombre : "Gamer Anónimo"),
        comentario: comentario.trim(),
        esPositiva
      });

      setMensajeExito("¡Tu reseña fue publicada con éxito y guardada en el catálogo!");
      setComentario("");
      setErrorValidacion("");
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (err) {
      console.error("Error al agregar reseña:", err);
      setErrorValidacion("No se pudo agregar la reseña. Inténtalo nuevamente.");
    }
  };

  const resenas = Array.isArray(juego.resenas) ? juego.resenas : [];
  const positivas = resenas.filter((r) => r.esPositiva).length;
  const porcentaje = resenas.length > 0 ? Math.round((positivas / resenas.length) * 100) : 100;

  return (
    <Container className="py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Inicio</Link></li>
          <li className="breadcrumb-item text-secondary">{juego.categoria}</li>
          <li className="breadcrumb-item active text-light" aria-current="page">{juego.nombre}</li>
        </ol>
      </nav>

      {/* Cabecera del Juego */}
      <Row className="gy-4 mb-5">
        <Col lg={8}>
          <div className="position-relative rounded overflow-hidden shadow-lg border border-secondary border-opacity-25" style={{ maxHeight: "480px" }}>
            <img
              src={juego.imagen}
              alt={juego.nombre}
              className="w-100 h-100 object-fit-cover"
              style={{ minHeight: "360px" }}
            />
            {juego.descuento > 0 && (
              <Badge bg="success" className="position-absolute top-0 end-0 m-3 fs-5 px-3 py-2">
                -{juego.descuento}% OFF
              </Badge>
            )}
          </div>
        </Col>

        <Col lg={4} className="d-flex flex-column justify-content-between">
          <div className="bg-dark p-4 rounded border border-secondary border-opacity-25 h-100 d-flex flex-column">
            <Badge bg="primary" className="align-self-start mb-2 text-uppercase">
              {juego.categoria}
            </Badge>
            <h1 className="epic-heading h2 text-white mb-2">{juego.nombre}</h1>
            <p className="text-muted small mb-3">
              Desarrollador: <span className="text-light fw-semibold">{juego.desarrollador}</span>
            </p>

            <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded bg-black bg-opacity-50">
              <i className={`bi ${porcentaje >= 70 ? "bi-hand-thumbs-up-fill text-success" : "bi-hand-thumbs-down-fill text-warning"} fs-4`}></i>
              <div>
                <div className="small fw-bold text-light">
                  {porcentaje >= 70 ? "Mayormente Positivas" : "Mixtas"} ({porcentaje}%)
                </div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Basado en {resenas.length} opiniones de la comunidad
                </div>
              </div>
            </div>

            <p className="text-secondary small mb-4 flex-grow-1">
              {juego.descripcion_amplia || juego.descripcion_breve}
            </p>

            <div className="pt-3 border-top border-secondary border-opacity-25">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-secondary">Precio oficial:</span>
                <span className="fs-3 fw-extrabold text-light">${juego.precio.toLocaleString()} ARS</span>
              </div>
              <Button variant="primary" size="lg" className="w-100 epic-btn-primary fw-bold mb-2">
                <i className="bi bi-cart-plus me-2"></i> Añadir al Carrito
              </Button>
              <Button
                variant={estaEnWishlist ? "outline-danger" : "outline-secondary"}
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  const res = toggleWishlist(juego.id);
                  if (res.requireAuth) {
                    abrirModal({
                      titulo: "Identificación Requerida",
                      mensaje: "Debes iniciar sesión con tu cuenta para guardar títulos en tu lista de deseos personal.",
                      tipo: "confirmacion",
                      textoConfirmar: "Ir a Iniciar Sesión",
                      textoCancelar: "Más tarde",
                      onConfirmar: () => navigate("/login")
                    });
                    return;
                  }
                  if (res.success || res.exito) {
                    mostrarAlerta(res.mensaje, res.isWishlisted ? "exito" : "info");
                  }
                }}
              >
                <i className={`bi ${estaEnWishlist ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                <span>{estaEnWishlist ? "En tu Lista de Deseos (Quitar)" : "Guardar en Deseos"}</span>
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Requisitos del Sistema */}
      {juego.requisitos && (
        <Row className="mb-5">
          <Col xs={12}>
            <h3 className="epic-heading h4 text-light mb-3">Requisitos del Sistema (PC)</h3>
            <Row className="g-3">
              <Col md={6}>
                <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                  <Card.Title className="h6 text-primary fw-bold">Mínimos</Card.Title>
                  <ul className="list-unstyled small text-secondary mb-0 d-flex flex-column gap-1">
                    <li><strong>SO:</strong> {juego.requisitos.minimos?.so || "Windows 10 64-bit"}</li>
                    <li><strong>Procesador:</strong> {juego.requisitos.minimos?.procesador || "Intel Core i5"}</li>
                    <li><strong>Memoria:</strong> {juego.requisitos.minimos?.memoria || "8 GB RAM"}</li>
                    <li><strong>Gráficos:</strong> {juego.requisitos.minimos?.graficos || "GTX 1060"}</li>
                    <li><strong>Almacenamiento:</strong> {juego.requisitos.minimos?.almacenamiento || "50 GB"}</li>
                  </ul>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                  <Card.Title className="h6 text-success fw-bold">Recomendados</Card.Title>
                  <ul className="list-unstyled small text-secondary mb-0 d-flex flex-column gap-1">
                    <li><strong>SO:</strong> {juego.requisitos.recomendados?.so || "Windows 11 64-bit"}</li>
                    <li><strong>Procesador:</strong> {juego.requisitos.recomendados?.procesador || "Intel Core i7"}</li>
                    <li><strong>Memoria:</strong> {juego.requisitos.recomendados?.memoria || "16 GB RAM"}</li>
                    <li><strong>Gráficos:</strong> {juego.requisitos.recomendados?.graficos || "RTX 3070"}</li>
                    <li><strong>Almacenamiento:</strong> {juego.requisitos.recomendados?.almacenamiento || "50 GB SSD"}</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}

      {/* Sistema de Reseñas */}
      <Row className="gy-4">
        <Col lg={7}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="epic-heading h4 text-light mb-0">
              Reseñas de Jugadores <Badge bg="secondary">{resenas.length}</Badge>
            </h3>
          </div>

          <div className="d-flex flex-column gap-3">
            {resenas.length === 0 ? (
              <p className="text-secondary">Sé el primero en dejar una opinión sobre este videojuego.</p>
            ) : (
              resenas.map((res) => (
                <Card key={res.id} className="bg-dark text-light border-secondary border-opacity-25 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-secondary">{res.usuario}</span>
                      <span className={`small ${res.esPositiva ? "text-success" : "text-danger"}`}>
                        <i className={`bi ${res.esPositiva ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-down-fill"} me-1`}></i>
                        {res.esPositiva ? "Recomendado" : "No recomendado"}
                      </span>
                    </div>
                    <span className="text-muted small">{res.fecha}</span>
                  </div>
                  <Card.Text className="text-secondary small mb-0">{res.comentario}</Card.Text>
                </Card>
              ))
            )}
          </div>
        </Col>

        {/* Formulario de Reseña */}
        <Col lg={5}>
          <Card className="bg-dark text-light border-secondary border-opacity-25 p-4">
            <h4 className="epic-heading h5 text-light mb-3">Deja tu Opinión</h4>

            {mensajeExito && <Alert variant="success" className="py-2 small">{mensajeExito}</Alert>}
            {errorValidacion && <Alert variant="danger" className="py-2 small">{errorValidacion}</Alert>}

            <Form onSubmit={handleEnviarResena}>
              <Form.Group className="mb-3" controlId="formAutor">
                <Form.Label className="small text-secondary">Nombre de usuario</Form.Label>
                <Form.Control
                  type="text"
                  className="bg-black text-light border-secondary"
                  placeholder="Tu alias gamer"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formVeredicto">
                <Form.Label className="small text-secondary">¿Recomiendas este juego?</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="radioPositiva"
                    label="👍 Sí, lo recomiendo"
                    name="esPositiva"
                    checked={esPositiva}
                    onChange={() => setEsPositiva(true)}
                    className="text-success small fw-semibold"
                  />
                  <Form.Check
                    type="radio"
                    id="radioNegativa"
                    label="👎 No lo recomiendo"
                    name="esPositiva"
                    checked={!esPositiva}
                    onChange={() => setEsPositiva(false)}
                    className="text-danger small fw-semibold"
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formComentario">
                <Form.Label className="small text-secondary">Comentario u opinión</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="bg-black text-light border-secondary"
                  placeholder="Escribe qué te pareció la jugabilidad, historia, gráficos..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 epic-btn-primary fw-bold">
                Publicar Reseña
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleDeProducto;

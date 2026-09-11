import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useProductos } from "../../../context/ProductosContext.jsx";
import { useUIModal } from "../../../context/UIModalContext.jsx";

const FormularioProducto = () => {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const { buscarProducto, crearProducto, modificarProducto } = useProductos();
  const { mostrarAlerta } = useUIModal();

  const [formulario, setFormulario] = useState(() => {
    if (esEdicion) {
      const juegoExistente = buscarProducto(id);
      if (juegoExistente) {
        return {
          nombre: juegoExistente.nombre || "",
          precio: String(juegoExistente.precio || ""),
          descuento: String(juegoExistente.descuento || 0),
          categoria: juegoExistente.categoria || "Acción",
          desarrollador: juegoExistente.desarrollador || "",
          imagen: juegoExistente.imagen || "",
          destacado: Boolean(juegoExistente.destacado),
          descripcion_breve: juegoExistente.descripcion_breve || "",
          descripcion_amplia: juegoExistente.descripcion_amplia || ""
        };
      }
    }
    return {
      nombre: "",
      precio: "",
      descuento: "0",
      categoria: "Acción",
      desarrollador: "",
      imagen: "",
      destacado: false,
      descripcion_breve: "",
      descripcion_amplia: ""
    };
  });

  const [errorValidacion, setErrorValidacion] = useState("");

  const categorias = ["RPG", "Acción", "Terror", "Deportes", "Estrategia", "Simulación", "Indie", "Aventura"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorValidacion("");

    if (!formulario.nombre.trim()) {
      setErrorValidacion("El nombre del videojuego es obligatorio.");
      return;
    }
    if (!formulario.precio || Number(formulario.precio) <= 0) {
      setErrorValidacion("El precio debe ser un número mayor a cero.");
      return;
    }
    if (!formulario.imagen.trim()) {
      setErrorValidacion("La URL de la imagen de carátula es obligatoria.");
      return;
    }

    try {
      if (esEdicion) {
        // Regla: "editar conserva id y reseñas"
        modificarProducto({
          id,
          nombre: formulario.nombre.trim(),
          precio: Number(formulario.precio),
          descuento: Number(formulario.descuento) || 0,
          categoria: formulario.categoria,
          desarrollador: formulario.desarrollador.trim() || "Estudio Indie",
          imagen: formulario.imagen.trim(),
          destacado: Boolean(formulario.destacado),
          descripcion_breve: formulario.descripcion_breve.trim(),
          descripcion_amplia: formulario.descripcion_amplia.trim() || formulario.descripcion_breve.trim()
        });
        mostrarAlerta(`"${formulario.nombre}" fue modificado con éxito conservando su historial.`, "exito");
      } else {
        crearProducto({
          nombre: formulario.nombre.trim(),
          precio: Number(formulario.precio),
          descuento: Number(formulario.descuento) || 0,
          categoria: formulario.categoria,
          desarrollador: formulario.desarrollador.trim() || "Estudio Indie",
          imagen: formulario.imagen.trim(),
          destacado: Boolean(formulario.destacado),
          descripcion_breve: formulario.descripcion_breve.trim(),
          descripcion_amplia: formulario.descripcion_amplia.trim() || formulario.descripcion_breve.trim()
        });
        mostrarAlerta(`"${formulario.nombre}" fue añadido al catálogo exitosamente.`, "exito");
      }

      navigate("/admin");
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setErrorValidacion("Ocurrió un error al procesar la solicitud.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="bg-dark text-light border-secondary border-opacity-25 shadow-lg p-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
              <div>
                <h1 className="epic-heading h3 text-white mb-1">
                  {esEdicion ? "Editar Videojuego" : "Crear Nuevo Videojuego"}
                </h1>
                <p className="text-secondary small mb-0">
                  {esEdicion
                    ? `Modificando registro ID: ${id} (conservando identificador y reseñas)`
                    : "Completa la información técnica y comercial para publicar el juego"}
                </p>
              </div>
              <Button as={Link} to="/admin" variant="outline-secondary" size="sm">
                Cancelar
              </Button>
            </div>

            {errorValidacion && <Alert variant="danger" className="py-2 small">{errorValidacion}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={8}>
                  <Form.Group controlId="formNombre">
                    <Form.Label className="small text-secondary">Título del Videojuego *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      className="bg-black text-light border-secondary"
                      placeholder="Ej. The Last of Us Part I"
                      value={formulario.nombre}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="formCategoria">
                    <Form.Label className="small text-secondary">Categoría *</Form.Label>
                    <Form.Select
                      name="categoria"
                      className="bg-black text-light border-secondary"
                      value={formulario.categoria}
                      onChange={handleChange}
                    >
                      {categorias.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formPrecio">
                    <Form.Label className="small text-secondary">Precio en ARS *</Form.Label>
                    <Form.Control
                      type="number"
                      name="precio"
                      min="0"
                      step="100"
                      className="bg-black text-light border-secondary"
                      placeholder="Ej. 35000"
                      value={formulario.precio}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formDescuento">
                    <Form.Label className="small text-secondary">Descuento (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="descuento"
                      min="0"
                      max="90"
                      className="bg-black text-light border-secondary"
                      placeholder="0"
                      value={formulario.descuento}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="formDesarrollador">
                    <Form.Label className="small text-secondary">Estudio / Desarrollador</Form.Label>
                    <Form.Control
                      type="text"
                      name="desarrollador"
                      className="bg-black text-light border-secondary"
                      placeholder="Ej. Naughty Dog / Sony Interactive"
                      value={formulario.desarrollador}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="formImagen">
                    <Form.Label className="small text-secondary">URL de Imagen de Carátula *</Form.Label>
                    <Form.Control
                      type="url"
                      name="imagen"
                      className="bg-black text-light border-secondary"
                      placeholder="https://..."
                      value={formulario.imagen}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {formulario.imagen && (
                  <Col md={12}>
                    <div className="p-2 bg-black rounded border border-secondary text-center">
                      <span className="small text-muted d-block mb-1">Vista previa de imagen:</span>
                      <img
                        src={formulario.imagen}
                        alt="Previsualización"
                        className="rounded"
                        style={{ maxHeight: "140px", objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  </Col>
                )}

                <Col md={12}>
                  <Form.Group controlId="formDescripcionBreve">
                    <Form.Label className="small text-secondary">Descripción Breve</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="descripcion_breve"
                      className="bg-black text-light border-secondary"
                      placeholder="Resumen atractivo para la card de tienda..."
                      value={formulario.descripcion_breve}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="formDescripcionAmplia">
                    <Form.Label className="small text-secondary">Descripción Amplia (Detalle)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="descripcion_amplia"
                      className="bg-black text-light border-secondary"
                      placeholder="Detalles sobre jugabilidad, historia, modos de juego..."
                      value={formulario.descripcion_amplia}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Check
                    type="switch"
                    id="switchDestacado"
                    name="destacado"
                    label="Mostrar como título destacado en el Hero principal"
                    checked={formulario.destacado}
                    onChange={handleChange}
                    className="text-warning small fw-bold"
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-secondary border-opacity-25">
                <Button as={Link} to="/admin" variant="outline-secondary">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="epic-btn-primary fw-bold px-4">
                  {esEdicion ? "Guardar Cambios" : "Crear Videojuego"}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormularioProducto;

import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import { useProductos } from "../../context/ProductosContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUIModal } from "../../context/UIModalContext.jsx";

const Administrador = () => {
  const { productos, borrarProducto, recargarCatalogo } = useProductos();
  const { usuarios, usuarioActual, borrarUsuario } = useAuth();
  const { abrirModal, mostrarAlerta } = useUIModal();

  const [seccionActiva, setSeccionActiva] = useState("juegos"); // 'juegos' | 'usuarios'
  const [filtro, setFiltro] = useState("");
  const [filtroUsuarios, setFiltroUsuarios] = useState("");

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      p.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  const usuariosFiltrados = (usuarios || []).filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtroUsuarios.toLowerCase()) ||
      u.email.toLowerCase().includes(filtroUsuarios.toLowerCase()) ||
      u.rol.toLowerCase().includes(filtroUsuarios.toLowerCase())
  );

  const handleEliminarJuego = (id, nombre) => {
    abrirModal({
      titulo: "Confirmar Eliminación",
      mensaje: `¿Estás seguro de que deseas eliminar permanentemente el juego "${nombre}"? Esta acción no se puede deshacer.`,
      tipo: "confirmacion",
      textoConfirmar: "Sí, Eliminar",
      textoCancelar: "Cancelar",
      onConfirmar: () => {
        const exito = borrarProducto(id);
        if (exito) {
          mostrarAlerta(`"${nombre}" fue eliminado del catálogo con éxito.`, "exito");
        } else {
          mostrarAlerta("No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  const handleEliminarUsuario = (id, nombre) => {
    // Validar protección de cuenta activa antes de abrir el modal
    if (usuarioActual && String(id) === String(usuarioActual.id)) {
      mostrarAlerta("No es posible eliminar la cuenta que tiene la sesión activa actualmente.", "error");
      return;
    }

    abrirModal({
      titulo: "Confirmar Baja de Usuario",
      mensaje: `¿Estás seguro de que deseas dar de baja a "${nombre}"? La cuenta eliminada no podrá iniciar nueva sesión.`,
      tipo: "confirmacion",
      textoConfirmar: "Sí, Dar de Baja",
      textoCancelar: "Cancelar",
      onConfirmar: () => {
        const resultado = borrarUsuario(id);
        if (resultado.success || resultado.exito) {
          mostrarAlerta(resultado.mensaje || `Usuario "${nombre}" eliminado con éxito.`, "exito");
        } else {
          mostrarAlerta(resultado.mensaje || "No se pudo eliminar el usuario.", "error");
        }
      }
    });
  };

  const handleRestaurar = () => {
    abrirModal({
      titulo: "Restaurar Catálogo de Fábrica",
      mensaje: "¿Deseas recargar la lista de 10 videojuegos iniciales? Se restablecerán los datos predeterminados en localStorage.",
      tipo: "confirmacion",
      textoConfirmar: "Restaurar",
      textoCancelar: "Cancelar",
      onConfirmar: () => {
        recargarCatalogo();
        mostrarAlerta("Catálogo restaurado a los valores predeterminados.", "exito");
      }
    });
  };

  return (
    <Container className="py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <Badge bg="warning" text="dark" className="text-uppercase mb-2">Panel Administrativo</Badge>
          <h1 className="epic-heading h2 text-white mb-0">Gestión de Plataforma</h1>
          <p className="text-secondary small mb-0">
            Administración centralizada de catálogo, inventario y cuentas de usuarios registrados
          </p>
        </div>

        <div className="d-flex gap-2">
          {seccionActiva === "juegos" ? (
            <>
              <Button
                variant="outline-secondary"
                onClick={handleRestaurar}
                size="sm"
                className="d-flex align-items-center gap-1"
                title="Recargar catálogo de fábrica"
              >
                <i className="bi bi-arrow-counterclockwise"></i> Recargar Fábrica
              </Button>
              <Button
                as={Link}
                to="/crear"
                variant="primary"
                className="epic-btn-primary d-flex align-items-center gap-2 fw-bold"
              >
                <i className="bi bi-plus-circle"></i> Nuevo Juego
              </Button>
            </>
          ) : (
            <Button
              as={Link}
              to="/login"
              variant="outline-primary"
              size="sm"
              className="d-flex align-items-center gap-1"
            >
              <i className="bi bi-person-plus"></i> Registrar Usuario
            </Button>
          )}
        </div>
      </div>

      {/* Pestañas de Navegación del Panel */}
      <Nav variant="pills" className="mb-4 bg-black p-1 rounded border border-secondary border-opacity-25" style={{ maxWidth: "420px" }}>
        <Nav.Item className="flex-fill">
          <Nav.Link
            active={seccionActiva === "juegos"}
            onClick={() => setSeccionActiva("juegos")}
            className="text-center py-2 fw-semibold"
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-controller me-2"></i>Catálogo ({productos.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="flex-fill">
          <Nav.Link
            active={seccionActiva === "usuarios"}
            onClick={() => setSeccionActiva("usuarios")}
            className="text-center py-2 fw-semibold"
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-people me-2"></i>Usuarios ({(usuarios || []).length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {seccionActiva === "juegos" ? (
        <>
          {/* Tarjetas de Métricas de Juegos */}
          <Row className="g-3 mb-4">
            <Col sm={6} md={3}>
              <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                <div className="text-muted small text-uppercase">Total Juegos</div>
                <div className="fs-3 fw-bold text-primary">{productos.length}</div>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                <div className="text-muted small text-uppercase">Destacados</div>
                <div className="fs-3 fw-bold text-warning">
                  {productos.filter((p) => p.destacado).length}
                </div>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                <div className="text-muted small text-uppercase">Con Descuento</div>
                <div className="fs-3 fw-bold text-success">
                  {productos.filter((p) => p.descuento > 0).length}
                </div>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                <div className="text-muted small text-uppercase">Reseñas Registradas</div>
                <div className="fs-3 fw-bold text-info">
                  {productos.reduce((acc, curr) => acc + (curr.resenas?.length || 0), 0)}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Buscador de Juegos */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Filtrar por título o categoría..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          {/* Tabla de Productos */}
          <Card className="bg-dark text-light border-secondary border-opacity-25 shadow-sm overflow-hidden">
            <Table responsive hover variant="dark" className="align-middle mb-0">
              <thead>
                <tr className="border-secondary text-secondary small text-uppercase">
                  <th>Carátula</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Descuento</th>
                  <th>Reseñas</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-secondary">
                      No hay videojuegos registrados que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((juego) => (
                    <tr key={juego.id} className="border-secondary">
                      <td>
                        <img
                          src={juego.imagen}
                          alt={juego.nombre}
                          className="rounded object-fit-cover"
                          style={{ width: "50px", height: "35px" }}
                        />
                      </td>
                      <td>
                        <div className="fw-bold text-light text-truncate" style={{ maxWidth: "200px" }}>
                          {juego.nombre}
                        </div>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                          ID: {juego.id}
                        </span>
                      </td>
                      <td>
                        <Badge bg="secondary">{juego.categoria}</Badge>
                      </td>
                      <td className="fw-semibold">${juego.precio.toLocaleString()} ARS</td>
                      <td>
                        {juego.descuento > 0 ? (
                          <Badge bg="success">-{juego.descuento}%</Badge>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-secondary bg-opacity-50">
                          {juego.resenas?.length || 0}
                        </span>
                      </td>
                      <td>
                        {juego.destacado ? (
                          <Badge bg="warning" text="dark">Destacado</Badge>
                        ) : (
                          <span className="text-muted small">Normal</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button
                            as={Link}
                            to={`/detalle/${juego.id}`}
                            variant="outline-info"
                            size="sm"
                            title="Ver en tienda"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          <Button
                            as={Link}
                            to={`/editar/${juego.id}`}
                            variant="outline-warning"
                            size="sm"
                            title="Editar videojuego"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleEliminarJuego(juego.id, juego.nombre)}
                            title="Eliminar videojuego"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </>
      ) : (
        <>
          {/* Tarjetas de Métricas de Usuarios */}
          <Row className="g-3 mb-4">
            <Col sm={6} md={3}>
              <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                <div className="text-muted small text-uppercase">Usuarios Totales</div>
                <div className="fs-3 fw-bold text-primary">{(usuarios || []).length}</div>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                <div className="text-muted small text-uppercase">Administradores</div>
                <div className="fs-3 fw-bold text-danger">
                  {(usuarios || []).filter((u) => u.rol === "admin").length}
                </div>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                <div className="text-muted small text-uppercase">Usuarios Estándar</div>
                <div className="fs-3 fw-bold text-info">
                  {(usuarios || []).filter((u) => u.rol === "usuario").length}
                </div>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="bg-dark text-light border-secondary border-opacity-25 p-3">
                <div className="text-muted small text-uppercase">Sesión Activa</div>
                <div className="fs-6 fw-bold text-warning text-truncate">
                  {usuarioActual?.nombre || "Invitado"}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Buscador de Usuarios */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Filtrar por nombre, correo o rol..."
              value={filtroUsuarios}
              onChange={(e) => setFiltroUsuarios(e.target.value)}
            />
          </div>

          {/* Tabla de Usuarios */}
          <Card className="bg-dark text-light border-secondary border-opacity-25 shadow-sm overflow-hidden">
            <Table responsive hover variant="dark" className="align-middle mb-0">
              <thead>
                <tr className="border-secondary text-secondary small text-uppercase">
                  <th>Usuario</th>
                  <th>Correo Electrónico</th>
                  <th>Rol</th>
                  <th>Fecha de Registro</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-secondary">
                      No se encontraron usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((u) => {
                    const esCuentaActiva = usuarioActual && String(u.id) === String(usuarioActual.id);
                    return (
                      <tr key={u.id} className="border-secondary">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center text-primary fw-bold"
                              style={{ width: "34px", height: "34px" }}
                            >
                              <i className="bi bi-person"></i>
                            </div>
                            <div>
                              <div className="fw-bold text-light">{u.nombre}</div>
                              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                ID: {u.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-secondary">{u.email}</td>
                        <td>
                          <Badge bg={u.rol === "admin" ? "danger" : "primary"} className="text-uppercase">
                            {u.rol}
                          </Badge>
                        </td>
                        <td className="text-secondary small">{u.fechaRegistro || "—"}</td>
                        <td>
                          {esCuentaActiva ? (
                            <Badge bg="success" className="d-inline-flex align-items-center gap-1">
                              <i className="bi bi-check-circle-fill"></i> Activa (Tú)
                            </Badge>
                          ) : (
                            <span className="text-muted small">Registrado</span>
                          )}
                        </td>
                        <td className="text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            disabled={esCuentaActiva}
                            onClick={() => handleEliminarUsuario(u.id, u.nombre)}
                            title={
                              esCuentaActiva
                                ? "No es posible eliminar la cuenta que tiene la sesión activa actualmente"
                                : "Dar de baja usuario"
                            }
                          >
                            <i className="bi bi-person-x me-1"></i>
                            {esCuentaActiva ? "Bloqueado" : "Eliminar"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Administrador;

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const { login, loginRapido, usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");

  const destino = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMensaje("");

    const resultado = login(email, password);
    if (resultado.exito) {
      if (resultado.usuario.rol === "admin") {
        navigate(destino === "/" ? "/admin" : destino, { replace: true });
      } else {
        navigate(destino, { replace: true });
      }
    } else {
      setErrorMensaje(resultado.mensaje);
    }
  };

  const handleAccesoDemo = (tipo) => {
    const usuarioDemo = loginRapido(tipo);
    if (usuarioDemo) {
      if (usuarioDemo.rol === "admin") {
        navigate(destino === "/" ? "/admin" : destino, { replace: true });
      } else {
        navigate(destino, { replace: true });
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="bg-dark text-light border-secondary border-opacity-25 shadow-lg p-4">
            <div className="text-center mb-4">
              <div
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                style={{ width: "48px", height: "48px", fontSize: "1.5rem" }}
              >
                <i className="bi bi-person-circle"></i>
              </div>
              <h2 className="epic-heading h3 text-white">Iniciar Sesión</h2>
              <p className="text-secondary small">
                Accede para gestionar tu catálogo, reseñas y lista de deseos
              </p>
            </div>

            {errorMensaje && <Alert variant="danger" className="py-2 small">{errorMensaje}</Alert>}

            {usuario && (
              <Alert variant="info" className="py-2 small">
                Sesión iniciada como <strong>{usuario.nombre}</strong> ({usuario.rol}).
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="mb-4">
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="small text-secondary">Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  className="bg-black text-light border-secondary"
                  placeholder="ejemplo@rollinggames.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <Form.Label className="small text-secondary">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  className="bg-black text-light border-secondary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 epic-btn-primary fw-bold py-2 mb-3">
                Entrar a la Plataforma
              </Button>
            </Form>

            {/* Accesos rápidos de evaluación docente */}
            <div className="p-3 bg-black bg-opacity-50 rounded border border-secondary border-opacity-25">
              <div className="small fw-bold text-uppercase text-muted mb-2">
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
                Acceso Rápido Demo (Evaluación)
              </div>
              <div className="d-grid gap-2">
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => handleAccesoDemo("admin")}
                  className="text-start d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>Francisco Delgado</strong> (Admin)
                  </span>
                  <span className="badge bg-warning text-dark">Rol: admin</span>
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => handleAccesoDemo("usuario")}
                  className="text-start d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>Franco Triviño</strong> (Usuario)
                  </span>
                  <span className="badge bg-info text-dark">Rol: usuario</span>
                </Button>
              </div>
            </div>

            <div className="text-center mt-3 small">
              <Link to="/" className="text-secondary text-decoration-none">
                <i className="bi bi-arrow-left me-1"></i> Volver a la Tienda
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

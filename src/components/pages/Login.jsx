import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Nav from "react-bootstrap/Nav";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const { login, register, loginRapido, usuarioActual } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [pestana, setPestana] = useState("login"); // 'login' | 'registro'

  // Campos de formulario Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Campos de formulario Registro
  const [nombreRegistro, setNombreRegistro] = useState("");
  const [emailRegistro, setEmailRegistro] = useState("");
  const [passwordRegistro, setPasswordRegistro] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errorMensaje, setErrorMensaje] = useState("");
  const [exitoMensaje, setExitoMensaje] = useState("");

  const destino = location.state?.from?.pathname || "/";

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMensaje("");
    setExitoMensaje("");

    const resultado = login(email, password);
    if (resultado.success || resultado.exito) {
      if (resultado.usuario.rol === "admin") {
        navigate(destino === "/" ? "/admin" : destino, { replace: true });
      } else {
        navigate(destino, { replace: true });
      }
    } else {
      setErrorMensaje(resultado.mensaje);
    }
  };

  const handleRegistroSubmit = (e) => {
    e.preventDefault();
    setErrorMensaje("");
    setExitoMensaje("");

    if (passwordRegistro !== passwordConfirm) {
      setErrorMensaje("Las contraseñas ingresadas no coinciden.");
      return;
    }

    if (passwordRegistro.length < 6) {
      setErrorMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const resultado = register({
      nombre: nombreRegistro.trim(),
      email: emailRegistro.trim(),
      password: passwordRegistro
    });

    if (resultado.success || resultado.exito) {
      setExitoMensaje("¡Cuenta creada con éxito! Redirigiendo...");
      setTimeout(() => {
        navigate(destino, { replace: true });
      }, 1000);
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
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{ width: "52px", height: "52px", fontSize: "1.6rem" }}
              >
                <i className={pestana === "login" ? "bi bi-box-arrow-in-right" : "bi bi-person-plus-fill"}></i>
              </div>
              <h2 className="epic-heading h3 text-white">
                {pestana === "login" ? "Iniciar Sesión" : "Crear Cuenta Gamer"}
              </h2>
              <p className="text-secondary small">
                {pestana === "login"
                  ? "Accede para gestionar tu catálogo, reseñas y lista de deseos personal"
                  : "Regístrate para comenzar a guardar tus videojuegos favoritos en tu wishlist"}
              </p>
            </div>

            {/* Pestañas de alternancia Login / Registro */}
            <Nav variant="pills" className="nav-fill mb-4 p-1 bg-black rounded border border-secondary border-opacity-25">
              <Nav.Item>
                <Nav.Link
                  active={pestana === "login"}
                  onClick={() => {
                    setPestana("login");
                    setErrorMensaje("");
                    setExitoMensaje("");
                  }}
                  className="py-2 fw-semibold"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={pestana === "registro"}
                  onClick={() => {
                    setPestana("registro");
                    setErrorMensaje("");
                    setExitoMensaje("");
                  }}
                  className="py-2 fw-semibold"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-person-plus me-1"></i> Registrarse
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {errorMensaje && <Alert variant="danger" className="py-2 small">{errorMensaje}</Alert>}
            {exitoMensaje && <Alert variant="success" className="py-2 small">{exitoMensaje}</Alert>}

            {usuarioActual && (
              <Alert variant="info" className="py-2 small">
                Sesión activa como <strong>{usuarioActual.nombre}</strong> ({usuarioActual.rol}).
              </Alert>
            )}

            {pestana === "login" ? (
              <Form onSubmit={handleLoginSubmit} className="mb-4">
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
            ) : (
              <Form onSubmit={handleRegistroSubmit} className="mb-4">
                <Form.Group className="mb-3" controlId="formRegistroNombre">
                  <Form.Label className="small text-secondary">Nombre completo o alias</Form.Label>
                  <Form.Control
                    type="text"
                    className="bg-black text-light border-secondary"
                    placeholder="Ej. Lucas ProGamer"
                    value={nombreRegistro}
                    onChange={(e) => setNombreRegistro(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRegistroEmail">
                  <Form.Label className="small text-secondary">Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    className="bg-black text-light border-secondary"
                    placeholder="lucas@correo.com"
                    value={emailRegistro}
                    onChange={(e) => setEmailRegistro(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
                    No se admiten correos duplicados sin distinguir mayúsculas.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRegistroPassword">
                  <Form.Label className="small text-secondary">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    className="bg-black text-light border-secondary"
                    placeholder="Mínimo 6 caracteres"
                    value={passwordRegistro}
                    onChange={(e) => setPasswordRegistro(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formRegistroConfirm">
                  <Form.Label className="small text-secondary">Repetir Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    className="bg-black text-light border-secondary"
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100 fw-bold py-2 mb-3">
                  <i className="bi bi-check-circle me-1"></i> Registrar Cuenta e Ingresar
                </Button>
              </Form>
            )}

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

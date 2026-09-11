import { createContext, useContext, useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const UIModalContext = createContext();

export const UIModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    abierto: false,
    titulo: "",
    mensaje: "",
    tipo: "info", // "info", "confirmacion", "error", "exito"
    onConfirmar: null,
    textoConfirmar: "Aceptar",
    textoCancelar: "Cancelar"
  });

  const [toastAlerta, setToastAlerta] = useState({
    visible: false,
    mensaje: "",
    tipo: "info"
  });

  const abrirModal = useCallback((configuracion) => {
    setModalState({
      abierto: true,
      titulo: configuracion.titulo || "Atención",
      mensaje: configuracion.mensaje || "",
      tipo: configuracion.tipo || "info",
      onConfirmar: configuracion.onConfirmar || null,
      textoConfirmar: configuracion.textoConfirmar || "Aceptar",
      textoCancelar: configuracion.textoCancelar || "Cancelar"
    });
  }, []);

  const cerrarModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      abierto: false,
      onConfirmar: null
    }));
  }, []);

  const confirmarAccion = useCallback(() => {
    if (typeof modalState.onConfirmar === "function") {
      modalState.onConfirmar();
    }
    cerrarModal();
  }, [modalState, cerrarModal]);

  const mostrarAlerta = useCallback((mensaje, tipo = "info") => {
    setToastAlerta({ visible: true, mensaje, tipo });
    setTimeout(() => {
      setToastAlerta({ visible: false, mensaje: "", tipo: "info" });
    }, 4000);
  }, []);

  const ocultarAlerta = useCallback(() => {
    setToastAlerta({ visible: false, mensaje: "", tipo: "info" });
  }, []);

  const value = {
    abrirModal,
    cerrarModal,
    mostrarAlerta,
    ocultarAlerta,
    modalState,
    toastAlerta
  };

  return (
    <UIModalContext.Provider value={value}>
      {children}

      {/* Renderizado del Modal Global */}
      <Modal
        show={modalState.abierto}
        onHide={cerrarModal}
        centered
        contentClassName="bg-dark text-light border border-secondary"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="epic-heading h5 mb-0">
            {modalState.titulo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-secondary">
          {modalState.mensaje}
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          {modalState.tipo === "confirmacion" && (
            <Button variant="outline-secondary" onClick={cerrarModal}>
              {modalState.textoCancelar}
            </Button>
          )}
          <Button
            variant={modalState.tipo === "error" ? "danger" : "primary"}
            onClick={confirmarAccion}
          >
            {modalState.textoConfirmar}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alerta flotante */}
      {toastAlerta.visible && (
        <div
          className={`position-fixed bottom-0 end-0 m-3 p-3 alert alert-${toastAlerta.tipo === "error" ? "danger" : toastAlerta.tipo === "exito" ? "success" : "info"} shadow-lg`}
          style={{ zIndex: 1060, maxWidth: "350px" }}
          role="alert"
        >
          <div className="d-flex justify-content-between align-items-center">
            <span>{toastAlerta.mensaje}</span>
            <button
              type="button"
              className="btn-close ms-2"
              onClick={ocultarAlerta}
              aria-label="Cerrar"
            ></button>
          </div>
        </div>
      )}
    </UIModalContext.Provider>
  );
};

export const useUIModal = () => {
  const context = useContext(UIModalContext);
  if (!context) {
    throw new Error("useUIModal debe ser utilizado dentro de un UIModalProvider");
  }
  return context;
};

export default UIModalContext;

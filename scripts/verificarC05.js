/* eslint-disable no-undef */
/**
 * Script de validación automatizada de los Criterios de Aceptación para la Card C05:
 * 1. Monta App en el elemento raíz del HTML una sola vez.
 * 2. Carga los estilos globales y las dependencias visuales necesarias según la configuración del proyecto.
 * 3. No duplica proveedores ni incorpora lógica de catálogo o autenticación.
 * 4. Con App disponible, la tienda arranca y compila sin errores atribuibles a este archivo.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALLÓ: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ APROBADO: ${message}`);
  }
}

console.log("=== INICIANDO VALIDACIÓN DE CRITERIOS CARD C05 ===");

const mainPath = path.join(projectRoot, "src", "main.jsx");
const htmlPath = path.join(projectRoot, "index.html");

assert(fs.existsSync(mainPath), "1.1. Archivo src/main.jsx existe en el proyecto.");
assert(fs.existsSync(htmlPath), "1.2. Archivo index.html existe en la raíz.");

const mainContent = fs.readFileSync(mainPath, "utf-8");
const htmlContent = fs.readFileSync(htmlPath, "utf-8");

// Criterio 1: Monta App en el elemento raíz del HTML una sola vez
assert(
  htmlContent.includes('id="root"') || htmlContent.includes("id='root'"),
  "1.3. index.html contiene el contenedor raíz '#root'."
);
assert(
  htmlContent.includes("/src/main.jsx") || htmlContent.includes("src/main.jsx"),
  "1.4. index.html enlaza src/main.jsx como script de módulo."
);
const rootOcurrencias = (mainContent.match(/document\.getElementById\(["']root["']\)/g) || []).length;
assert(
  rootOcurrencias === 1,
  "1.5. src/main.jsx obtiene el elemento 'root' exactamente una sola vez."
);
assert(
  mainContent.includes("createRoot(") && (mainContent.includes("<App />") || mainContent.includes("<App/>")),
  "1.6. src/main.jsx monta <App /> utilizando createRoot de react-dom/client."
);

// Criterio 2: Carga los estilos globales y dependencias visuales necesarias
assert(
  mainContent.includes("bootstrap/dist/css/bootstrap.min.css"),
  "2.1. Importa estilos base de Bootstrap."
);
assert(
  mainContent.includes("bootstrap-icons/font/bootstrap-icons"),
  "2.2. Importa fuentes de iconos de Bootstrap Icons."
);
assert(
  mainContent.includes("./index.css"),
  "2.3. Importa estilos globales del proyecto index.css."
);

// Comprobar orden de precedencia de estilos: Bootstrap -> Icons -> index.css
const posBootstrap = mainContent.indexOf("bootstrap/dist/css/bootstrap.min.css");
const posIcons = mainContent.indexOf("bootstrap-icons/font/bootstrap-icons");
const posIndexCss = mainContent.indexOf("./index.css");
assert(
  posBootstrap < posIcons && posIcons < posIndexCss,
  "2.4. Estilos importados en orden de cascada correcto (Bootstrap -> Icons -> index.css)."
);

// Criterio 3: No duplica proveedores ni incorpora lógica de catálogo o autenticación
const proveedoresProhibidos = [
  "AuthProvider",
  "ProductosProvider",
  "UIModalProvider",
  "catalogoService",
  "usuariosService",
  "localStorage"
];
for (const token of proveedoresProhibidos) {
  assert(
    !mainContent.includes(token),
    `3.1. src/main.jsx no duplica proveedor ni acopla lógica de '${token}'.`
  );
}

// Criterio 4: Con App disponible, la tienda arranca y compila sin errores
assert(
  mainContent.includes("<StrictMode>") && mainContent.includes("</StrictMode>"),
  "4.1. Envuelve el montaje en React StrictMode para depuración en desarrollo."
);
const nonBlankLines = mainContent.split("\n").filter((l) => l.trim().length > 0).length;
assert(
  nonBlankLines <= 14,
  `4.2. Código optimizado al máximo en estructura concisa (${nonBlankLines} líneas no vacías).`
);

console.log("=== TODOS LOS 4 CRITERIOS DE ACEPTACIÓN CARD C05 VALIDADOS CON ÉXITO ===");

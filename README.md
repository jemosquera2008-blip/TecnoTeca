# TecnoTeca
## Descripción General
VirtualLibrary es un sistema de gestión de biblioteca virtual desarrollado como una aplicación web. Permite a los usuarios registrarse, iniciar sesión, buscar libros, y a los administradores gestionar usuarios y agregar libros. El proyecto incluye un frontend basado en HTML, CSS y JavaScript, y un backend construido con Node.js y Express, utilizando MySQL como base de datos.

## Estructura del Proyecto
- **admin/**: Páginas y scripts para el panel de administración (agregar libros, control de usuarios).
- **backend/**: Código del servidor backend, incluyendo la API, conexión a base de datos y carga de libros.
- **docs/**: Archivos PDF de libros disponibles en la biblioteca.
- **images/**: Imágenes utilizadas en la interfaz (fondos, iconos).
- **log/**: Páginas de login y registro, con estilos y scripts asociados.
- **uploads/**: Directorio para archivos subidos (posiblemente libros o imágenes).
- **user/**: Páginas para usuarios (búsqueda, contacto, principal).
- **schema.sql**: Esquema de la base de datos MySQL.
- **package.json**: Dependencias del proyecto principal.
- **backend/package.json**: Dependencias específicas del backend.

## Herramientas y Tecnologías Usadas
### Lenguajes y Frameworks
- **Frontend**:
  - HTML5: Para la estructura de las páginas.
  - CSS3: Para estilos y diseño responsivo (archivos como style.css, stylelog.css, etc.).
  - JavaScript (ES6+): Para interactividad del lado cliente (archivos en admin/js/, log/js/, docs/js/, etc.).
- **Backend**:
  - Node.js: Entorno de ejecución para JavaScript en el servidor.
  - Express.js: Framework web para Node.js, utilizado para crear la API REST.
- **Base de Datos**:
  - MySQL: Sistema de gestión de bases de datos relacional.

### Librerías y Dependencias (desde package.json)
- **Dependencias principales (backend/package.json)**:
  - express (^5.1.0): Framework para el servidor web.
  - mysql2 (^3.15.3): Cliente MySQL para Node.js.
  - bcryptjs (^3.0.3): Para hashing de contraseñas.
  - cors (^2.8.5): Para habilitar CORS en el servidor.
  - nodemailer (^7.0.10): Para envío de correos electrónicos (posiblemente para notificaciones o recuperación de contraseña).
- **Dependencias del proyecto principal (package.json)**:
  - dotenv (^17.2.3): Para gestión de variables de entorno.
  - multer (^2.0.2): Middleware para manejo de archivos multipart/form-data (usado para subir libros o imágenes).

### Extensiones y Herramientas de Desarrollo
- **VSCode Extensions** (inferidas del código y estructura):
  - Live Server: Para servir archivos HTML localmente durante desarrollo.
  - JavaScript (ES6) code snippets: Para autocompletado y snippets de JS.
  - Prettier: Para formateo de código (HTML, CSS, JS).
  - ESLint: Para linting de JavaScript.
  - MySQL: Para gestión y consulta de bases de datos MySQL.
- **Herramientas Externas**:
  - Git: Para control de versiones.
  - npm: Gestor de paquetes para Node.js (usado para instalar dependencias).
  - MySQL Workbench o similar: Para diseño y gestión del esquema de base de datos.

## Instalación y Configuración
1. Clona el repositorio.
2. Instala dependencias: Ejecuta `npm install` en la raíz y en `backend/`.
3. Configura la base de datos: Usa `schema.sql` para crear las tablas en MySQL.
4. Configura variables de entorno: Crea un archivo `.env` con credenciales de DB y otras configuraciones.
5. Ejecuta el servidor: `npm start` en `backend/`.
6. Abre `index.html` en un navegador para acceder al frontend.

## Uso
- Usuarios pueden registrarse, iniciar sesión y buscar libros.
- Administradores pueden agregar libros y gestionar usuarios a través del panel admin.

## Contribución
Para contribuir, sigue las mejores prácticas de desarrollo web y asegúrate de que el código pase linting y pruebas.

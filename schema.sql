CREATE DATABASE tecnoteca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tecnoteca;

-- ===============================
-- 🔹 TABLA DE ROLES
-- ===============================
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- ===============================
-- 🔹 TABLA DE USUARIOS
-- ===============================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contraseña VARCHAR(255) NOT NULL,  -- Longitud suficiente para hash bcrypt (60)
  rol_id INT DEFAULT 2,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- ===============================
-- 🔹 TABLA DE LIBROS
-- ===============================
CREATE TABLE libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  autor VARCHAR(100),
  categoria VARCHAR(100),
  descripcion TEXT,
  nombre_archivo VARCHAR(255),
  ruta_pdf VARCHAR(255),
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ===============================
-- 🔹 INSERTAR ROLES
-- ===============================
INSERT INTO roles (nombre) VALUES ('ADMIN'), ('USER');

-- ===============================
-- 🔹 INSERTAR USUARIO ADMINISTRADOR
-- 📧 Correo: admin@gmail.com
-- 🔑 Contraseña: admin123 (bcrypt hash generado por ti)
-- ===============================
INSERT INTO usuarios (nombre, correo, contraseña, rol_id)
VALUES (
  'Administrador',
  'admin@gmail.com',
  '$2b$10$UO4dofnXhSk8N3E4b/rJxenSVKNOwo8XpUdRN5GkrGC3hnZrmiOOa',
  1
);


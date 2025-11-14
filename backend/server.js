import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs/promises";

dotenv.config();

const app = express();

// ==========================
// RUTAS ABSOLUTAS
// ==========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// MIDDLEWARES
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.resolve(__dirname, "../")));
app.use("/docs", express.static(path.join(__dirname, "../docs")));

console.log("📁 Sirviendo PDFs desde:", path.join(__dirname, "../docs"));
console.log("🟢 Server.js activo en:", __filename);

// ==========================
// CONEXIÓN A BASE DE DATOS
// ==========================
let db;
try {
  db = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    database: "tecnoteca",
  });

  console.log("✅ Conectado a MySQL → tecnoteca");
} catch (err) {
  console.error("❌ Error al conectar BD:", err.message);
  process.exit(1);
}

// ==========================
// LOGIN
// ==========================
app.post("/login", async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const [rows] = await db.execute(
      `SELECT u.id, u.nombre, u.correo, u.contraseña,
              r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.correo = ?`,
      [correo]
    );

    if (rows.length === 0)
      return res.status(404).send("Usuario no encontrado");

    const usuario = rows[0];
    const ok = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!ok) return res.status(401).send("Contraseña incorrecta");

    delete usuario.contraseña;
    res.json(usuario);
  } catch (err) {
    console.error("❌ Error login:", err.message);
    res.status(500).send("Error interno");
  }
});

// ==========================
// GET LIBROS
// ==========================
app.get("/libros", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, titulo, autor, categoria, ruta_pdf AS archivo FROM libros"
    );

    rows.forEach(l => {
      if (!l.archivo.startsWith("/")) l.archivo = "/" + l.archivo;
    });

    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener libros:", err.message);
    res.status(500).json({ ok: false, msg: "Error al obtener libros" });
  }
});

// ==========================
// SUBIDA DE PDFs
// ==========================
const docsPath = path.join(__dirname, "../docs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, docsPath),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith(".pdf")) {
      return cb(new Error("Solo se permiten PDFs"));
    }
    cb(null, true);
  }
});

//=========== confirmacion categorias ============
const categoriasPermitidas = [
  "Novela",
  "Cuento",
  "Filosofía",
  "Terror",
  "Ensayo",
  "Poesía",
  "Aventura",
  "Tragedia",
  "Ciencia ficción"
];

// ==========================
// POST LIBROS → AGREGAR
// ==========================
app.post("/libros", upload.single("pdf"), async (req, res) => {
  try {
    const { titulo, autor, categoria } = req.body;

    if (!req.file)
      return res.status(400).json({ ok: false, msg: "No se subió PDF" });

    // VALIDAR CATEGORÍA
    if (!categoriasPermitidas.includes(categoria)) {
      return res.status(400).json({
        ok: false,
        msg: `La categoría '${categoria}' no existe. Categorías válidas: ${categoriasPermitidas.join(", ")}`
      });
    }

    const rutaDB = "docs/" + req.file.filename;

    await db.execute(
      "INSERT INTO libros (titulo, autor, categoria, ruta_pdf) VALUES (?, ?, ?, ?)",
      [titulo, autor, categoria, rutaDB]
    );

    res.json({
      ok: true,
      msg: "Libro agregado correctamente",
      archivo: "/" + rutaDB
    });

  } catch (err) {
    console.error("❌ Error POST /libros:", err.message);
    res.status(500).json({ ok: false, msg: "Error al guardar libro" });
  }
});


// ==========================
// DELETE LIBRO
// ==========================
app.delete("/libros/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT ruta_pdf FROM libros WHERE id = ?", [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ ok: false, msg: "Libro no encontrado" });

    const filePath = path.join(__dirname, "../", rows[0].ruta_pdf);

    try { await fs.unlink(filePath); }
    catch { console.warn("⚠ No se encontró el PDF, eliminando igualmente..."); }

    await db.execute("DELETE FROM libros WHERE id = ?", [id]);

    res.json({ ok: true, msg: "Libro eliminado" });
  } catch (err) {
    console.error("❌ DELETE /libros:", err.message);
    res.status(500).json({ ok: false, msg: "Error al eliminar libro" });
  }
});

// ==========================
// GET USUARIOS
// ==========================
app.get("/usuarios", async (req, res) => {
  console.log("🚀 Llegó petición GET /usuarios");

  try {
    const [rows] = await db.execute(`
      SELECT u.id, u.nombre, u.correo, r.nombre AS rol, u.fecha_registro
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
    `);

    return res.json(rows);

  } catch (err) {
    console.error("❌ ERROR SQL EN /usuarios:", err);
    return res.status(500).json({ ok: false, msg: "Error SQL" });
  }
});

// ==========================
// DELETE USUARIO
// ==========================
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT id FROM usuarios WHERE id = ?", [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });

    await db.execute("DELETE FROM usuarios WHERE id = ?", [id]);

    res.json({ ok: true, msg: "Usuario eliminado" });
  } catch (err) {
    console.error("❌ Error delete usuario:", err.message);
    res.status(500).json({ ok: false, msg: "Error al eliminar usuario" });
  }
});

// ==========================
// PUT USUARIO (EDITAR)
// ==========================
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { nombre, rol } = req.body;
    const { id } = req.params;

    if (!nombre || !rol)
      return res.status(400).json({ ok: false, msg: "Faltan datos" });

    const rol_id = rol.toUpperCase() === "ADMIN" ? 1 : 2;

    await db.execute(
      "UPDATE usuarios SET nombre = ?, rol_id = ? WHERE id = ?",
      [nombre, rol_id, id]
    );

    res.json({ ok: true, msg: "Usuario actualizado" });
  } catch (err) {
    console.error("❌ Error update usuario:", err.message);
    res.status(500).json({ ok: false, msg: "Error al actualizar usuario" });
  }
});

// ==========================
// CONTACTO
// ==========================
app.post("/contacto", async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: correo,
      to: process.env.EMAIL_USER,
      subject: "Nuevo mensaje desde TecnoTeca",
      text: `Nombre: ${nombre}\nCorreo: ${correo}\n\n${mensaje}`
    });

    res.json({ ok: true, mensaje: "Mensaje enviado correctamente" });
  } catch (err) {
    console.error("❌ Error contacto:", err.message);
    res.status(500).json({ ok: false, mensaje: "Error al enviar mensaje" });
  }
});

// ==========================
// 404
// ==========================
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada: " + req.url);
});

// ==========================
// SERVIDOR
// ==========================
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);

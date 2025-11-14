import mysql from "mysql2";

const conexion = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",       // cambia si tu usuario de MySQL es otro
  password: "1234",       // escribe tu contraseña de MySQL (si tienes)
  database: "tecnoteca"
});

conexion.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err);
    return;
  }
  console.log("✅ Conectado a la base de datos tecnoteca");
});

export default conexion;

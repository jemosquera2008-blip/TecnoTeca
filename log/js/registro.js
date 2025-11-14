document.getElementById("registroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.querySelector("input[name='usuario']").value.trim();
  const correo = document.querySelector("input[name='email']").value.trim();
  const contrasena = document.querySelector("input[name='contrasena']").value.trim();
  const confirmar = document.querySelector("input[name='confirmar']").value.trim();

  // 🧩 Verificación de campos vacíos
  if (!nombre || !correo || !contrasena || !confirmar) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos.",
    });
    return;
  }

  // 🧩 Verificación de formato Gmail
  if (!correo.toLowerCase().endsWith("@gmail.com")) {
    Swal.fire({
      icon: "error",
      title: "Correo no válido",
      text: "Solo se permiten correos que terminen en @gmail.com",
    });
    return;
  }

  // 🧩 Verificación de contraseñas
  if (contrasena !== confirmar) {
    Swal.fire({
      icon: "error",
      title: "Contraseñas no coinciden",
      text: "Verifica que las contraseñas sean iguales.",
    });
    return;
  }

  // 🧩 Envío al backend
  try {
    const res = await fetch("http://localhost:3000/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contraseña: contrasena }),
    });

    const data = await res.text();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: data,
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => (window.location.href = "login.html"), 2000);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: data,
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor.",
    });
    console.error(err);
  }
});

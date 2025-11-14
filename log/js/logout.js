document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Verificar si hay sesión activa
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Si no hay usuario logueado, redirigir al login
  if (!usuario) {
    window.location.href = "../log/login.html";
    return;
  }

  // 🔹 Mostrar nombre (para admin o usuario)
  const nombreSpan = document.getElementById("nombreAdmin") || document.getElementById("nombreUsuario");
  if (nombreSpan) {
    nombreSpan.textContent = usuario.nombre;
  }

  // 🔹 Buscar enlace de cierre de sesión
  const cerrarSesionLink = document.querySelector('a[href="../log/login.html"]');

  if (cerrarSesionLink) {
    cerrarSesionLink.addEventListener("click", (e) => {
  e.preventDefault(); // Evita la redirección automática

  // Eliminar la sesión guardada
  localStorage.removeItem("usuario");

  // Mostrar mensaje moderno con SweetAlert2
  Swal.fire({
    icon: "success",
    title: "Sesión cerrada",
    text: "Has cerrado sesión correctamente.",
    confirmButtonText: "Aceptar",
    background: "#f8f9fa",
    color: "#333"
  }).then(() => {
    // Redirigir después de cerrar el alert
    window.location.href = "../log/login.html";
  });
})}});

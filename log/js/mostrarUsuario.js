document.addEventListener("DOMContentLoaded", () => {
    const span = document.getElementById("username");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (span && usuario) {
        span.textContent = usuario.nombre;
    }
});

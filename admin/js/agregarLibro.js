console.log("📚 agregarLibro.js cargado correctamente");

// ==========================
// VALIDACIÓN DE ADMIN
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.rol.toUpperCase() !== "ADMIN") {
        Swal.fire("Acceso denegado", "Solo administradores pueden ingresar", "error");
        return (window.location.href = "../log/login.html");
    }

    document.getElementById("nombreAdmin").textContent = usuario.nombre;
});

// ==========================
// ELEMENTOS DEL FORM
// ==========================
const form = document.getElementById("form-agregar-libro");
const fileInput = document.getElementById("archivo");
const fileName = document.getElementById("file-name");

// Mostrar nombre del archivo seleccionado
fileInput.addEventListener("change", () => {
    fileName.textContent = fileInput.files.length
        ? fileInput.files[0].name
        : "Ningún archivo seleccionado";
});

// ==========================
// ENVÍO DEL FORMULARIO
// ==========================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Mostrar loading
    Swal.fire({
        title: "Subiendo libro...",
        html: "Por favor espere",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const res = await fetch("http://localhost:3000/libros", {
            method: "POST",
            body: formData
        });

        const data = await res.json().catch(() => null);

        if (!data) {
            Swal.fire("Error", "El servidor no respondió con JSON válido", "error");
            return;
        }

        if (res.ok && data.ok) {

            // Esperar un pequeño delay antes de mostrar el success
            setTimeout(() => {

                Swal.fire({
                    icon: "success",
                    title: "📘 Libro agregado correctamente",
                    text: data.msg,
                    confirmButtonText: "Aceptar",
                    heightAuto: false
                });

                // Resetear el formulario después del alert
                form.reset();
                fileName.textContent = "Ningún archivo seleccionado";

            }, 200);

        } else {
            Swal.fire("Error", data.msg || "No se pudo agregar el libro", "error");
        }

    } catch (err) {
        console.error("❌ Error al enviar:", err);
        Swal.fire("Error", "No se pudo conectar al servidor", "error");
    }
});

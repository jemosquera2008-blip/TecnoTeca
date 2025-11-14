console.log("🧩 usercontrol.js cargado");

window.addEventListener("load", async () => {

    // ================================
    // Validación de sesión (solo ADMIN)
    // ================================
    const usuarioData = localStorage.getItem("usuario");
    if (!usuarioData) {
        Swal.fire("Acceso denegado", "Debe iniciar sesión", "warning");
        return (window.location.href = "../log/login.html");
    }

    const usuario = JSON.parse(usuarioData);

    if (!usuario.rol || usuario.rol.toUpperCase() !== "ADMIN") {
        Swal.fire("Acceso restringido", "Solo administradores pueden ingresar", "error");
        return (window.location.href = "../log/login.html");
    }

    // Mostrar nombre del admin si existe elemento
    const nombreAdmin = document.getElementById("nombreAdmin");
    if (nombreAdmin) nombreAdmin.textContent = usuario.nombre;


    // =====================================
    // ELEMENTOS DEL DOM
    // =====================================
    const tablaUsuarios = document.getElementById("tabla-usuarios");
    const contenedorUsuarios = document.getElementById("usuarios-container");


    // =====================================
    // LISTA DE USUARIOS
    // =====================================
    let usuarios = [];

    async function cargarUsuarios() {
        try {
            const res = await fetch("http://localhost:3000/usuarios");

            if (!res.ok) throw new Error("Error al cargar usuarios");

            usuarios = await res.json();
            renderUsuarios();

        } catch (err) {
            console.error(err);
            contenedorUsuarios.innerHTML = `<p>Error al cargar usuarios</p>`;
        }
    }


    // =====================================
    // RENDERIZAR TABLA
    // =====================================
    function renderUsuarios() {
        tablaUsuarios.innerHTML = "";

        if (usuarios.length === 0) {
            tablaUsuarios.innerHTML = `
                <tr><td colspan="5" class="no-users">No hay usuarios registrados.</td></tr>
            `;
            return;
        }

        usuarios.forEach(u => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>${u.rol}</td>
                <td>
                    <button class="edit-btn" data-id="${u.id}">Editar</button>
                    <button class="delete-btn" data-id="${u.id}">Eliminar</button>
                </td>
            `;

            tablaUsuarios.appendChild(row);
        });

        // Añadir los listeners
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", eliminarUsuario);
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", editarUsuario);
        });
    }


    // =====================================
    // ELIMINAR USUARIO
    // =====================================
    async function eliminarUsuario(e) {
        const id = e.target.dataset.id;

        Swal.fire({
            title: "¿Eliminar usuario?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {

            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
                        method: "DELETE"
                    });

                    const data = await res.json();

                    if (data.ok) {
                        Swal.fire("Eliminado", "El usuario fue eliminado correctamente", "success");
                        await cargarUsuarios();
                    } else {
                        Swal.fire("Error", data.msg || "No se pudo eliminar", "error");
                    }
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "No se pudo conectar al servidor", "error");
                }
            }
        });
    }


    // =====================================
    // EDITAR USUARIO
    // =====================================
    async function editarUsuario(e) {
        const id = e.target.dataset.id;
        const usuario = usuarios.find(u => u.id == id);

        if (!usuario) return;

        // Abrimos modal SweetAlert
        const { value: valores } = await Swal.fire({
            title: "Editar usuario",
            html: `
                <label>Nombre:</label>
                <input id="swal-nombre" class="swal2-input" value="${usuario.nombre}">

                <label>Rol:</label>
                <select id="swal-rol" class="swal2-input">
                    <option value="ADMIN" ${usuario.rol === "ADMIN" ? "selected" : ""}>ADMIN</option>
                    <option value="USUARIO" ${usuario.rol === "USUARIO" ? "selected" : ""}>USUARIO</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Guardar cambios",
            preConfirm: () => {
                return {
                    nombre: document.getElementById("swal-nombre").value.trim(),
                    rol: document.getElementById("swal-rol").value
                };
            }
        });

        if (!valores) return;

        // Enviar cambios al servidor
        try {
            const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(valores)
            });

            const data = await res.json();

            if (data.ok) {
                Swal.fire("Actualizado", "El usuario fue actualizado.", "success");
                await cargarUsuarios();

            } else {
                Swal.fire("Error", data.msg, "error");
            }

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo conectar al servidor", "error");
        }
    }


    // =====================================
    // INICIO
    // =====================================
    cargarUsuarios();
});

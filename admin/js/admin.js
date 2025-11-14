// admin.js (nuevo)
console.log("🧩 admin.js cargado correctamente");

window.addEventListener("load", async () => {
  const usuarioData = localStorage.getItem("usuario");
  if (!usuarioData) {
    alert("Debes iniciar sesión para acceder a esta zona.");
    window.location.href = "../log/login.html";
    return;
  }
  const usuario = JSON.parse(usuarioData);
  if (!usuario.rol || usuario.rol.toUpperCase() !== "ADMIN") {
    alert("Acceso restringido. Solo administradores pueden ingresar.");
    window.location.href = "../log/login.html";
    return;
  }

  const nombreAdmin = document.getElementById("nombreAdmin");
  if (nombreAdmin) nombreAdmin.textContent = usuario.nombre;

  // ELEMENTOS
  const tabla = document.getElementById("tabla-admin");
  const searchForm = document.getElementById("search-form");
  const inputSearch = document.getElementById("search-input");
  const filterBtn = document.getElementById("filter-btn");
  const filterMenu = document.getElementById("filter-menu");
  const viewer = document.getElementById("viewer");
  const frame = document.getElementById("doc-frame");
  const closeViewer = document.getElementById("close-viewer");

  let libros = []; // cargados desde API
  let categoriaSeleccionada = "";

  async function cargarLibros() {
    try {
      const res = await fetch("http://localhost:3000/libros");
      if (!res.ok) throw new Error("No se pudieron cargar los libros");
      libros = await res.json();
      ejecutarBusqueda(); // render inicialmente vacío o con todos según input
    } catch (err) {
      console.error(err);
      tabla.innerHTML = "<p>Error al cargar libros.</p>";
    }
  }

  function renderTabla(lista) {
    tabla.innerHTML = "";
    if (!lista || lista.length === 0) {
      tabla.innerHTML = "<p>No se encontraron libros.</p>";
      return;
    }

    lista.forEach(libro => {
      const div = document.createElement("div");
      div.className = "book-card";
      div.innerHTML = `
        <h3>${libro.titulo}</h3>
        <p><strong>Autor:</strong> ${libro.autor}</p>
        <p><strong>Categoría:</strong> ${libro.categoria}</p>
        <div class="admin-btns">
          <button class="btn-ver" data-id="${libro.id}">Ver</button>
          <button class="btn-eliminar" data-id="${libro.id}">Eliminar</button>
        </div>
      `;
      tabla.appendChild(div);
    });

    // listeners
    tabla.querySelectorAll(".btn-ver").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const libro = libros.find(l => String(l.id) === String(id));
        if (libro && libro.archivo) {
          frame.src = window.location.origin + libro.archivo;
          viewer.classList.add("active");
        } else {
          Swal.fire("Archivo no disponible", "No hay PDF asociado.", "info");
        }
      });
    });

    tabla.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        // usando SweetAlert para confirmación bonita
        Swal.fire({
          title: '¿Eliminar este libro?',
          text: "La acción no se puede deshacer.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const del = await fetch(`http://localhost:3000/libros/${id}`, {
                method: 'DELETE'
              });
              const json = await del.json();
              if (json.ok) {
                Swal.fire('Eliminado', 'El libro ha sido eliminado.', 'success');
                await cargarLibros();
              } else {
                Swal.fire('Error', json.msg || 'No se pudo eliminar', 'error');
              }
            } catch (err) {
              console.error(err);
              Swal.fire('Error', 'No se pudo conectar al servidor', 'error');
            }
          }
        });
      });
    });
  }

  function ejecutarBusqueda() {
    const q = inputSearch.value.trim().toLowerCase();
    const filtrados = libros.filter(l => {
      const matchText = l.titulo.toLowerCase().includes(q) || l.autor.toLowerCase().includes(q);
      const matchCat = categoriaSeleccionada === "" || l.categoria === categoriaSeleccionada;
      return matchText && matchCat;
    });
    renderTabla(filtrados);
  }

  // filtro UI
  filterBtn.addEventListener("click", () => filterMenu.classList.toggle("active"));
  filterMenu.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", () => {
      categoriaSeleccionada = item.dataset.category;
      const span = filterBtn.querySelector("span");
      if (span) span.textContent = item.textContent === "Todas" ? "Categorías ▼" : item.textContent + " ▼";
      filterMenu.classList.remove("active");
      ejecutarBusqueda();
    });
  });
  document.addEventListener("click", (e) => {
    if (!filterMenu.contains(e.target) && !filterBtn.contains(e.target)) filterMenu.classList.remove("active");
  });

  // búsqueda
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ejecutarBusqueda();
  });
  inputSearch.addEventListener("input", ejecutarBusqueda);

  // visor
  closeViewer.addEventListener("click", () => {
    viewer.classList.remove("active");
    setTimeout(() => frame.src = "", 250);
  });

  viewer.addEventListener("click", (e) => {
    if (e.target === viewer) {
      viewer.classList.remove("active");
      setTimeout(() => frame.src = "", 250);
    }
  });

  // cargar al inicio
  await cargarLibros();
});

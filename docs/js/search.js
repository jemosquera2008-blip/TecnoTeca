// ===============================
// 🔹 Variables globales
// ===============================
let libros = [];
let categoriaSeleccionada = "";

// ===============================
// 🔹 Cargar libros desde backend
// ===============================
async function cargarLibros() {
  try {
    const response = await fetch("http://localhost:3000/libros");

    if (!response.ok) {
      throw new Error("No se pudieron cargar los libros");
    }

    libros = await response.json(); // SOLO cargamos, sin mostrar
  } catch (error) {
    console.error("❌ Error al obtener libros:", error);
  }
}


// ===============================
// 🔹 Mostrar libros
// ===============================
function mostrarLibros(lista) {
  const contenedor = document.getElementById("resultados");
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  lista.forEach((libro) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("book-card");

    tarjeta.innerHTML = `
      <h3>${libro.titulo}</h3>
      <p><strong>Autor:</strong> ${libro.autor}</p>
      <p><strong>Categoría:</strong> ${libro.categoria}</p>
    `;

    // Abrir PDF en visor
    tarjeta.addEventListener("click", () => {
      const viewer = document.getElementById("viewer");
      const frame = document.getElementById("doc-frame");

      if (libro.archivo && libro.archivo.endsWith(".pdf")) {
        frame.src = libro.archivo; // YA viene como /docs/*.pdf
        viewer.classList.add("active");
      } else {
        Swal.fire("Archivo no disponible", "Este libro no tiene PDF asociado.", "info");
      }
    });

    contenedor.appendChild(tarjeta);
  });
}

// ===============================
// 🔹 Cerrar visor de PDF
// ===============================
document.getElementById("close-viewer").addEventListener("click", () => {
  const viewer = document.getElementById("viewer");
  const frame = document.getElementById("doc-frame");

  frame.src = "";
  viewer.classList.remove("active");
});

// ===============================
// 🔹 Filtrar libros
// ===============================
function filtrarLibros(texto) {
  const txt = texto.toLowerCase();

  const filtrados = libros.filter((libro) => {
    const coincideTexto =
      libro.titulo.toLowerCase().includes(txt) ||
      libro.autor.toLowerCase().includes(txt);

    const coincideCategoria =
      categoriaSeleccionada === "" ||
      libro.categoria === categoriaSeleccionada;

    return coincideTexto && coincideCategoria;
  });

  mostrarLibros(filtrados);
}

// ===============================
// 🔹 Buscador
// ===============================
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = document.getElementById("search-input").value;
  filtrarLibros(texto);
});

// ===============================
// 🔹 Filtro desplegable
// ===============================
const filterBtn = document.getElementById("filter-btn");
const filterMenu = document.getElementById("filter-menu");

filterBtn.addEventListener("click", () => {
  filterMenu.classList.toggle("active");
});

document.querySelectorAll("#filter-menu li").forEach((item) => {
  item.addEventListener("click", () => {
    categoriaSeleccionada = item.dataset.category;
    filtrarLibros(document.getElementById("search-input").value);
    filterMenu.classList.remove("active");
  });
});

document.querySelectorAll("#filter-menu li").forEach((item) => {
    item.addEventListener("click", () => {
        categoriaSeleccionada = item.dataset.category;

        // 👉 Cambiar el texto del botón según la categoría seleccionada
        const btn = document.querySelector("#filter-btn span");

        if (categoriaSeleccionada === "") {
            btn.textContent = "Todas las categorías";
        } else {
            btn.textContent = categoriaSeleccionada;
        }

        // Filtrar con el texto actual del input
        filtrarLibros(document.getElementById("search-input").value);

        // Ocultar el menú después de elegir
        document.getElementById("filter-menu").classList.remove("active");
    });
});


// Cerrar menú si el usuario hace clic afuera
document.addEventListener("click", (event) => {
  if (!filterMenu.contains(event.target) && !filterBtn.contains(event.target)) {
    filterMenu.classList.remove("active");
  }
});

// ===============================
// 🔹 Iniciar
// ===============================
window.addEventListener("load", () => {
  cargarLibros(); // se cargan a memoria pero NO se muestran
});
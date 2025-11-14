import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234", // cambia si usas otra clave
  database: "tecnoteca",
});

console.log("✅ Conectado a la base de datos tecnoteca");

// ===================================================
// 🔹 Tu lista completa de libros
// ===================================================
const libros = [
    { titulo: "El alienista", autor: "Machado de Assis", categoria: "Cuento", archivo: "../docs/Alienista.pdf" },
    { titulo: "Anécdota pecuniaria", autor: "Desconocido", categoria: "Relato", archivo: "../docs/AnecdotaPecuniaria.pdf" },
    { titulo: "El anillo", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/Anillo.pdf" },
    { titulo: "El anticristo", autor: "Friedrich Nietzsche", categoria: "Filosofía", archivo: "../docs/Anticristo.pdf" },
    { titulo: "La aparición", autor: "Guy de Maupassant", categoria: "Cuento", archivo: "../docs/Aparicion.pdf" },
    { titulo: "Apología de Sócrates", autor: "Platón", categoria: "Filosofía", archivo: "../docs/Apologia_de_Socrates-Platon.pdf" },
    { titulo: "El asesinato", autor: "Edgar Allan Poe", categoria: "Misterio", archivo: "../docs/Asesinato.pdf" },
    { titulo: "Berenice", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/Berenice.pdf" },
    { titulo: "Bug Jargal", autor: "Victor Hugo", categoria: "Novela", archivo: "../docs/Bug_Jargal-Victor_Hugo.pdf" },
    { titulo: "Caballería roja", autor: "Isaac Babel", categoria: "Relato", archivo: "../docs/CaballeriaRoja_Babel.pdf" },
    { titulo: "La cabellera", autor: "Guy de Maupassant", categoria: "Cuento", archivo: "../docs/Cabellera.pdf" },
    { titulo: "La caída de la Casa Usher", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/CaidaCasaUsher.pdf" },
    { titulo: "El camello del globo", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/CameloGlobo.pdf" },
    { titulo: "Cándido", autor: "Voltaire", categoria: "Filosofía", archivo: "../docs/Candido_Voltaire.pdf" },
    { titulo: "El capote", autor: "Nikolái Gógol", categoria: "Cuento", archivo: "../docs/Capote.pdf" },
    { titulo: "El carrito fantasma", autor: "Rudyard Kipling", categoria: "Cuento", archivo: "../docs/CarritoFantasma_Kipling.pdf" },
    { titulo: "Carta al padre", autor: "Franz Kafka", categoria: "Epistolar", archivo: "../docs/Carta al padre. Kafka.pdf" },
    { titulo: "Carta encontrada", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/CartaEncontro.pdf" },
    { titulo: "La casa del juez", autor: "Bram Stoker", categoria: "Terror", archivo: "../docs/Casa_del_juez-Stoker.pdf" },
    { titulo: "La causa secreta", autor: "Machado de Assis", categoria: "Cuento", archivo: "../docs/CausaSecreta.pdf" },
    { titulo: "La cláusula testamentaria", autor: "Desconocido", categoria: "Relato", archivo: "../docs/ClausulaTestamentaria.pdf" },
    { titulo: "El contrato social", autor: "Jean-Jacques Rousseau", categoria: "Filosofía", archivo: "../docs/ContratoSocial.pdf" },
    { titulo: "Corazón", autor: "Edmondo de Amicis", categoria: "Novela", archivo: "../docs/Corazon_Amicis.pdf" },
    { titulo: "El corazón delator", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/CorazonDelator.pdf" },
    { titulo: "El corazón de las tinieblas", autor: "Joseph Conrad", categoria: "Novela", archivo: "../docs/CorazonTinieblas_Conrad.pdf" },
    { titulo: "Los crímenes de la calle Morgue", autor: "Edgar Allan Poe", categoria: "Misterio", archivo: "../docs/CrimenesCalleMorgue.pdf" },
    { titulo: "Cuento de Navidad", autor: "Charles Dickens", categoria: "Clásico", archivo: "../docs/CuentoNavidad.pdf" },
    { titulo: "Cuentos de la Alhambra", autor: "Washington Irving", categoria: "Cuentos", archivo: "../docs/CuentosAlhambra.pdf" },
    { titulo: "Cuentos de miedo", autor: "E.T.A. Hoffmann", categoria: "Terror", archivo: "../docs/CuentosDeMiedo_Hoffmann.pdf" },
    { titulo: "El cuervo", autor: "Edgar Allan Poe", categoria: "Poesía", archivo: "../docs/Cuervo.pdf" },
    { titulo: "Demetrio Rudin", autor: "Iván Turguéniev", categoria: "Novela", archivo: "../docs/DemetrioRudin.pdf" },
    { titulo: "Demian", autor: "Hermann Hesse", categoria: "Novela", archivo: "../docs/Demian_HermannHesse.pdf" },
    { titulo: "De la Tierra a la Luna", autor: "Julio Verne", categoria: "Ciencia ficción", archivo: "../docs/DeTierraLuna.pdf" },
    { titulo: "Diario de un loco", autor: "Gógol", categoria: "Cuento", archivo: "../docs/DiarioLoco.pdf" },
    { titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", categoria: "Clásico", archivo: "../docs/Don_Quijote_de_la_Mancha-Cervantes_Miguel.pdf" },
    { titulo: "Drácula", autor: "Bram Stoker", categoria: "Terror", archivo: "../docs/Dracula_Stoker.pdf" },
    { titulo: "El banquete", autor: "Platón", categoria: "Filosofía", archivo: "../docs/El_banquete-Platon.pdf" },
    { titulo: "El castillo de los Cárpatos", autor: "Julio Verne", categoria: "Aventura", archivo: "../docs/El_castillo_de_los_Carpatos-Julio_Verne.pdf" },
    { titulo: "El fantasma de Canterville", autor: "Oscar Wilde", categoria: "Cuento", archivo: "../docs/El_fantasma_de_Canterville-Oscar_Wilde.pdf" },
    { titulo: "El retrato de Dorian Gray", autor: "Oscar Wilde", categoria: "Novela", archivo: "../docs/El_retrato_de_dorian_grey.pdf" },
    { titulo: "El color surgido del espacio", autor: "H.P. Lovecraft", categoria: "Terror cósmico", archivo: "../docs/Elcolorsurgidodelespacio.pdf" },
    { titulo: "El eterno Adán", autor: "Julio Verne", categoria: "Ciencia ficción", archivo: "../docs/ElEternoAdan.pdf" },
    { titulo: "El extraño caso de...", autor: "Robert L. Stevenson", categoria: "Misterio", archivo: "../docs/ElExtranoCasoDe.pdf" },
    { titulo: "El fabricante de ataúdes", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/Elfabricantedeataudes.pdf" },
    { titulo: "Los elfos", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/Elfos.pdf" },
    { titulo: "El lobo estepario", autor: "Hermann Hesse", categoria: "Novela", archivo: "../docs/ElLoboEstepario.pdf" },
    { titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "Infantil", archivo: "../docs/ElPrincipito.pdf" },
    { titulo: "Encuentro inesperado", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/EncuentroInesperado.pdf" },
    { titulo: "El entierro prematuro", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/EntierroPrematuro.pdf" },
    { titulo: "Un escándalo en Bohemia", autor: "Arthur Conan Doyle", categoria: "Misterio", archivo: "../docs/EscandaloBohemia_Doyle.pdf" },
    { titulo: "Espanto en las alturas", autor: "Arthur Conan Doyle", categoria: "Misterio", archivo: "../docs/EspantoAlturas_Doyle.pdf" },
    { titulo: "Fedón o del alma", autor: "Platón", categoria: "Filosofía", archivo: "../docs/Fedon_o_del_alma-Platon.pdf" },
    { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", categoria: "Novela", archivo: "../docs/GARCÍA MARQUEZ-Cien años de soledad.pdf" },
    { titulo: "El gato negro", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/GatoNegro.pdf" },
    { titulo: "Gilgamesh", autor: "Anónimo", categoria: "Épico", archivo: "../docs/Gilgamesh.pdf" },
    { titulo: "Un hombre célebre", autor: "Machado de Assis", categoria: "Cuento", archivo: "../docs/HombreCelebre.pdf" },
    { titulo: "El horla", autor: "Guy de Maupassant", categoria: "Terror", archivo: "../docs/Horla.pdf" },
    { titulo: "La Ilíada", autor: "Homero", categoria: "Épico", archivo: "../docs/Iliada.pdf" },
    { titulo: "El jardín de los cerezos", autor: "Chéjov", categoria: "Teatro", archivo: "../docs/JardinCerezos.pdf" },
    { titulo: "El jardinero", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/Jardinero.pdf" },
    { titulo: "Junto al muerto", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/JuntoMuerto.pdf" },
    { titulo: "Katha Upanishad", autor: "Anónimo", categoria: "Filosofía hindú", archivo: "../docs/Katha_Upanishad-Literatura_clasica_hindu.pdf" },
    { titulo: "La divina comedia", autor: "Dante Alighieri", categoria: "Poesía épica", archivo: "../docs/LA DIVINA COMEDIA.pdf" },
    { titulo: "La Odisea", autor: "Homero", categoria: "Épico", archivo: "../docs/La Odisea Homero.pdf" },
    { titulo: "Ligeia", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/Ligeia.pdf" },
    { titulo: "El loco", autor: "Khalil Gibran", categoria: "Filosofía", archivo: "../docs/Loco.pdf" },
    { titulo: "La mano disecada", autor: "Guy de Maupassant", categoria: "Cuento", archivo: "../docs/ManoDisecada.pdf" },
    { titulo: "La mano encantada", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/ManoEncantada.pdf" },
    { titulo: "Markheim", autor: "Robert Louis Stevenson", categoria: "Cuento", archivo: "../docs/Markheim.pdf" },
    { titulo: "Meditaciones", autor: "Marco Aurelio", categoria: "Filosofía", archivo: "../docs/Meditaciones_MarcoAurelio.pdf" },
    { titulo: "Metzengerstein", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/Metzengerstein.pdf" },
    { titulo: "Miedo", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/Miedo.pdf" },
    { titulo: "El misterio de Copper Beeches", autor: "Arthur Conan Doyle", categoria: "Misterio", archivo: "../docs/MisterioCopper_Doyle.pdf" },
    { titulo: "El misterio del valle Boscombe", autor: "Arthur Conan Doyle", categoria: "Misterio", archivo: "../docs/MisterioValleBoscombe_Doyle.pdf" },
    { titulo: "El mortal inmortal", autor: "Mary Shelley", categoria: "Fantasía", archivo: "../docs/Mortal_inmortal-Shelley.pdf" },
    { titulo: "La muerte de Iván Ilich", autor: "León Tolstói", categoria: "Novela", archivo: "../docs/MuerteIvanIlich.pdf" },
    { titulo: "Noches blancas", autor: "Fiódor Dostoyevski", categoria: "Novela", archivo: "../docs/NochesBlancas.pdf" },
    { titulo: "Nube y lluvia", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/NubeLluvia.pdf" },
    { titulo: "Olalla", autor: "Robert L. Stevenson", categoria: "Cuento", archivo: "../docs/Olalla.pdf" },
    { titulo: "Omar y Dilaram", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/OmarDilaram.pdf" },
    { titulo: "El origen del mal", autor: "Desconocido", categoria: "Ensayo", archivo: "../docs/OrigenMal.pdf" },
    { titulo: "Pabellón nº6", autor: "Antón Chéjov", categoria: "Cuento", archivo: "../docs/Pabellon6.pdf" },
    { titulo: "Perspectiva Nevsky", autor: "Gógol", categoria: "Relato", archivo: "../docs/PerspectivaNevsky.pdf" },
    { titulo: "Proceso de un asesinato", autor: "Desconocido", categoria: "Relato", archivo: "../docs/ProcesoAsesinato.pdf" },
    { titulo: "Prometeo encadenado", autor: "Esquilo", categoria: "Tragedia", archivo: "../docs/PrometeoEncadenado.pdf" },
    { titulo: "Quién sabe", autor: "Machado de Assis", categoria: "Cuento", archivo: "../docs/QuienSabe.pdf" },
    { titulo: "La reliquia", autor: "Eça de Queiroz", categoria: "Novela", archivo: "../docs/Reliquia.pdf" },
    { titulo: "El retrato", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/Retrato.pdf" },
    { titulo: "El retrato oval", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/RetratoOval.pdf" },
    { titulo: "La rosa amarilla", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/RosaAmarilla.pdf" },
    { titulo: "El secreto de Augusta", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/SecretoAugusta.pdf" },
    { titulo: "Poemas sepulcrales", autor: "Desconocido", categoria: "Poesía", archivo: "../docs/Sepulcrales.pdf" },
    { titulo: "La serpiente verde", autor: "Goethe", categoria: "Fábula", archivo: "../docs/SerpienteVerde.pdf" },
    { titulo: "Si", autor: "Rudyard Kipling", categoria: "Poesía", archivo: "../docs/Si.pdf" },
    { titulo: "Siddhartha", autor: "Hermann Hesse", categoria: "Filosofía", archivo: "../docs/Siddhartha.pdf" },
    { titulo: "La siesta del fauno", autor: "Stéphane Mallarmé", categoria: "Poesía", archivo: "../docs/SiestaFauno_Mallarme.pdf" },
    { titulo: "El signo de los cuatro", autor: "Arthur Conan Doyle", categoria: "Misterio", archivo: "../docs/SignoCuatro_Doyle.pdf" },
    { titulo: "Los suicidas", autor: "Desconocido", categoria: "Cuento", archivo: "../docs/Suicidas.pdf" },
    { titulo: "Tao Te King", autor: "Lao Tsé", categoria: "Filosofía oriental", archivo: "../docs/TaoTeKing_LaoTse.pdf" },
    { titulo: "Tartarín de Tarascón", autor: "Alphonse Daudet", categoria: "Novela", archivo: "../docs/Tartarin_de_Tarascon-Alphonse_Daudet.pdf" },
    { titulo: "Té verde", autor: "Sheridan Le Fanu", categoria: "Terror", archivo: "../docs/TeVerde.pdf" },
    { titulo: "Textos de Borges", autor: "Jorge Luis Borges", categoria: "Ensayo", archivo: "../docs/Textos-de-Borges.pdf" },
    { titulo: "El tonel de amontillado", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/TonelAmontillado.pdf" },
    { titulo: "Las troyanas", autor: "Eurípides", categoria: "Tragedia", archivo: "../docs/Troyanas.pdf" },
    { titulo: "Una cruza", autor: "Franz Kafka", categoria: "Cuento", archivo: "../docs/Una_cruza-Franz_Kafka.pdf" },
    { titulo: "Una temporada en el infierno", autor: "Arthur Rimbaud", categoria: "Poesía", archivo: "../docs/Una_temporada_en_el_infierno-Arthur_Rimbaud.pdf" },
    { titulo: "La vuelta de tuerca", autor: "Henry James", categoria: "Terror psicológico", archivo: "../docs/VueltaDeTuerca.pdf" },
    { titulo: "William Wilson", autor: "Edgar Allan Poe", categoria: "Terror", archivo: "../docs/WilliamWilson.pdf" },
    { titulo: "Tres cuentos de Las mil noches", autor: "Anónimo", categoria: "Cuentos clásicos", archivo: "../docs/3Cuentos_LasMilNoches.pdf" },
    { titulo: "La metamorfosis", autor: "Franz Kafka", categoria: "Novela", archivo: "../docs/119-2014-02-11-Kafka.La metamorfosis.pdf" },
    { titulo: "1984", autor: "George Orwell", categoria: "Distopía", archivo: "../docs/1984.pdf" },
    { titulo: "Alberto Savaruz", autor: "Honoré de Balzac", categoria: "Novela", archivo: "../docs/Alberto_Savaruz-Honore_de_Balzac.pdf" }
];

// ===================================================
// 🔹 Inserción de libros
// ===================================================
for (const libro of libros) {
  try {
    // Quitar "../" de la ruta
    const rutaLimpia = libro.archivo.replace("../", "");

    // Verificar si ya existe
    const [existe] = await db.execute(
      "SELECT id FROM libros WHERE titulo = ? OR ruta_pdf = ?",
      [libro.titulo, rutaLimpia]
    );

    if (existe.length > 0) {
      console.log(`⚠️ Ya existe: ${libro.titulo}`);
      continue;
    }

    // Insertar el libro
    await db.execute(
      "INSERT INTO libros (titulo, autor, categoria, descripcion, nombre_archivo, ruta_pdf) VALUES (?, ?, ?, ?, ?, ?)",
      [
        libro.titulo,
        libro.autor,
        libro.categoria,
        "Libro importado automáticamente",
        libro.archivo.split("/").pop(), // nombre del PDF
        rutaLimpia
      ]
    );

    console.log(`📚 Insertado: ${libro.titulo}`);
  } catch (err) {
    console.error(`❌ Error con ${libro.titulo}:`, err.message);
  }
}

console.log("✅ Inserción de libros completada.");
await db.end();

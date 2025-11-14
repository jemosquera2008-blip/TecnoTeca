window.addEventListener("load", () => {
  const formLogin = document.getElementById("formLogin");

  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const correo = document.getElementById("correo").value.trim();
      const contraseña = document.getElementById("contraseña").value.trim();

      if (!correo || !contraseña) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor, ingresa tu correo y contraseña.",
        });
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ correo, contraseña }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Error al iniciar sesión");
        }

        const data = await response.json();

        // ✅ Guardar usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify(data));

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // ✅ Redirigir según el rol
          if (data.rol && data.rol.toUpperCase() === "ADMIN") {
            window.location.href = "../admin/principaladmin.html";
          } else {
            window.location.href = "../user/principalusu.html";
          }
        });
      } catch (error) {
        console.error("Error al iniciar sesión:", error);

        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: error.message || "Credenciales inválidas",
        });
      }
    });
  }
});

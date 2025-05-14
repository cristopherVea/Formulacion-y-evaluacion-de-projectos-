<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <img src="C:\Users\veacr\OneDrive\Documentos\Paginas web\proyectobackendfrontent\vue-project\src\assets\20250512_1735_Unión Ciudadanos y Legisladores_simple_compose_01jv3h04hveava1x5sxc1wg337 (1).png" alt="Personas dándose la mano" class="welcome-image">
      <h1>¡Bienvenidos a LegisConnect!</h1>
      <p>
        El espíritu de nuestra plataforma: conectar a ciudadanos y legisladores para construir una democracia más fuerte y participativa.
      </p>
      <p>
        LegisConnect está diseñada para empoderarte y dar voz a tus opiniones en el proceso legislativo. Nuestro objetivo es fomentar la colaboración, aumentar la transparencia y asegurar que tus inquietudes estén en el centro de la toma de decisiones.
      </p>
      <div class="features">
        <p>Aquí puedes:</p>
        <ul>
          <li>Compartir tus ideas y proponer nuevas leyes.</li>
          <li>Participar en debates y discusiones significativas.</li>
          <li>Seguir el progreso de las iniciativas y mantenerte informado sobre las acciones de tus representantes.</li>
        </ul>
      </div>
      <p>
        Así como se ve en este momento de conexión, LegisConnect está comprometida con acortar la distancia entre la comunidad y quienes la sirven. Te invitamos a unirte a nosotros y convertirte en un participante activo en la construcción del futuro de nuestra sociedad.
      </p>
      <p>
        Trabajemos juntos para construir un gobierno más conectado y receptivo. ¡Tu participación hace la diferencia!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeScreen',
  data() {
    return {};
  }
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  font-family: sans-serif;
}

.welcome-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  /* Make the card wider  */
  width: 90%;          /* Increased width  */
  max-width: 900px;   /* Increased max-width  */
  text-align: center;
}

.welcome-image {
  width: 100%;
  max-height: 350px;  /* Slightly increased max-height for aspect ratio  */
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}

.features {
  text-align: left;
  margin-bottom: 20px;
}

.features ul {
  list-style-type: disc;
  padding-left: 20px;
}

.features li {
  margin-bottom: 5px;
}
</style>
<template>
    <div class="home-container">
      <img :src="imagePath" alt="Welcome Image" class="welcome-image">
      <div class="welcome-text">
        <h1>Bienvenido a LegisConnect</h1>
        <p>
          Tu plataforma para la participación ciudadana y la transparencia legislativa.
          Conéctate con tus representantes, comparte tus ideas y sigue el progreso de las leyes.
        </p>
        <div class="button-container">
          <button @click="goToLogin">Iniciar Sesión</button>
          <button @click="goToRegister">Registrarse</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        imagePath: require('../assets/bache.jpeg') // Dynamically import the image
      };
    },
    methods: {
      goToLogin() {
        this.$router.push('/login'); // Replace '/login' with your actual login route
      },
      goToRegister() {
        this.$router.push('/register'); // Replace '/register' with your actual registration route
      }
    }
  };
  </script>
  
  <style scoped>
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0; /* Light grey background */
  }
  
  .welcome-image {
    max-width: 500px; /* Adjust as needed */
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  }
  
  .welcome-text {
    text-align: center;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
  }
  
  h1 {
    font-size: 2.5em;
    margin-bottom: 15px;
    color: #333; /* Dark grey heading */
  }
  
  p {
    font-size: 1.1em;
    color: #666; /* Medium grey text */
    margin-bottom: 20px;
  }
  
  .button-container {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  button {
    padding: 12px 24px;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:nth-child(1) {
    background-color: #007bff; /* Blue for login */
    color: white;
  }
  
  button:nth-child(1):hover {
    background-color: #0056b3;
  }
  
  button:nth-child(2) {
    background-color: #28a745; /* Green for register */
    color: white;
  }
  
  button:nth-child(2):hover {
    background-color: #1e7e34;
  }
  </style>
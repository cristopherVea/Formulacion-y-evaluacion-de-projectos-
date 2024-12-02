<template>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-2">
            <v-card-title class="text-center pt-6">
              <span class="text-h5">Sistema Escolar</span>
            </v-card-title>
  
            <v-card-text class="text-center pt-4">
              <p class="text-body-1 mb-4">Inicia sesión para continuar</p>
  
              <!-- Logo o Imagen -->
              <div class="mb-8">
                <v-icon
                  size="96"
                  color="primary"
                  class="mb-4"
                >
                  mdi-school
                </v-icon>
              </div>
  
              <!-- Botón de Google -->
              <v-btn
                block
                color="white"
                variant="elevated"
                class="mb-4"
                @click="handleGoogleLogin"
                :loading="loading"
              >
                <v-icon
                  start
                  color="error"
                  class="mr-2"
                >
                  mdi-google
                </v-icon>
                Continuar con Google
              </v-btn>
  
              <v-divider class="my-4">
                <span class="text-body-2 text-medium-emphasis">O</span>
              </v-divider>
  
              <!-- Login con email -->
              <v-form @submit.prevent="handleEmailLogin">
                <v-text-field
                  v-model="email"
                  label="Correo electrónico"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-email-outline"
                  class="mb-2"
                ></v-text-field>
  
                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  class="mb-4"
                ></v-text-field>
  
                <v-btn
                  block
                  color="primary"
                  size="large"
                  type="submit"
                  :loading="loading"
                >
                  Iniciar Sesión
                </v-btn>
              </v-form>
            </v-card-text>
  
            <v-card-text class="text-center pb-4">
              <v-btn
                variant="text"
                color="primary"
                class="text-body-2"
                @click="forgotPassword"
              >
                ¿Olvidaste tu contraseña?
              </v-btn>
            </v-card-text>
          </v-card>
  
          <!-- Snackbar para mensajes -->
          <v-snackbar
            v-model="showSnackbar"
            :color="snackbarColor"
            timeout="3000"
            location="top"
          >
            {{ snackbarText }}
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Estados
  const loading = ref(false)
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const showSnackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref('success')
  
  // Métodos
  const handleGoogleLogin = async () => {
    loading.value = true
    try {
      // Aquí iría la lógica real de autenticación con Google
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular carga
      router.push('/dashboard/estudiantes')
    } catch (error) {
      snackbarColor.value = 'error'
      snackbarText.value = 'Error al iniciar sesión con Google'
      showSnackbar.value = true
    } finally {
      loading.value = false
    }
  }
  
  const handleEmailLogin = async () => {
    if (!email.value || !password.value) {
      snackbarColor.value = 'error'
      snackbarText.value = 'Por favor complete todos los campos'
      showSnackbar.value = true
      return
    }
  
    loading.value = true
    try {
      // Aquí iría la lógica real de login con email
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular carga
      router.push('/dashboard/estudiantes')
    } catch (error) {
      snackbarColor.value = 'error'
      snackbarText.value = 'Error en las credenciales'
      showSnackbar.value = true
    } finally {
      loading.value = false
    }
  }
  
  const forgotPassword = () => {
    snackbarColor.value = 'info'
    snackbarText.value = 'Función no disponible en este momento'
    showSnackbar.value = true
  }
  </script>
  
  <style scoped>
  .v-btn {
    text-transform: none !important;
  }
  </style>
<template>
    <div>
      <h1 class="text-center my-4">Publicaciones de LegisConnect</h1>
      
      <!-- Listado de posts -->
      <div v-if="loading" class="text-center my-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-2">Cargando publicaciones...</p>
      </div>
      
      <div v-else-if="posts.length === 0" class="text-center my-4">
        <p>No hay publicaciones disponibles</p>
      </div>
      
      <v-container>
        <v-row>
          <v-col cols="12" md="8" offset-md="2">
            <PostItem 
              v-for="post in posts" 
              :key="post.id" 
              :post="post" 
              @update-post="updatePost"
              class="mb-4"
            />
          </v-col>
        </v-row>
      </v-container>
      
      <!-- Snackbar para mensajes -->
      <v-snackbar v-model="snackbar" :timeout="3000">
        {{ snackbarMessage }}
        <template v-slot:actions>
          <v-btn color="white" text @click="snackbar = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script>
  import PostItem from '@/components/PostItem.vue';
  import axios from 'axios';
  // Importar las imágenes usando importaciones ES6
  import usuarioImg from '@/assets/usuario.jpg';
  import bacheImg from '@/assets/bache.jpeg';
  
  export default {
    name: 'PostsList',
    
    components: {
      PostItem
    },
    
    data() {
      return {
        posts: [],
        loading: true,
        snackbar: false,
        snackbarMessage: '',
        // Guardar las imágenes importadas para usarlas en los métodos
        images: {
          usuario: usuarioImg,
          bache: bacheImg
        }
      };
    },
    
    created() {
      this.loadPosts();
      
      // Escuchar el evento de nueva publicación desde el DashboardLayout
      window.addEventListener('new-post', (event) => {
        if (event.detail) {
          this.addPost(event.detail);
        }
      });
    },
    
    beforeUnmount() {
      // Eliminar el event listener cuando el componente se desmonta
      window.removeEventListener('new-post', this.addPost);
    },
    
    methods: {
      async loadPosts() {
        try {
          this.loading = true;
          // Si aún no tienes el backend listo, usa datos de ejemplo
          if (true) { // Cambiar a process.env.NODE_ENV === 'development' cuando esté listo
            // Datos de ejemplo para desarrollo
            setTimeout(() => {
              this.posts = [
                {
                  id: 1,
                  avatar: this.images.usuario, // Usar imagen importada
                  username: "Christopher Vea",
                  timestamp: new Date().toISOString(),
                  postText: "(Propuesta) La presente ley tiene como finalidad garantizar la seguridad vial mediante el mantenimiento adecuado de las vías públicas.",
                  postImage: this.images.bache, // Usar imagen importada
                  likes: 19000,
                  comments: 1300,
                  shares: 3300,
                  isLiked: false,
                  isCommentOpen: false
                },
                {
                  id: 2,
                  avatar: this.images.usuario, // Usar imagen importada
                  username: "María Rodríguez",
                  timestamp: new Date(Date.now() - 86400000).toISOString(), // Ayer
                  postText: "Ciudadanos comprometidos con el desarrollo vial de nuestra ciudad. #MejoresCalles",
                  postImage: "",
                  likes: 450,
                  comments: 28,
                  shares: 12,
                  isLiked: true,
                  isCommentOpen: false
                }
              ];
              this.loading = false;
            }, 1000);
          } else {
            // Versión con backend real
            const response = await axios.get('/api/posts');
            this.posts = response.data;
            this.loading = false;
          }
        } catch (error) {
          console.error('Error al cargar posts:', error);
          this.showMessage('Error al cargar las publicaciones');
          this.loading = false;
        }
      },
      
      addPost(postData) {
        try {
          // Si estamos en desarrollo, simulamos la creación
          if (true) { // Cambiar a process.env.NODE_ENV === 'development' cuando esté listo
            const newPost = {
              id: Date.now(), // ID simulado
              avatar: this.images.usuario, // Usar imagen importada
              username: "Usuario Actual",
              timestamp: new Date().toISOString(),
              postText: postData.content,
              postImage: postData.images && postData.images.length > 0 ? URL.createObjectURL(postData.images[0]) : "",
              likes: 0,
              comments: 0,
              shares: 0,
              isLiked: false,
              isCommentOpen: false
            };
            
            // Añadir el nuevo post al principio de la lista
            this.posts.unshift(newPost);
            this.showMessage('Publicación creada con éxito');
          } else {
            // Versión con backend real - implementar cuando esté listo
          }
        } catch (error) {
          console.error('Error al crear post:', error);
          this.showMessage('Error al crear la publicación');
        }
      },
      
      updatePost(updatedPost) {
        const index = this.posts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
      },
      
      showMessage(message) {
        this.snackbarMessage = message;
        this.snackbar = true;
      }
    }
  };
  </script>
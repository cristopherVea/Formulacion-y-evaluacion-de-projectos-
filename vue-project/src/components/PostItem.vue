<template>
    <v-card
      class="mx-auto"
      max-width="600"
      style="background-color: #36393f; color: white;"
    >
      <v-list-item>
        <v-list-item-avatar size="24" style="float: left;">
          <img
            :src="post.avatar"
            alt="Avatar"
            style="width: 40%; height: 40%; object-fit: cover; display: block;"
          />
        </v-list-item-avatar>
        <div style="float: left; margin-left: -100px;">
          <v-list-item-title class="font-weight-bold" style="font-size: 14px;">
            {{ post.username }}
          </v-list-item-title>
          <v-list-item-subtitle style="font-size: 10px;">
            {{ formatDate(post.timestamp) }}
          </v-list-item-subtitle>
        </div>
        <v-spacer></v-spacer>
      </v-list-item>
  
      <div style="clear: both;"></div>
  
      <v-divider style="border-color: #424549;"></v-divider>
  
      <v-card-text class="pt-4">
        <p class="mb-4">{{ post.postText }}</p>
        <img v-if="post.postImage" :src="post.postImage" class="post-image rounded" />
      </v-card-text>
  
      <v-divider style="border-color: #424549;"></v-divider>
  
      <v-card-actions class="justify-space-around">
        <v-row no-gutters>
          <v-col cols="4" class="text-center">
            <v-btn
              text
              :color="post.isLiked ? 'primary' : null"
              style="color: white;"
              @click="toggleLike"
            >
              Me gusta
            </v-btn>
          </v-col>
          <v-col cols="4" class="text-center">
            <v-btn text style="color: white;" @click="toggleComment">
              Comentar
            </v-btn>
          </v-col>
          <v-col cols="4" class="text-center">
            <v-btn text style="color: white;" @click="sharePost">Compartir</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
  
      <v-expand-transition>
        <v-card v-if="post.isCommentOpen" class="mt-4" style="background-color: #424549;">
          <v-card-text>
            <v-textarea
              v-model="commentText"
              label="Escribe un comentario..."
              outlined
              style="background-color: white; color: black;"
            ></v-textarea>
            <v-btn color="primary" class="mt-2" @click="submitComment">Publicar</v-btn>
          </v-card-text>
        </v-card>
      </v-expand-transition>
  
      <v-divider style="border-color: #424549;"></v-divider>
  
      <v-card-text class="text-center">
        <span class="mr-2">{{ formatCount(post.likes) }} Me gusta</span>
        <span class="mr-2">{{ formatCount(post.comments) }} comentarios</span>
        <span>{{ formatCount(post.shares) }} veces compartido</span>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    
    data() {
      return {
        commentText: ''
      };
    },
    
    methods: {
      formatDate(dateString) {
        if (!dateString) return '';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
      },
      
      formatCount(count) {
        if (!count && count !== 0) return '0';
        
        if (typeof count === 'string') {
          return count; // Si ya es string formateado, devolverlo como está
        }
        
        if (count >= 1000000) {
          return (count / 1000000).toFixed(1) + ' M';
        } else if (count >= 1000) {
          return (count / 1000).toFixed(1) + ' mil';
        }
        return count.toString();
      },
      
      async toggleLike() {
        try {
          // Versión local sin llamar al backend
          this.$emit('update-post', {
            ...this.post, 
            isLiked: !this.post.isLiked,
            likes: this.post.isLiked 
              ? Math.max(0, (typeof this.post.likes === 'number' ? this.post.likes : 0) - 1)
              : (typeof this.post.likes === 'number' ? this.post.likes : 0) + 1
          });
          
          // Versión con backend - descomentar cuando esté listo el backend
          /*
          const endpoint = this.post.isLiked 
            ? `/api/posts/${this.post.id}/unlike` 
            : `/api/posts/${this.post.id}/like`;
            
          const response = await axios.post(endpoint);
          this.$emit('update-post', {...this.post, ...response.data});
          */
        } catch (error) {
          console.error('Error al cambiar estado de like:', error);
        }
      },
      
      async toggleComment() {
        try {
          // Versión local sin llamar al backend
          this.$emit('update-post', {...this.post, isCommentOpen: !this.post.isCommentOpen});
          
          // Versión con backend - descomentar cuando esté listo el backend
          /*
          const response = await axios.post(`/api/posts/${this.post.id}/toggle-comments`);
          this.$emit('update-post', {...this.post, ...response.data});
          */
        } catch (error) {
          console.error('Error al cambiar estado de comentarios:', error);
        }
      },
      
      async sharePost() {
        try {
          // Incrementar contador de compartidos localmente
          const updatedPost = {
            ...this.post,
            shares: typeof this.post.shares === 'number' ? this.post.shares + 1 : 1
          };
          
          this.$emit('update-post', updatedPost);
          
          // Versión con backend - descomentar cuando esté listo el backend
          /*
          const response = await axios.post(`/api/posts/${this.post.id}/share`);
          this.$emit('update-post', {...this.post, ...response.data});
          */
        } catch (error) {
          console.error('Error al compartir post:', error);
        }
      },
      
      async submitComment() {
        if (!this.commentText.trim()) return;
        
        try {
          // Incrementar contador de comentarios localmente
          const updatedPost = {
            ...this.post,
            comments: typeof this.post.comments === 'number' ? this.post.comments + 1 : 1
          };
          
          this.$emit('update-post', updatedPost);
          
          // Limpiar el campo de comentario
          this.commentText = '';
        } catch (error) {
          console.error('Error al enviar comentario:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .post-image {
    width: 100%;
    height: auto;
  }
  </style>
<template>
  <v-card
    class="mx-auto"
    max-width="600"
    style="background-color: #36393f; color: white;"
  >
    <v-list-item>
      <v-list-item-avatar size="24" style="float: left;">
        <img
          :src="avatar"
          alt="Avatar"
          style="width: 40%; height: 40%; object-fit: cover; display: block;"
        />
      </v-list-item-avatar>
      <div style="float: left; margin-left: -100px;">
        <v-list-item-title class="font-weight-bold" style="font-size: 14px;">
          {{ username }}
        </v-list-item-title>
        <v-list-item-subtitle style="font-size: 10px;">
          {{ timestamp }}
        </v-list-item-subtitle>
      </div>
      <v-spacer></v-spacer>
    </v-list-item>

    <div style="clear: both;"></div>

    <v-divider style="border-color: #424549;"></v-divider>

    <v-card-text class="pt-4">
      <p class="mb-4">{{ postText }}</p>
      <img :src="postImage" class="post-image rounded" />
    </v-card-text>

    <v-divider style="border-color: #424549;"></v-divider>

    <v-card-actions class="justify-space-around">
      <v-row no-gutters>
        <v-col cols="4" class="text-center">
          <v-btn
            text
            :color="isLiked ? 'primary' : null"
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
          <v-btn text style="color: white;">Compartir</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>

    <v-expand-transition>
      <v-card v-if="isCommentOpen" class="mt-4" style="background-color: #424549;">
        <v-card-text>
          <v-textarea
            label="Escribe un comentario..."
            outlined
            style="background-color: white; color: black;"
          ></v-textarea>
          <v-btn color="primary" class="mt-2">Publicar</v-btn>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <v-divider style="border-color: #424549;"></v-divider>

    <v-card-text class="text-center">
      <span class="mr-2">{{ likes }}</span>
      <span class="mr-2">{{ comments }}</span>
      <span>{{ shares }}</span>
    </v-card-text>

    <div v-for="(newPost, index) in newPosts" :key="index" class="mt-4">
      <v-card style="background-color: #36393f; color: white;">
        <v-card-text>
          <p>{{ newPost.content }}</p>
          <img v-for="(image, imageIndex) in newPost.images" :key="imageIndex" :src="URL.createObjectURL(image)" style="max-width: 100%; height: auto;" />
        </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import bacheImage from "@/assets/bache.jpeg";
import otraImagen from "@/assets/usuario.jpg";

export default {
  data() {
    return {
      avatar: otraImagen,
      username: "Christopher Vea",
      timestamp: "27 de marzo de 2018",
      postText:
        "(Propuesta) La presente ley tiene como finalidad garantizar la seguridad vial mediante el mantenimiento adecuado de las vías públicas, la prevención de accidentes ocasionados por el mal estado de las calles y la sanción de omisiones en el cumplimiento de estas disposiciones.",
      postImage: bacheImage,
      likes: "19 mil",
      comments: "1.3 mil comentarios",
      shares: "3.3 mil veces compartido",
      isLiked: false,
      isCommentOpen: false,
      newPosts: [], // Array para almacenar las nuevas publicaciones
    };
  },
  methods: {
    toggleLike() {
      this.isLiked = !this.isLiked;
    },

    toggleComment() {
      this.isCommentOpen = !this.isCommentOpen;
    },
    addNewPost(post) {
      this.newPosts.push(post);
    },
  },
};
</script>

<style scoped>
.post-image {
  width: 100%;
  height: auto;
}
</style>
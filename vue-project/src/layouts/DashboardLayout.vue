<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :to="`/dashboard/${item.route}`"
        link
      >
        <template v-slot:prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar app>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>LegisConnect</v-toolbar-title>
    <v-btn color="red" text class="white--text" @click="openDialog">
      Nueva publicación
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>

  <v-main>
    <router-view></router-view>
  </v-main>

  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title>Nueva Publicación</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="newPost.content"
          label="Contenido"
          outlined
          auto-grow
        ></v-textarea>
        <v-file-input
          v-model="newPost.images"
          label="Agregar fotos"
          multiple
          accept="image/*"
        ></v-file-input>
        <div>
          <v-btn @click="addEmoji">Emojis</v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="savePost">Publicar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'DashboardLayout',
  
  setup() {
    const router = useRouter();
    
    return {
      router
    };
  },
  
  data() {
    return {
      drawer: true,
      menuItems: [
        { title: 'Home', icon: 'mdi-home', route: 'estudiantes' },
        { title: 'Publicaciones', icon: 'mdi-post', route: 'posts' }, // Nueva ruta
        { title: 'Comunidades', icon: 'mdi-account-group', route: 'Cursos' },
        { title: 'Legistadores', icon: 'mdi-account-tie', route: 'Profesores' },
      ],
      dialog: false,
      newPost: { content: '', images: [] },
    };
  },
  
  methods: {
    logout() {
      this.router.push('/');
    },
    
    openDialog() {
      this.dialog = true;
    },
    
    closeDialog() {
      this.dialog = false;
      this.newPost = { content: '', images: [] };
    },
    
    savePost() {
      if (this.newPost.content.trim() !== '') {
        // Emitir evento para que lo escuche PostsList
        window.dispatchEvent(new CustomEvent('new-post', { 
          detail: { ...this.newPost }
        }));
        
        // Si estamos en una ruta diferente, navegar a la lista de posts
        if (this.router.currentRoute.value.name !== 'posts') {
          this.router.push({ name: 'posts' });
        }
        
        this.closeDialog();
      }
    },
    
    addEmoji() {
      console.log("abrir selector de emojis");
    }
  }
});
</script>
<template>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
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
      <v-toolbar-title>Sistema Escolar</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
  
    <v-main>
      <router-view></router-view>
    </v-main>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const drawer = ref(true)
  const menuItems = ref([
    { title: 'Estudiantes', icon: 'mdi-account-multiple', route: 'estudiantes' },
    { title: 'Profesores', icon: 'mdi-account-tie', route: 'profesores' },
    { title: 'Cursos', icon: 'mdi-book-open-variant', route: 'cursos' }
  ])
  
  const logout = () => {
    // Aquí iría la lógica de logout
    router.push('/')
  }
  </script>
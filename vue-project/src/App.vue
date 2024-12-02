<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script setup>
// No necesita lógica adicional
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
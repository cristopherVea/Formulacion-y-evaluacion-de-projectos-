<template>
    <svg-icon type="mdi" :path="path"></svg-icon>
  </template>
  
  <script>
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiHome } from '@mdi/js';
  
  export default {
    name: "MyComponent",
    components: {
      SvgIcon
    },
    data() {
      return {
        path: mdiHome,
      }
    }
  }
  </script>
<template>
  <div id="app">
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchUser()
  authStore.listenToAuthChanges()
})
</script>

<style>
#app {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f1eb;
  min-height: 100vh;
  margin: 0;
}
html, body, #app {
  margin: 0;
  padding: 0;
  background-color: #d7ccc8; 
}
</style>

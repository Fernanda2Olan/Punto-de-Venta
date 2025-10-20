<template>
  <div class="auth-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Correo" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit" :disabled="store.loading">Entrar</button>
    </form>
    <p>{{ store.error }}</p>
    <router-link to="/register">Crear cuenta</router-link> |
    <router-link to="/reset">¿Olvidaste tu contraseña?</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'


const email = ref('')
const password = ref('')
const store = useUserStore()
const router = useRouter()

const handleLogin = async () => {
  const { error } = await store.login(email.value, password.value)
  if (!error) router.push('/pos')
}
</script>

<style scoped>
.auth-container {
  max-width: 350px;
  margin: 100px auto;
  text-align: center;
}
input, button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}
button {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
}
</style>
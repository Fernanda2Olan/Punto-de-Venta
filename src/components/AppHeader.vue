<template>
  <header class="app-header">
    <div class="header-content">
      <h1>Punto de Venta - Restaurante LA TROJE</h1>

      <div class="user-info">
        <!-- Si está autenticado -->
        <template v-if="authStore.isAuthenticated">
          <span class="user-name">{{ authStore.user.email }}</span>
          <button @click="handleLogout" class="logout-button">
            Cerrar Sesión
          </button>
        </template>

        <!-- Si NO está autenticado -->
        <template v-else>
          <router-link to="/login" class="login-button">
            Iniciar Sesión
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.signOut()  // limpia la sesión
  router.push('/login')      // redirige al login
}
</script>

<style scoped>
.app-header {
  background: #5d4037; 
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  padding: 20px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
 
  color: #bb9457;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-weight: 600;
  color: #333;
}

.logout-button {
  padding: 8px 16px;
  background: #8d6e63;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.logout-button:hover {
  background: #6d4c41;
}

/* Botón de login si no hay sesión */
.login-button {
  padding: 8px 16px;
  background: #8d6e63;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.3s;
}

.login-button:hover {
  background: #6d4c41;
}
</style>

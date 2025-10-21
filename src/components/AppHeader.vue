<template>
  <header class="app-header">
    <div class="header-content">
      <h1>Punto de Venta - Restaurante La Troje</h1>

      <div v-if="authStore.isAuthenticated" class="user-info">
        <span class="user-name">{{ authStore.user?.email }}</span>
        <span class="user-role" :class="`role-${authStore.userRole}`">
          {{ roleLabel }}
        </span>
        <button @click="handleLogout" class="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div v-else>
        <button @click="goLogin" class="login-button">
          Iniciar Sesión
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Mostrar el rol traducido
const roleLabel = computed(() => {
  const roles = {
    admin: 'Administrador',
    user: 'Empleado',
    cashier: 'Cajero'
  }
  return roles[authStore.userRole] || 'Invitado'
})

// Cerrar sesión
const handleLogout = async () => {
  await authStore.signOut()
  router.push('/login')
}

// Ir al login si no hay sesión
const goLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background: #5d4037; /* Café oscuro */
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 24px 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
  color: #d7ccc8; /* Café claro */
  font-size: 22px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-weight: 600;
  color: #fff;
}

.user-role {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-admin {
  background: #8d6e63;
  color: #fff;
}

.role-user,
.role-cashier {
  background: #d7ccc8;
  color: #4e342e;
}

.logout-button,
.login-button {
  padding: 8px 16px;
  background: #8d6e63;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 800;
  transition: background 0.3s;
}

.logout-button:hover,
.login-button:hover {
  background: #6d4c41;
}
</style>

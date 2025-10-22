<template>
  <div class="pos-container">
    <header class="pos-header">
      <h2>Bienvenido, {{ authStore.userName }}</h2>
    </header>

    <nav class="pos-nav">
      <button 
        :class="{ active: currentTab === 'venta' }"
        @click="currentTab = 'venta'"
      >
        Punto de Venta
      </button>
      <button 
        :class="{ active: currentTab === 'alta' }"
        @click="currentTab = 'alta'"
      >
        Alta de Platillos
      </button>
    </nav>

    
    <section class="pos-content">
      <PuntoVenta v-if="currentTab === 'venta'" />
      <AltaPlatillos v-else />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AltaPlatillos from '@/components/AltaPlatillos.vue'
import PuntoVenta from '@/components/PuntoVenta.vue'

const authStore = useAuthStore()
const currentTab = ref('venta')
</script>

<style scoped>
.pos-container {
  padding: 20px;
  background: #f5f1eb;
  min-height: 100vh;
}

.pos-header {
  background: #5d4037;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.pos-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}

.pos-nav {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.pos-nav button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #8d6e63;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.pos-nav button.active {
  background: #4e342e;
}

.pos-content {
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
</style>

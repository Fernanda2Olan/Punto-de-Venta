<template>
  <div class="venta-container">
    <div class="menu">
      <h2>Menú de Platillos</h2>

      <p v-if="loading">Cargando platillos...</p>

      <div v-else class="platillos-grid">
        <div v-for="p in platillos" :key="p.id" class="platillo-card">
          <img :src="p.imagen_url" :alt="p.nombre" />
          <h4>{{ p.nombre }}</h4>
          <p class="precio">${{ p.precio }}</p>
          <button @click="agregarAlTicket(p)">Agregar</button>
        </div>
      </div>
    </div>

    <div class="ticket">
      <h3>Ticket actual</h3>

      <div v-if="ticket.length === 0" class="ticket-vacio">
        No hay productos seleccionados.
      </div>

      <ul v-else>
        <li v-for="(item, index) in ticket" :key="index">
          <span>{{ item.nombre }}</span>
          <span>${{ item.precio }}</span>
          <button class="remove" @click="eliminarDelTicket(index)">✕</button>
        </li>
      </ul>

      <p v-if="ticket.length" class="total">
        <strong>Total: ${{ total }}</strong>
      </p>

      <button
        v-if="ticket.length"
        @click="finalizarCompra"
        class="btn-finalizar"
      >
        Finalizar compra
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/supabase";

const platillos = ref([]);
const ticket = ref([]);
const loading = ref(true);

const fetchPlatillos = async () => {
  const { data, error } = await supabase.from("platillos").select("*");
  if (error) console.error("Error al cargar platillos:", error.message);
  else platillos.value = data;
  loading.value = false;
};

const agregarAlTicket = (p) => ticket.value.push(p);
const eliminarDelTicket = (i) => ticket.value.splice(i, 1);
const total = computed(() =>
  ticket.value.reduce((a, i) => a + Number(i.precio), 0)
);

const finalizarCompra = () => {
  alert(`Compra finalizada por $${total.value}`);
  ticket.value = [];
};

onMounted(fetchPlatillos);
</script>

<style scoped>
.venta-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  background: #f5f1eb;
  padding: 20px;
  min-height: 90vh;
}


.menu {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.menu h2 {
  color: #5d4037;
  margin-bottom: 15px;
}

.platillos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.platillo-card {
  background: #5d4037;
  color: white;
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 220px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
}

.platillo-card:hover {
  transform: scale(1.05);
}

.platillo-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.platillo-card h4 {
  margin: 8px 0 4px;
  font-size: 15px;
  color: #ffcc80;
}

.precio {
  font-weight: bold;
  font-size: 14px;
  color: #ffe0b2;
}

.platillo-card button {
  background: #8d6e63;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 0 0 12px 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.platillo-card button:hover {
  background: #6d4c41;
}


.ticket {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 20px;
  height: fit-content;
}

.ticket h3 {
  color: #5d4037;
  text-align: center;
  margin-bottom: 15px;
}

.ticket-vacio {
  text-align: center;
  color: #777;
  font-style: italic;
}

.ticket ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ticket li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

.remove {
  background: transparent;
  color: #c33;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.total {
  margin-top: 15px;
  text-align: right;
  font-size: 18px;
  color: #5d4037;
}

.btn-finalizar {
  background: #5d4037;
  color: white;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
}

.btn-finalizar:hover {
  background: #3e2723;
}
</style>

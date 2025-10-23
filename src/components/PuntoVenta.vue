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
    <li v-for="item in ticket" :key="item.id">
      <div class="info">
        <span>{{ item.nombre }}</span>
        <div class="acciones">
          <button @click="reducirCantidad(item.id)">−</button>
          <span>{{ item.cantidad }}</span>
          <button @click="agregarAlTicket(item)">+</button>
        </div>
      </div>
      <span class="precio-item">${{ item.precio * item.cantidad }}</span>
      <button class="remove" @click="eliminarDelTicket(item.id)">✕</button>
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
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const platillos = ref([]);
const ticket = ref([]);
const loading = ref(true);

// carga los platillos
const fetchPlatillos = async () => {
  const { data, error } = await supabase.from("platillos").select("*");
  if (error) console.error("Error al cargar platillos:", error.message);
  else platillos.value = data;
  loading.value = false;
};

// carga el carrito del usuario
const fetchCarrito = async () => {
  if (!authStore.user) return;

  const { data, error } = await supabase
    .from("carrito")
    .select(
      `id, cantidad, platillos (id, nombre, precio, imagen_url)`
    )
    .eq("user_id", authStore.user.id);

  if (error) {
    console.error("Error al cargar carrito:", error.message);
  } else {
    ticket.value = data.map((item) => ({
      id: item.platillos.id,
      nombre: item.platillos.nombre,
      precio: item.platillos.precio,
      imagen_url: item.platillos.imagen_url,
      cantidad: item.cantidad,
    }));
  }
};

// añade el platillo o los platllos
const agregarAlTicket = async (platillo) => {
  if (!authStore.user) return alert("Debes iniciar sesión primero");

  const existente = ticket.value.find((p) => p.id === platillo.id);

  if (existente) {
    existente.cantidad++;
    await actualizarCantidad(platillo.id, existente.cantidad);
  } else {
    ticket.value.push({ ...platillo, cantidad: 1 });
    const { error } = await supabase.from("carrito").insert([
      {
        user_id: authStore.user.id,
        platillo_id: platillo.id,
        cantidad: 1,
      },
    ]);
    if (error) console.error("Error al insertar carrito:", error.message);
  }
};

// actualiza la cantidad
const actualizarCantidad = async (platilloId, nuevaCantidad) => {
  const { error } = await supabase
    .from("carrito")
    .update({ cantidad: nuevaCantidad })
    .eq("user_id", authStore.user.id)
    .eq("platillo_id", platilloId);

  if (error) console.error("Error al actualizar cantidad:", error.message);
};

// reduce la cantidad
const reducirCantidad = async (platilloId) => {
  const item = ticket.value.find((p) => p.id === platilloId);
  if (!item) return;

  if (item.cantidad > 1) {
    item.cantidad--;
    await actualizarCantidad(platilloId, item.cantidad);
  } else {
    eliminarDelTicket(platilloId);
  }
};

// elminar platillo
const eliminarDelTicket = async (platilloId) => {
  ticket.value = ticket.value.filter((p) => p.id !== platilloId);

  const { error } = await supabase
    .from("carrito")
    .delete()
    .eq("user_id", authStore.user.id)
    .eq("platillo_id", platilloId);

  if (error) console.error("Error al eliminar:", error.message);
};

// total
const total = computed(() =>
  ticket.value.reduce((a, i) => a + i.precio * i.cantidad, 0)
);

// finaliza compra
// 🔹 Finalizar compra con modal visual
import Swal from "sweetalert2";

const finalizarCompra = async () => {
  if (ticket.value.length === 0)
    return Swal.fire({
      icon: "info",
      title: "Carrito vacío",
      text: "Agrega algún platillo antes de finalizar.",
      confirmButtonColor: "#5d4037",
    });

  const confirmacion = await Swal.fire({
    title: "¿Deseas finalizar la compra?",
    text: `Total a pagar: $${total.value}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, finalizar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#5d4037",
    cancelButtonColor: "#8d6e63",
  });

  if (!confirmacion.isConfirmed) return;

  const { error } = await supabase
    .from("carrito")
    .delete()
    .eq("user_id", authStore.user.id);

  if (error) {
    console.error("Error al finalizar compra:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un problema al finalizar la compra.",
      confirmButtonColor: "#5d4037",
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "¡Compra realizada!",
      text: `Tu pedido fue registrado correctamente. Total pagado: $${total.value}`,
      showConfirmButton: true,
      confirmButtonColor: "#5d4037",
    });
    ticket.value = [];
  }
};

onMounted(async () => {
  await fetchPlatillos();
  await fetchCarrito();
});
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
.ticket li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

.info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.acciones {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.acciones button {
  background: #8d6e63;
  border: none;
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 14px;
}

.acciones button:hover {
  background: #6d4c41;
}

.precio-item {
  font-weight: 600;
  color: #5d4037;
  min-width: 50px;
  text-align: right;
}

</style>

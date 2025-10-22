<template>
  <div class="alta-container">
    <h3>Alta de Platillos</h3>

    <form @submit.prevent="addPlatillo">
      <div class="form-group">
        <label>Nombre</label>
        <input v-model="nombre" required />
      </div>

      <div class="form-group">
        <label>Precio</label>
        <input type="number" v-model="precio" required />
      </div>

      <div class="form-group">
        <label>Descripción</label>
        <textarea v-model="descripcion" required></textarea>
      </div>

      <div class="form-group">
        <label>Imagen (URL)</label>
        <input v-model="imagen_url" />
      </div>

      <button type="submit" class="btn">Guardar Platillo</button>
    </form>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'

const nombre = ref('')
const precio = ref('')
const descripcion = ref('')
const imagen_url = ref('')
const mensaje = ref('')

const addPlatillo = async () => {
  const { error } = await supabase.from('platillos').insert([
    { nombre: nombre.value, precio: precio.value, descripcion: descripcion.value, imagen_url: imagen_url.value }
  ])

  if (error) {
    mensaje.value = 'Error al guardar el platillo'
    console.error(error)
  } else {
    mensaje.value = 'Platillo agregado correctamente'
    nombre.value = precio.value = descripcion.value = imagen_url.value = ''
  }
}
</script>

<style scoped>
.alta-container {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.btn {
  width: 100%;
  background: #8d6e63;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn:hover {
  background: #6d4c41;
}

.mensaje {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}
</style>

<template>
  <div class="reset-page">
    <div class="reset-box">
      <h2>Restablecer contraseña</h2>

      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="password">Nueva contraseña</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            placeholder="Nueva contraseña"
          />
        </div>

        <div class="form-group">
          <label for="confirm">Confirmar contraseña</label>
          <input
            id="confirm"
            type="password"
            v-model="confirmPassword"
            required
            placeholder="Confirma la contraseña"
          />
        </div>

        <button type="submit" class="btn-reset">Actualizar contraseña</button>
      </form>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <p v-if="successMessage" class="extra-links">
        <router-link to="/login">Volver al inicio de sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'

const password = ref('')
const confirmPassword = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const handleUpdate = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  const { error } = await supabase.auth.updateUser({ password: password.value })

  if (error) {
    console.error(error)
    errorMessage.value = 'Ocurrió un error al actualizar la contraseña.'
  } else {
    successMessage.value = 'Tu contraseña se ha actualizado correctamente.'
    password.value = ''
    confirmPassword.value = ''
  }
}
</script>

<style scoped>
.reset-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #d7ccc8;
}

.reset-box {
  background: #5d4037;
  color: white;
  padding: 30px;
  border-radius: 12px;
  width: 320px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
}

.btn-reset {
  width: 100%;
  background: #8d6e63;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-reset:hover {
  background: #a1887f;
}

.error {
  color: #ffccbc;
  margin-top: 10px;
  text-align: center;
}

.success {
  color: #c8e6c9;
  margin-top: 10px;
  text-align: center;
}

.extra-links {
  text-align: center;
  margin-top: 15px;
}

.extra-links a {
  color: #ffcc80;
  text-decoration: none;
}
</style>

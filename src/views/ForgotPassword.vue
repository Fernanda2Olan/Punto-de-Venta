<template>
  <div class="reset-page">
    <div class="reset-box">
      <h2>Recuperar contraseña</h2>

      <form @submit.prevent="handleReset">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            placeholder="Ingresa tu correo"
          />
        </div>

        <button type="submit" class="btn-reset">Enviar enlace</button>

        <p class="extra-links">
          <router-link to="/login">Volver al inicio de sesión</router-link>
        </p>
      </form>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase'

const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const handleReset = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
  redirectTo: window.location.origin + '/reset-confirm'
})

  if (error) {
    errorMessage.value = 'Error al enviar el correo. Verifica tu dirección.'
    console.error(error)
  } else {
    successMessage.value = 'Se ha enviado un enlace a tu correo para restablecer la contraseña.'
    email.value = ''
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

.extra-links {
  text-align: center;
  margin-top: 10px;
}

.extra-links a {
  color: #ffcc80;
  text-decoration: none;
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
</style>

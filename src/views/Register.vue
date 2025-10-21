<template>
  <div class="register-page">
    <div class="register-box">
      <h2>Crear cuenta</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input id="name" type="text" v-model="name" placeholder="Tu nombre" />
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input id="email" type="email" v-model="email" required placeholder="correo@ejemplo.com" />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" type="password" v-model="password" required placeholder="********" />
        </div>

        <div class="form-group">
          <label for="confirm">Confirmar contraseña</label>
          <input id="confirm" type="password" v-model="confirmPassword" required placeholder="********" />
        </div>

        <button type="submit" class="btn-register">Registrarse</button>

        <p class="extra-links">
          ¿Ya tienes cuenta?
          <router-link to="/login">Inicia sesión</router-link>
        </p>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  try {
    await authStore.register(email.value, password.value, name.value)

    successMessage.value = 'Registro exitoso. Redirigiendo al inicio de sesión...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.message || 'Error al registrar usuario.'
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #d7ccc8; /* café claro */
}

.register-box {
  background: #5d4037; /* café oscuro */
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

.btn-register {
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

.btn-register:hover {
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

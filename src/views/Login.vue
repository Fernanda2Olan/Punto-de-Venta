<template>
  <div class="login-page">
    <div class="login-box">
      <h2>Iniciar Sesión</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input type="email" id="email" v-model="email" required/>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" required/>
        </div>

        <button type="submit" class="btn-login">Entrar</button>

        <p class="extra-links">
          ¿No tienes cuenta?
          <router-link to="/register">Regístrate</router-link>
          <br />
          <router-link to="/reset">¿Olvidaste tu contraseña?</router-link>
        </p>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/supabase'


const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')


const handleLogin = async () => {
  errorMessage.value = ''

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMessage.value = 'Correo o contraseña incorrectos.'
    return
  }

  if (data.session) {
  router.push('/pos') 
}
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #d7ccc8; 
}

.login-box {
  background: #5d4037; 
  color: white;
  padding: 30px;
  border-radius: 12px;
  width: 300px;
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
}

.btn-login {
  width: 105%;
  background: #8d6e63;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-login:hover {
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
</style>
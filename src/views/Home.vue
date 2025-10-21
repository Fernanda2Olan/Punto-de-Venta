<template>
  <main>
    <p v-if="!authStore.isAuthenticated" class="welcome-text">
      Bienvenido al sistema de punto de venta. Haz clic en cualquier platillo para iniciar sesión.
    </p>

    <div class="carousel">
      <div 
        v-for="item in menuItems" 
        :key="item.id" 
        class="carousel-card"
        @click="goLogin"
      >
        <img :src="item.image" :alt="item.name" />
        <h3>{{ item.name }}</h3>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goLogin = () => {
  router.push('/login')
}

const menuItems = [
  { id: 1, name: 'Tacos al Pastor', image: 'https://comedera.com/wp-content/uploads/sites/9/2017/08/tacos-al-pastor-receta.jpg?w=1200' },
  { id: 2, name: 'Pizza Margarita', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/5802fab5-fdce-468a-a830-43e8001f5a72/Derivates/c00dc34a-e73d-42f0-a86e-e2fd967d33fe.jpg' },
  { id: 3, name: 'Hamburguesa', image: 'https://bsstatic.mrjack.es/wp-content/uploads/2020/09/hamburguesa-bbq-2.jpg' },
  { id: 4, name: 'Ensalada', image: 'https://imagenes.elpais.com/resizer/v2/3KWQUZHLQFGVRIWYQGO3A5WFD4.jpg?auth=f2d14d8886b49351024920c894e7f4b9f518886e962c654538d191ee37e30bac&width=1200' },
  { id: 5, name: 'Sushi', image: 'https://www.unileverfoodsolutions.com.mx/dam/global-ufs/mcos/NOLA/calcmenu/recipes/MX-recipes/general/sushi-empanizado/main-header.jpg' },
]
</script>

<style scoped>
:root {
  --brown-dark: #5d4037;
  --brown-light: #d7ccc8;
  --brown-accent: #8d6e63;
}

main {
  padding: 20px;
  text-align: center;
  background-color: var(--brown-light);
  min-height: calc(100vh - 80px); 
}

.welcome-text {
  color: var(--brown-dark);
  font-size: 20px;
  margin-bottom: 35px;
}

.carousel {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 10px;
  scroll-behavior: smooth;
}

.carousel::-webkit-scrollbar {
  height: 8px;
}

.carousel::-webkit-scrollbar-thumb {
  background: var(--brown-accent);
  border-radius: 4px;
}

.carousel-card {
  min-width: 350px;
  height: 250px;
  background: var(--brown-accent);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  overflow: hidden;       
}

.carousel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

.carousel-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.carousel-card h3 {
  margin: 0;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

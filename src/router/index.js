import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import Pos from '@/views/Pos.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot', component: ForgotPassword },
  { path: '/reset', component: ResetPassword },
  { path: '/reset-confirm', component: () => import('@/views/ResetConfirm.vue') },
  { path: '/pos', component: Pos },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    await authStore.fetchUser()
  }

  const rutasProtegidas = ['/pos']

  if (rutasProtegidas.includes(to.path) && !authStore.isAuthenticated) {
    next('/login')
  } 

  else if (['/login', '/register'].includes(to.path) && authStore.isAuthenticated) {
    next('/')
  } 
  else {
    next()
  }
})


export default router

import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import Pos from '@/views/Pos.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'


const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot', component: ForgotPassword },
  { path: '/reset', component: ResetPassword },
  { path: '/pos', component: Pos },
  { path: '/reset-confirm', component: () => import('@/views/ResetConfirm.vue') },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

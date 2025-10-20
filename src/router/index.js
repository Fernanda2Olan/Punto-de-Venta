import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import Pos from '@/views/Pos.vue'

const routes = [
  { path: '/', redirect: '/login'},
  { path: '/login', component: Login},  
  { path: 'register', component: Register},
  { path: 'reset', component: ResetPassword},
  { path: '/pos', component: Pos}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

export default router

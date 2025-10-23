import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userName: (state) => state.profile?.nombre || '', 
    userRole: (state) => state.profile?.rol || 'user',
  },

  actions: {

    async fetchUser() {
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user || null

      if (this.user) {
        await this.fetchUserProfile()
      }
    },

    async register(email, password, nombre) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  const user = data.user
  if (!user) throw new Error('No se pudo crear el usuario')


  let rol = 'cliente' 
  if (email === 'al20760686@ite.edu.mx') { 
    rol = 'admin'
  }

  const { error: insertError } = await supabase
    .from('perfiles')
    .insert([{ user_id: user.id, nombre, rol }])

  if (insertError) {
    console.error('Error al insertar perfil:', insertError)
    throw insertError
  }


  this.user = user
  this.profile = { nombre, rol }
},


    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.user = data.user
      await this.fetchUserProfile()
    },

    async fetchUserProfile() {
      if (!this.user) return
      const { data, error } = await supabase
        .from('perfiles')
        .select('nombre, rol')
        .eq('user_id', this.user.id)
        .single()
      if (!error && data) this.profile = data
    },

    async signOut() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        this.user = null
        this.profile = null

        localStorage.clear()
        sessionStorage.clear()

        window.location.href = '/login'
      } catch (err) {
        console.error('Error al cerrar sesión:', err.message)
      }
    },

    listenToAuthChanges() {
      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user || null
        if (this.user) this.fetchUserProfile()
      })
    }
  }
})

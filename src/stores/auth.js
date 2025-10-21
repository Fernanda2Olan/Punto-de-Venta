import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userRole: 'user'
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async fetchUser() {
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user || null
    },

    // 🔹 Registro de usuario + inserción de perfil
    async register(email, password, nombre) {
      // 1️⃣ Crear usuario
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error

      const user = data.user

      // 2️⃣ Crear perfil asociado
      if (user) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            { user_id: user.id, nombre, rol: 'user' }
          ])

        if (insertError) console.error('Error creando perfil:', insertError)
      }

      this.user = user
    },

    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      this.user = data.user
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
    },

    listenToAuthChanges() {
      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user || null
      })
    }
  }
})

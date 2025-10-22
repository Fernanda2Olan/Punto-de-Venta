import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

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
      if (user) {
        const { error: insertError } = await supabase
          .from('perfiles')
          .insert([{ user_id: user.id, nombre, rol: 'user' }])
        if (insertError) console.error(insertError)
      }

      this.user = user
      this.profile = { nombre, rol: 'user' }
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
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    },

    listenToAuthChanges() {
      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user || null
        if (this.user) this.fetchUserProfile()
      })
    }
  }
})

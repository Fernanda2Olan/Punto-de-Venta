import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    async fetchUser() {
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user || null
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
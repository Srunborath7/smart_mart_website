import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    hydrated: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {

    // ✅ SAFE HYDRATION (call anytime, no duplication issues)
    hydrate() {
      if (this.hydrated) return

      const tokenCookie = useCookie<string | null>('token')
      const userCookie = useCookie<any>('user')

      this.token = tokenCookie.value || null
      this.user = userCookie.value || null

      this.hydrated = true
    },

    // ✅ LOGIN
    setAuth(user: any, token: string) {
      const tokenCookie = useCookie<string>('token', {
        maxAge: 60 * 60 * 24 * 7
      })

      const userCookie = useCookie('user', {
        maxAge: 60 * 60 * 24 * 7
      })

      tokenCookie.value = token
      userCookie.value = user

      this.user = user
      this.token = token
    },

    // ✅ LOGOUT
    async logout() {
      const config = useRuntimeConfig()

      try {
        await $fetch('/auth/logout', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include'
        })
      } catch (e) {}

      this.clearAuth()
    },

    // ✅ CLEAR
    clearAuth() {
      const tokenCookie = useCookie('token')
      const userCookie = useCookie('user')

      tokenCookie.value = null
      userCookie.value = null

      this.user = null
      this.token = null
    },

    // ✅ REFRESH TOKEN (SAFE)
    async refreshAccessToken() {
      const config = useRuntimeConfig()

      try {
        const res: any = await $fetch('/auth/refresh-token', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include'
        })

        if (!res?.accessToken) {
          this.clearAuth()
          return null
        }

        const tokenCookie = useCookie('token')
        tokenCookie.value = res.accessToken

        this.token = res.accessToken

        return res.accessToken
      } catch (e) {
        this.clearAuth()
        return null
      }
    }
  }
})
export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'same-origin',

    // ✅ Attach token
    onRequest({ options }) {
      if (auth.token) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
    },

    // ✅ Auto refresh on 401
    async onResponseError({ request, response, options }) {
      if (response.status === 401) {

        const newToken = await auth.refreshAccessToken()

        if (!newToken) {
          auth.clearAuth()
          return Promise.reject(response)
        }

        auth.token = newToken

        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${newToken}`)

        return $fetch(request, {
          ...options,
          baseURL: config.public.apiBase,
          headers
        } as any)
      }
    }
  })

  return api
}
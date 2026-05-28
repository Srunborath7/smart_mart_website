export const useApi = () => {

  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const api = $fetch.create({

    baseURL: config.public.apiBase,

    credentials: 'include',
    onRequest({ options }) {

      auth.hydrate()

      if (auth.token) {

        const headers =
          new Headers(options.headers as HeadersInit)

        headers.set(
          'Authorization',
          `Bearer ${auth.token}`
        )

        options.headers = headers
      }
    },
    async onResponseError({ request, response, options }) {

      if (response.status !== 401) {
        return Promise.reject(response)
      }

      try {
        if (request.toString().includes('/auth/refresh-token')) {
          auth.clearAuth()
          return Promise.reject(response)
        }
        const refreshRes: any = await $fetch('/auth/refresh-token', {
          baseURL: config.public.apiBase,
          method: 'POST',
          credentials: 'include'
        })

        if (!refreshRes?.accessToken) {
          auth.clearAuth()
          return Promise.reject(response)
        }

        auth.token = refreshRes.accessToken

        const headers =
          new Headers(options.headers as HeadersInit)

        headers.set(
          'Authorization',
          `Bearer ${refreshRes.accessToken}`
        )
        return $fetch(request, {

          ...options,
          baseURL: config.public.apiBase,
          credentials: 'include',   
          headers

        } as any)

      } catch (err) {

        auth.clearAuth()

        return Promise.reject(response)
      }
    }
  })

  return api
}
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  await nextTick()
  auth.hydrate()

  if (!auth.token) {
    return navigateTo('/auth/login')
  }
})
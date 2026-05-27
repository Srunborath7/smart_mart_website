<template>
  <div class="container py-4">
    <div v-if="auth.user?.name">
      👤 {{ auth.user.name }}
    </div>
        <button
      @click="auth.logout()"
      style="
        margin-top: 20px;
        padding: 10px 20px;
        background: red;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      "
    >
      Logout (Test)
    </button>
    <h1 >Home Page</h1>
    <p>Welcome to your Nuxt dashboard 🚀</p>
  </div>
</template>

<script setup>
const auth = useAuthStore()
definePageMeta({
  middleware: 'auth'
})
console.log('User:', auth.user)
</script>

<style scoped>
h1 {
  margin-bottom: 10px;
}
</style>
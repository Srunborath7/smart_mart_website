<template>
  <div class="login-page">
    <div class="left-side">
      <div class="overlay">

        <div class="brand">
          <div class="logo">
            <img :src="logo" alt="logo" />
          </div>

          <h1>Smart Mart</h1>

          <p>
            Manage orders, customers, products, and your mart dashboard
            in one modern platform.
          </p>

        </div>

      </div>
    </div>
    <div class="right-side">

      <form class="login-card" @submit.prevent="login">
        <div class="logo-right">
          <img :src="logo" alt="logo" />
        </div>
        <h2>Welcome Back</h2>
        <p class="subtitle">Login to continue to your dashboard</p>

        <div class="form-group">
          <label>Email</label>
          <div class="input-box">
            <input v-model="email" type="email" placeholder="Enter your email" />
          </div>
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="input-box">
            <input v-model="password" type="password" placeholder="Enter your password" />
          </div>
        </div>

        <div class="options">
          <label class="remember">
            <input type="checkbox" v-model="rememberMe" />
            Remember me
          </label>

          <a href="#">Forgot password?</a>
        </div>

        <button class="login-btn" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>

      </form>

    </div>

  </div>
</template>
<script setup>
import logo from "~/assets/images/logo.png"
import Swal from 'sweetalert2'
import { useAuthStore } from "~/stores/auth"
import { useApi } from "~/composables/api/useApi"
definePageMeta({
  layout: 'auth'
})
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const auth = useAuthStore()

const api = useApi()

const login = async () => {

  try {

    loading.value = true

    const res = await api('/auth/login', {

      method: 'POST',
      credentials: 'include',
      body: {
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.value
      }

    })

    auth.setAuth(res.data.user, res.data.token)
    Swal.fire({
      icon: 'success',
      title: 'Login Success',
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1500
    })

    navigateTo('/')

  } catch (error) {

    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: error?.data?.message || 'Invalid credentials'
    })

  } finally {

    loading.value = false

  }

}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

.left-side {
  flex: 1;
  background:
    linear-gradient(rgba(167, 0, 0, 0.88), rgba(167, 0, 0, 0.88)),
    url('~/assets/images/cash_desk.jpg');

  background-size: cover;
  background-position: center;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px;
}

.overlay {
  color: white;
  max-width: 500px;
  text-align: center;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.logo {
  width: 160px;
  height: 160px;

  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);

  border-radius: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: float 3s ease-in-out infinite;
}

.logo img {
  width: 120px;
  height: 120px;
  border-radius: 15px;
}

.logo-right {
  width: 160px;
  height: 160px;
  margin: 0 auto 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);

  border-radius: 25px;

  display: none;
  align-items: center;
  justify-content: center;

  animation: float 3s ease-in-out infinite;
}

.logo-right img {
  border-radius: 15px;
  width: 110px;
  height: 110px;
}

.brand h1 {
  font-size: 42px;
}

.brand p {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
}

.right-side {
  width: 520px;
  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px;

  position: relative;
  overflow: hidden;
}

.right-side::before {
  content: "";
  position: absolute;
  width: 320px;
  height: 320px;

  background: radial-gradient(circle, rgba(167, 0, 0, 0.15), transparent 70%);

  top: 20%;
  left: 50%;
  transform: translateX(-50%);

  filter: blur(40px);

  animation: glow 6s ease-in-out infinite;
}

.login-card {
  width: 100%;
  max-width: 380px;

  background: white;
  border-radius: 18px;

  padding: 30px;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);

  position: relative;
  z-index: 2;

  animation: fadeUp 0.8s ease-out;
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.12);
}

.login-card h2 {
  font-size: 32px;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  font-weight: 600;
  color: #374151;
}

.input-box {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: 0.3s;
}

.input-box:focus-within {
  border-color: #a70000;
  box-shadow: 0 0 0 4px rgba(167, 0, 0, 0.1);
}

.input-box input {
  width: 100%;
  padding: 14px;
  border: none;
  outline: none;
}

.options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  height: 50px;

  background: #a70000;
  color: white;

  border: none;
  border-radius: 12px;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.3s;
}

.login-btn:hover {
  background: #870000;
  transform: translateY(-2px);
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {

  0%,
  100% {
    opacity: 0.6;
    transform: translateX(-50%) translateY(0);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-20px);
  }
}

@media (max-width: 992px) {
  .login-page {
    flex-direction: column;
  }

  .left-side {
    display: none;
  }

  .logo-right {
    display: flex;
  }

  .right-side {
    width: 100%;
    min-height: 100vh;
    padding: 25px;
  }
}

@media (max-width: 500px) {
  .login-card {
    padding: 20px;
  }

  .login-card h2 {
    font-size: 26px;
  }
}
</style>
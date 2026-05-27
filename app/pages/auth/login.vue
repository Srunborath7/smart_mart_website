<template>
  <div class="login-page">
    <div class="left-side">
      <div class="overlay">

        <div class="brand">
          <div class="logo">
            <img
              :src="logo"
              alt="logo"
              class="logo-image"
            >
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

      <form class="login-card">

        <h2>Welcome Back</h2>

        <p class="subtitle">
          Login to continue to your dashboard
        </p>
        <div class="form-group">
          <label>Email</label>

          <div class="input-box">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
            >
          </div>
        </div>
        <div class="form-group">
          <label>Password</label>

          <div class="input-box">
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
            >
          </div>
        </div>
        <div class="options">

          <label class="remember">
            <input type="checkbox" v-model="rememberMe">
            Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit" class="login-btn" @click.prevent="login"  :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>

    </div>

  </div>
</template>

<script setup>
import logo from "~/assets/images/logo.png"
import Swal from 'sweetalert2'
import { useAuthStore} from "~/stores/auth"
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
      credentials: 'same-origin',
      body: {
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.value
      }

    })

    auth.setAuth(res.data.user, res.data.token)
    Swal.fire({
      icon: 'success',
      title: 'Login Success'
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  overflow: hidden;
}

.left-side {
  flex: 1;

  background:
    linear-gradient(
      rgba(167, 0, 0, 0.88),
      rgba(167, 0, 0, 0.88)
    ),
    url('~/assets/images/cash_desk.jpg');

  background-size: cover;
  background-position: center;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px;
}

.overlay {
  width: 100%;
  max-width: 500px;
  color: white;
}

.brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  gap: 20px;
}

.logo {
  width: 170px;
  height: 170px;

  background: rgba(255,255,255,0.15);

  backdrop-filter: blur(10px);

  border-radius: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 10px 30px rgba(0,0,0,0.2);

  animation: float 3s ease-in-out infinite;
}

.logo-image {
  width: 120px;
  height: 120px;
border-radius:10px;
  object-fit: contain;
}

.brand h1 {
  font-size: 48px;
  font-weight: 700;
}

.brand p {
  font-size: 17px;
  line-height: 1.8;
  opacity: 0.95;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.right-side {
  width: 500px;
  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 380px;
}

.login-card h2 {
  font-size: 34px;
  color: #111827;
  margin-bottom: 10px;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 35px;
  line-height: 1.6;
}

/* FORM */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  font-weight: 600;
  color: #374151;
}

/* INPUT */
.input-box {
  border: 1px solid #e5e7eb;

  border-radius: 14px;

  overflow: hidden;

  transition: 0.3s;
}

.input-box:focus-within {
  border-color: #a70000;

  box-shadow: 0 0 0 4px rgba(167, 0, 0, 0.1);
}

.input-box input {
  width: 100%;

  border: none;
  outline: none;

  padding: 15px;

  font-size: 15px;

  background: transparent;
}

.options {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 25px;

  font-size: 14px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #555;
}

.options a {
  color: #a70000;
  text-decoration: none;
  font-weight: 500;
}

.login-btn {
  width: 100%;
  height: 52px;

  border: none;
  border-radius: 14px;

  background: #a70000;
  color: white;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.3s;

  box-shadow: 0 10px 20px rgba(167, 0, 0, 0.2);
}

.login-btn:hover {
  background: #870000;
  transform: translateY(-2px);
}

@media (max-width: 992px) {
  .left-side {
    display: none;
  }

  .right-side {
    width: 100%;
  }
}

@media (max-width: 500px) {
  .right-side {
    padding: 25px;
  }

  .login-card h2 {
    font-size: 28px;
  }
}
</style>
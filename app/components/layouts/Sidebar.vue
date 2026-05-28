<template>
  <div
    v-if="isOpen"
    class="sidebar-overlay"
    @click="isOpen = false"
  ></div>
  <aside :class="['sidebar', { open: isOpen }]">
    <button @click="toggleSidebar" class="close-sidebar">
      <AppIcon name="X" />
    </button>

    <div class="brand">
      <div class="logo">
        <img :src="Logo" alt="logo" />
      </div>

      <div class="brand-content">
        <h2>Smart Mart</h2>
        <span>{{ auth.user?.role }}</span>
      </div>
    </div>

    <!-- Menu -->
    <div class="sidebar-content">

      <nav class="nav">
        <NuxtLink to="/" class="link" @click="closeMobile">
          <AppIcon name="Home" />
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink to="/products" class="link" @click="closeMobile">
          <AppIcon name="Package" />
          <span>Products</span>
        </NuxtLink>

        <NuxtLink to="/categories" class="link" @click="closeMobile">
          <AppIcon name="Grid2X2" />
          <span>Categories</span>
        </NuxtLink>

        <NuxtLink to="/orders" class="link" @click="closeMobile">
          <AppIcon name="ShoppingCart" />
          <span>Orders</span>
        </NuxtLink>

        <NuxtLink to="/users" class="link" @click="closeMobile">
          <AppIcon name="Users" />
          <span>Users</span>
        </NuxtLink>

        <NuxtLink to="/settings" class="link" @click="closeMobile">
          <AppIcon name="Settings" />
          <span>Settings</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="logoutPage()">
          <AppIcon name="LogOut" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  </aside>
</template>

<script setup>
import AppIcon from '../icons/AppIcon.vue'
import Logo from '~/assets/images/logo.png'
import Swal from 'sweetalert2'
const { isOpen, toggleSidebar } = useSidebar()
const auth = useAuthStore()

const closeMobile = () => {
  if (process.client && window.innerWidth <= 768) {
    isOpen.value = false
  }
}

const logoutPage = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out from this account',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#a70000',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel'
  })

  if (result.isConfirmed) {
    auth.logout()

    await Swal.fire({
      icon: 'success',
      title: 'Logged out',
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1200
    })

    navigateTo('/auth/login')
  }
}
</script>

<style scoped>

.sidebar {
  position: fixed;
  top: 60px;
  left: 0;

  width: 260px;
  height: calc(100vh - 60px);

  background: #ffffff;
  border-right: 1px solid #f1f1f1;

  display: flex;
  flex-direction: column;

  padding: 18px;

  overflow: hidden;
  z-index: 1000;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 999;
}
.brand {
  background: linear-gradient(135deg, #a70000, #d10000);
  border-radius: 18px;
  padding: 16px;

  display: flex;
  align-items: center;
  gap: 14px;

  margin-bottom: 22px;

  box-shadow: 0 8px 20px rgba(167, 0, 0, 0.15);
}

.logo {
  width: 55px;
  height: 55px;

  background: rgba(255, 255, 255, 0.15);

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  backdrop-filter: blur(10px);
}

.logo img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.brand-content {
  display: flex;
  flex-direction: column;
}

.brand-content h2 {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.brand-content span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: capitalize;
}

.sidebar-content {
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  overflow: hidden;
}

.nav {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 13px 14px;

  border-radius: 14px;

  text-decoration: none;
  border: 1px solid #a70000;
  color: #444;
  font-weight: 500;
  font-size: 15px;

  transition: all 0.2s ease;
}

.link:hover {
  background: #fff1f1;
  color: #a70000;
  transform: translateX(3px);
}

.router-link-active {
  background: #a70000;
  color: white;

  box-shadow: 0 5px 15px rgba(167, 0, 0, 0.2);
}

.link svg {
  stroke: currentColor;
}

.sidebar-footer {
  padding-top: 20px;
}

.logout-btn {
  width: 100%;

  border: none;
  outline: none;

  background: #fff1f1;
  color: #a70000;
  border: 1px solid #a70000;
  padding: 13px 14px;

  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #a70000;
  color: white;
}

.close-sidebar {
  position: absolute;
  top: 10px;
  right: 14px;

  width: 36px;
  height: 36px;

  border: none;

  border-radius: 12px;

  background: rgba(255, 255, 255, 0.15);
  color: #a70000;

  display: none;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;
}

.close-sidebar:hover {
  background: #a70000;
  color: white;
}

@media (max-width: 768px) {
  .sidebar {
    top: 0;
    left: -100%;

    width: 280px;
    height: 100vh;

    transition: 0.3s ease;
  }

  .sidebar.open {
    left: 0;
  }

  .close-sidebar {
    display: flex;
  }

  .brand {
    margin-top: 35px;
  }
}
</style>
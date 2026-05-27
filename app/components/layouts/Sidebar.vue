<template>
  <!-- OVERLAY -->
  <div v-if="isOpen" class="sidebar-overlay" @click="isOpen = false"></div>

  <aside :class="['sidebar', { open: isOpen }]">

    <button @click="toggleSidebar" class="close-sidebar">
      <AppIcon name="X" />
    </button>

    <div class="brand">
      <div class="logo">
        <img :src="Logo" alt="logo">
      </div>
      <div class="d-flex flex-column p-0 gap-05">
        <div>
          <h2>Smart Mart</h2>
        </div>
        <div>
          <span class="text-muted">{{ auth.user?.role }}</span>
        </div>
      </div>
    </div>

    <nav class="nav">
      <NuxtLink to="/" class="link" @click="closeMobile">
        <AppIcon name="Home" />
        <span>Home</span>
      </NuxtLink>

      <NuxtLink to="/products" class="link" @click="closeMobile">
        <AppIcon name="Package" />
        <span>Products</span>
      </NuxtLink>

      <NuxtLink to="/categories" class="link" @click="closeMobile">
        <AppIcon name="Package" />
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
  </aside>
</template>

<script setup>
import AppIcon from '../icons/AppIcon.vue'
import Logo from '~/assets/images/logo.png'
const { isOpen, toggleSidebar } = useSidebar()
const auth = useAuthStore()
const closeMobile = () => {
  if (process.client && window.innerWidth <= 768) {
    isOpen.value = false
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 60px;
  left: 0;

  width: 250px;
  height: calc(100vh - 60px);

  background: white;
  border-right: 1px solid #eee;

  padding: 20px;
  overflow-y: auto;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.brand {
  background: #fff0f0;
  border-radius: 10px;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.logo {
  width: 50px;
  height: 50px;
  background: #a70000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 18px;
}

.logo img {
  width: 35px;
  height: 35px;
}

.brand h2 {
  font-size: 18px;
  color: #111;
}

.nav {

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link {
  border: 1px solid #a70000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  transition: 0.2s;
  font-weight: 500;
}

.link:hover {
  background: #fff0f0;
  color: #a70000;
}

.router-link-active {
  background: #a70000;
  color: white;
}

.link svg {
  stroke: currentColor;
}

.close-sidebar {
  position: absolute;
  top: 15px;
  right: 15px;

  display: none;
  background: #fff;
  border: 1px solid #eee;
  width: 36px;
  height: 36px;

  border-radius: 10px;
  font-size: 18px;
  padding-top: 5px;
  cursor: pointer;
  text-align: center;
  color: #a70000;
  transition: 0.2s;
}

.close-sidebar:hover {
  background: #a70000;
  color: white;
}

@media (max-width: 768px) {
  .sidebar {
    height: 100vh;
    position: fixed;
    left: -100%;
    top: 0;
    z-index: 1000;
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
  }

  .sidebar.open {
    left: 0;
  }

  .close-sidebar {
    display: block;
  }
}
</style>
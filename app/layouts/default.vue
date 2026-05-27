<script setup lang="ts">
import Header from '~/components/layouts/Header.vue';
import Sidebar from '~/components/layouts/Sidebar.vue';

</script>


<template>
  <div class="layout">
    <!-- Header -->
    <Header />

    <div class="body">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main class="main">
        <slot />
      </main>
    </div>
  </div>
</template>


<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.body {
  display: flex;
  flex: 1;
}

.main {
  width:100%;
  margin-left: 250px; /* same as sidebar width */
  background: #f5f6fa;
  margin-top: 40px;
  height: 100vh;
  overflow-y: auto;
}

/* 📱 Mobile fix */
@media (max-width: 768px) {
  .main{
    margin-left: 0;
  }
  .body {
    flex-direction: column;
  }

}
</style>
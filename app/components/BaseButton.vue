<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, 
  loading: { type: Boolean, default: false },
  size: { type: String, default: '' } 
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn-${variant}`, size ? `btn-${size}` : '']"
    :disabled="loading"
    @click="emit('click')"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
    <slot />
  </button>
</template>
<style scoped>
  @media (max-width: 768px) {
    .btn{
      width:fit-content;
      font-size: 14px;
    }
  }
</style>
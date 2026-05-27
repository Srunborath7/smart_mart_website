<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: String
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" class="modal fade show d-block">

    <!-- BACKDROP -->
    <div class="modal-backdrop fade show" @click="close"></div>

    <!-- MODAL -->
    <div class="modal-dialog modal-dialog-centered">

      <div class="modal-content">

        <!-- HEADER -->
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>

          <button class="btn-close" @click="close"></button>
        </div>

        <!-- BODY -->
        <div class="modal-body">
          <slot />
        </div>

        <!-- FOOTER -->
        <div class="modal-footer">
          <slot name="footer" />
        </div>

      </div>

    </div>
  </div>
</template>
<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}
.modal-dialog {
  position: relative;
  z-index: 10000;
}
</style>
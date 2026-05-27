<template>
  <component :is="icon" :size="size" />
</template>

<script setup>
import * as icons from 'lucide-vue-next'

const props = defineProps({
  name: String,
  size: {
    type: Number,
    default: 20
  }
})

const icon = icons[props.name]
</script>
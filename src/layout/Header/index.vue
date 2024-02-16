<template>
  <header>
    <Tool></Tool>
  </header>
</template>
<script setup lang="ts">
import Tool from '../../components/Tool/index.vue'
</script>

<style scoped lang="scss">
header {
  height: 10vh;
  display: none;
  border-bottom: 2px solid white;
  background: $base-background;
}

@media screen and (min-width: 768px) {
  header {
    display: flex;
  }
}
</style>

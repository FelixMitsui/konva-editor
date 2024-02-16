<template>
  <router-view v-slot="{ Component }">
    <div class="container">
      <component :is="Component" />
    </div>
  </router-view>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.container {
  height: $main-height;
}

@media screen and (min-width: 768px) {
  .container {
    height: 90vh;
  }
}
</style>

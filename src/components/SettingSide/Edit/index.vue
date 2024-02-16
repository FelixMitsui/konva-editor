<template>
  <div class="container">
    <Setting></Setting>
    <i class="fi fi-bs-cross-circle cross" @click="handleHideContent"></i>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import useKonvaStore from '../../../store/modules/konva'
import Setting from '../../Setting/index.vue'
const { konva } = useKonvaStore()
const toggleSettingRef = inject('toggleSettingRef')

const handleHideContent = () => {
  toggleSettingRef.value = null
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  background: white;
  position: fixed;
  top: 75vh;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 500;
  .cross {
    font-size: 20px;
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 500;
  }
}

@media screen and (min-width: 768px) {
  .container {
    position: static;
  }
  .cross {
    display: none;
  }
}
</style>

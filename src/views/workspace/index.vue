<template>
  <el-row class="container">
    <el-col :span="24" :sm="4">
      <Side></Side>
    </el-col>
    <el-col :span="24" :sm="16">
      <div
        id="canvas"
        @contextmenu.prevent="(event) => event.preventDefault()"
      ></div>
    </el-col>
    <el-col :span="24" :sm="4">
      <SettingSide :konva="konva"></SettingSide>
    </el-col>
    <ContextMenu v-show="konva.isMenuVisible" :konva="konva"></ContextMenu>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import useKonvaStore from '@/store/modules/konva'
import ContextMenu from '@/components/ContextMenu/index.vue'
import SettingSide from '@/components/SettingSide/index.vue'
import Side from '@/components/Side/index.vue'

const { konva } = useKonvaStore()

const handleFullScreen = () => {

  if (document.fullscreenElement === null) {
    konva.controller.toggleFullScreen(false)
  }
}
onMounted(() => {
  //初始化Konva對象
  konva.init()

  window.onresize = () => {
    konva.controller.onresize()
  }

  document.addEventListener('fullscreenchange', handleFullScreen)
})
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullScreen)
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
}
#canvas {
  height: 100%;
  width: 100%;
  background: $canvas-background;
  position: relative;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-col {
  padding: 0.2rem;
  &:nth-child(1) {
    order: 2;
    height: 15vh;
  }
  &:nth-child(2) {
    border: 2px solid gray;
    background: $base-background;
    overflow-y: hidden;
    height: 75vh;
    width: 100%;
  }
  &:nth-child(3) {
    height: 10vh;
    border-bottom: 2px solid gray;
  }
}

@media screen and (min-width: 768px) {
  .el-col {
    overflow-x: hidden;
    &:nth-child(1) {
      height: 100%;
      order: 1;
    }
    &:nth-child(2) {
      height: 100%;
      order: 2;
    }
    &:nth-child(3) {
      height: 100%;
      order: 3;
      border-bottom: none;
    }
  }
}
</style>

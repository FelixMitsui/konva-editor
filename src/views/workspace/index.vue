<template>
  <el-row class="container">
    <el-col :xs="24" :sm="7" :md="5">
      <Side></Side>
    </el-col>
    <el-col :xs="24" :sm="17" :md="19">
      <div
        id="canvas"
        @contextmenu.prevent="(event) => event.preventDefault()"
      ></div>
    </el-col>
    <ContextMenu v-show="konva.isMenuVisible" :konva="konva"></ContextMenu>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import useKonvaStore from '@/store/modules/konva'
import ContextMenu from '@/components/ContextMenu/index.vue'
import Side from '@/components/Side/index.vue'

const { konva } = useKonvaStore()

onMounted(() => {
  //初始化Konva對象
  konva.init()
  // window.onresize = () => {
  //   konva.controller.onresize()
  // }
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
#canvas {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 500;
}

.el-col {
  padding: 0.5rem;
  overflow-x: auto;
}
.el-col:nth-child(2) {
  border: 5px solid gray;
  background: $base-background;
  padding: 0.5rem;
  overflow-y: hidden;
  height: 100%;
}

@media screen and (min-width: 768px) {
  .el-col {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>

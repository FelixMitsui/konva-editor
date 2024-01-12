<template>
  <el-row class="container">
    <el-col :xs="24" :sm="7" :md="5">
      <Side :konva="konva"></Side>
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
import useShapeStore from '@/store/modules/shape'
import ContextMenu from '@/components/ContextMenu/index.vue'
import Side from '@/components/Side/index.vue'

const { konva } = useShapeStore()

onMounted(() => {
  //初始化Konva對象
  konva.init()

  window.onresize = () => {
    konva.onresize()
  }
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
}
#canvas {
  margin: 0.5rem;
  border: 2px solid gray;
  background: $canvas-background;
  height: 100%;
  min-height: 485px;
}
.el-col {
  overflow-x: auto;
  height: 100%;
}
.el-col:last-child {
  height: 100%;
}
@media screen and (min-width: 768px) {
  .el-col {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>

<template>
  <div class="side-container">
    <div class="layer-top">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="新增圖層"
        placement="bottom"
      >
        <el-button @click="() => konva.newLayer()">
          <i class="fi fi-sr-square-plus"></i>
        </el-button>
      </el-tooltip>
    </div>
    <div
      v-for="(url, index) in slideshowUrls"
      :key="index"
      class="layer-item"
      :class="{ 'frame-focus': focusRef === index }"
    >
      <img
        style="width: 100%; height: 100%; object-fit: fill"
        :src="url"
        @click="() => handleSwitchSlideshow(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Konva from 'konva'
import useKonvaStore from '@/store/modules/konva'

const focusRef = ref<number>(0)
const { konva, slideshowUrls } = useKonvaStore()
const handleSwitchSlideshow = (index: number) => {
  konva.transf.nodes([])
  slideshowUrls[focusRef.value] =
    konva.slideshows[focusRef.value].layer.toDataURL()
  focusRef.value = index
  konva.controller.switchSlideshow(index)
}

watchEffect(() => {
  if (konva.isUpdateSideLayer) {
    konva.slideshows.forEach((konva: Konva.LabelConfig, index: number) => {
      if (slideshowUrls[index] && focusRef.value !== index) return
      const url = konva.layer.toDataURL()
      slideshowUrls[index] = url
    })
  }
})
</script>

<style scoped lang="scss">
.side-container {
  display: flex;
  .layer-item {
    min-width: 150px;
    height: 100px;
    width: 150px;
    margin: 0.5rem;
    border: 1px solid black;

    &.frame-focus {
      border: 2px solid rgb(0, 137, 235);
    }
  }
  .layer-top {
    margin-bottom: 0.5rem;
    align-self: flex-end;
  }
  &img {
    margin-bottom: 0.5rem;
  }
}
@media screen and (min-width: 768px) {
  .side-container {
    flex-direction: column;
    .layer-item {
      min-width: auto;
      width: auto;
      height: auto;
    }
  }
}
</style>

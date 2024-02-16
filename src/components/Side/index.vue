<template>
  <div class="side-container">
    <div class="layer-top">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="新增圖層"
        placement="bottom"
      >
        <el-button @click="handleAddLayer">
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
  konva.isUpdateSideLayer = false
  konva.currentCanvasIndex = index
  slideshowUrls[focusRef.value] = konva.slideshows[
    focusRef.value
  ].layer.toDataURL({ mimeType: 'image/jpeg', quality: 1, pixelRatio: 2 })
  focusRef.value = index
  konva.controller.switchSlideshow(index)
}
const handleAddLayer = () => {
  konva.isUpdateSideLayer = true
  konva.newLayer()
}
watchEffect(() => {
  if (konva.isUpdateSideLayer) {
    konva.slideshows.forEach((item: Konva.LabelConfig, index: number) => {
      if (slideshowUrls[index] && focusRef.value !== index) return
      item.transf.nodes([])
      const url = item.layer.toDataURL({
        mimeType: 'image/jpeg',
        quality: 1,
        pixelRatio: 2,
      })
      slideshowUrls[index] = url
      if (konva.selectTarget.attrs.type === 'canvas' || undefined) return
      item.transf?.nodes([konva.selectTarget])
    })
  }
})
</script>

<style scoped lang="scss">
.side-container {
  display: flex;
  align-items: center;
  height: 100%;
  .layer-item {
    display: flex;
    margin: 0.2rem;
    width: 25%;
    height: 100%;
    border: 1px solid black;
    &.frame-focus {
      border: 2px solid rgb(0, 137, 235);
    }
  }
  .layer-top {
    margin-bottom: 0.5rem;
    align-self: flex-end;
  }
}
@media screen and (min-width: 768px) {
  .side-container {
    height: 100%;
    margin: 0;
    flex-direction: column;
    .layer-item {
      height: 25%;
      width: 100%;
    }
  }
}
</style>

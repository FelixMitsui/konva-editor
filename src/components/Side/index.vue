<template>
  <div class="side-container">
    <div class="layer-top">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="新增圖層"
        placement="bottom"
      >
        <el-button @click="handleCreateLayer">
          <i class="fi fi-sr-square-plus"></i>
        </el-button>
      </el-tooltip>
    </div>
    <div
      v-for="(slideshow, index) in konva.slideshows"
      :key="index"
      class="layer-item"
      :class="{ 'frame-focus': focusRef === index }"
    >
      <img
        style="width: 100%; height: 100%; object-fit: fill"
        :src="getLayerDataURL(slideshow.layer, index)"
        @click="handleSwitchSlideshow(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Konva from 'konva'
const urls: string[] = []

const focusRef = ref<number>(0)
const { konva } = defineProps(['konva'])

const handleCreateLayer = () => {
  konva.newLayer()
}
const handleSwitchSlideshow = (index: number) => {
  focusRef.value = index
  konva.switchSlideshow(index)
}
const getLayerDataURL = (layer: Konva.Layer, index: number) => {
  let url

  if (konva.isUpdateSideLayer) {
    url = layer.toDataURL()
    urls[index] = url
  }
  return urls[index]
}
</script>

<style scoped lang="scss">
.side-container {
  height: 100%;
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

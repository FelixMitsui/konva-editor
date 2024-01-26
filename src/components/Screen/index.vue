<template>
  <div id="screen" class="container">
    <img :src="screenUrlRef" style="width: 100%; height: 100%" />
  </div>
</template>
<script setup lang="ts">
import { ref, Ref, watchEffect, onMounted, onUnmounted, inject } from 'vue'
import useKonvaStore from '../../store/modules/konva'
const { slideshowUrls } = useKonvaStore()
const screenUrlRef = ref<string>('')
const countRef = ref<number>(0)
const isFullScreen = inject('isFullScreen')
const handleToggleSlideshow = () => {
  if (!(isFullScreen as Ref<boolean>).value) return

  if (slideshowUrls.length > 1 && countRef.value < slideshowUrls.length) {
    screenUrlRef.value = slideshowUrls[countRef.value]
    countRef.value++
  }
}
watchEffect(() => {
  if (slideshowUrls[0]) {
    screenUrlRef.value = slideshowUrls[0]
  }

  if (!isFullScreen.value) {
    countRef.value = 0
  }
})
onMounted(() => {
  document.addEventListener('click', handleToggleSlideshow)
})
onUnmounted(() => {
  document.removeEventListener('click', handleToggleSlideshow)
})
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
img {
  width: 100%;
  height: 100%;
}
</style>

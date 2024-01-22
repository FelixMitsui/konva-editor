<template>
  <div id="screen" class="container">
    <img
      style="width: 100%; height: 100%; object-fit: cover"
      :src="screenRef"
    />
  </div>
</template>
<script setup lang="ts">
import { ref,Ref, watchEffect, onMounted, inject } from 'vue'
import useKonvaStore from '../../store/modules/konva'
const { slideshowUrls } = useKonvaStore()
const screenRef = ref<string>('')
const countRef = ref<number>(0)
const isFullScreen = inject('isFullScreen')
const handleToggleSlideshow = () => {

  if (!(isFullScreen as Ref<boolean>).value) return

  if (slideshowUrls.length > 1 && countRef.value < slideshowUrls.length) {
    screenRef.value = slideshowUrls[countRef.value]
    countRef.value++
  }
}
watchEffect(() => {
  if (slideshowUrls[0]) {
    screenRef.value = slideshowUrls[0]
  }

  if (!isFullScreen.value) {
    countRef.value = 0
  }
})
onMounted(() => {
  document.addEventListener('click', handleToggleSlideshow)
})
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div id="screen" class="container"></div>
</template>
<script setup lang="ts">
import { ref, Ref, inject } from 'vue'
import useKonvaStore from '../../store/modules/konva'
const { slideshowUrls, konva } = useKonvaStore()
const screenUrlRef = ref<string>('')
const countRef = ref<number>(0)
const isFullScreenRef = inject('isFullScreenRef')
const handleToggleSlideshow = () => {
  if (!(isFullScreenRef as Ref<boolean>).value) return

  if (slideshowUrls.length > 1 && countRef.value < slideshowUrls.length) {
    screenUrlRef.value = slideshowUrls[countRef.value]
    countRef.value++
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100cqmax;
  height: 100cqmax;
  #screen {
    width: 100cqmax;
  height: 100cqmax;
  }
}
</style>

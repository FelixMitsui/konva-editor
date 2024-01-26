<template>
  <Screen v-show="isFullScreen"></Screen>
  <Header v-show="!isFullScreen"></Header>
  <Main></Main>
</template>
<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import Header from '../layout/Header/index.vue'
import Main from '../layout/Main/index.vue'
import Screen from '../components/Screen/index.vue'

const isFullScreen = ref<boolean>(false)
provide('isFullScreen', isFullScreen)

const handleScreen = (event) => {
  event.preventDefault()
  const isFull = document.fullscreenElement
  if (isFull === null) {
    isFullScreen.value = !!isFull
  }
}
onMounted(() => {
  document.addEventListener('fullscreenchange', handleScreen)
})
</script>
<style scoped lang="scss"></style>

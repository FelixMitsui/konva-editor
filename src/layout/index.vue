<template>
  <Header v-show="!konva.isScreen"></Header>
  <Main></Main>

</template>
<script setup lang="ts">
import Header from '../layout/Header/index.vue'
import Main from '../layout/Main/index.vue'
import useKonvaStore from '@/store/modules/konva'

const { konva } = useKonvaStore()
</script>
<style scoped lang="scss"></style>

<template>
  <div class="contextMenu">
    <div
      v-for="(item, key) in konva.menuList"
      :key="key"
      class="contextmenu-item"
      :class="item.disabled ? 'disabled' : 'default'"
      @click="konva.controller.pickMenuOption(item.type)"
    >
      {{ item.name }}
    </div>
  </div>
</template>
<script setup lang="ts">
const { konva } = defineProps(['konva'])
</script>
<style scoped lang="scss">
.contextMenu {
  position: fixed;
  background-color: $base-background;
  min-width: 100px;
  font-size: 14px;
  color: $base-color;
  z-index: 1000;

  .contextmenu-item {
    cursor: pointer;
    line-height: 34px;
    text-align: center;
    &.default {
      &:hover {
        background-color: $content-background;
        color: $base-color;
      }
    }
    &.disabled {
      cursor: not-allowed;
      color: $base-color;
    }
    &.disabled {
    }
  }
}
</style>

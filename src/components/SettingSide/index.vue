<template>
  <div class="container">
    <div class="btn-group">
      <div :class="{ active: toggleSettingRef == Edit }">
        <el-button size="small" @click="() => handleToggleSetting(Edit)">
          設計
        </el-button>
      </div>
      <div :class="{ active: toggleSettingRef == Animation }">
        <el-button size="small" @click="() => handleToggleSetting(Animation)">
          動畫
        </el-button>
      </div>
      <!-- <div :class="{ active: toggleSettingRef == Video }">
        <el-button size="small" @click="() => handleToggleSetting(Video)">
          會議
        </el-button>
      </div> -->
    </div>
    <div class="tool">
      <Tool></Tool>
    </div>
    <component :is="toggleSettingRef"></component>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, provide } from 'vue'
import Edit from './Edit/index.vue'
import Animation from './Animation/index.vue'
import Tool from '../Tool/index.vue'
import Video from './Video/index.vue'
const toggleSettingRef = shallowRef< Edit | Animation | Video | null>(Edit)
provide('toggleSettingRef', toggleSettingRef)
const handleToggleSetting = (value: Edit | Animation | Video | null) => {
  toggleSettingRef.value = value
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;

  .btn-group {
    display: flex;
    margin-right: 0.5rem;

    > div {
      padding-right: 0.5rem;
      .el-button {
        padding: 0 0.5rem;
      }
    }
    .active {
      .el-button {
        color: rgb(0, 144, 247);
      }
      border-bottom: 2px solid rgb(0, 144, 247);
    }
  }

  .tool {
    display: flex;
    align-items: center;
  }
}

@media screen and (min-width: 768px) {
  .container {
    flex-direction: column;

    .btn-group {
      overflow-x: auto;
      padding: 0.5rem 0;
      margin-right: 0;
      > div {
        padding-bottom: 0.2rem;
        border-bottom: 2px solid gray;
      }
    }
    .tool {
      display: none;
    }
  }
}
</style>

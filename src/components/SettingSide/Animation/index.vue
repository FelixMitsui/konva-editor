<template>
  <div class="container">
    <el-button @click="() => konva.animation.addTween()">新增動畫</el-button>
    <div class="anim-group">
      <div
        class="anim-item"
        v-for="(item, index) in konva?.slideshows[konva.currentLayerIndex]
          ?.anim"
        :key="index"
      >
        <div class="anim-header">
          <span>{{ item.tween.node.attrs.type }}</span>
          <i
            class="fi fi-bs-cross-circle"
            @click="konva.animation.deleteAnim(index)"
          ></i>
        </div>
        <div class="anim-body">
          <el-select
            v-model="konva.slideshows[konva.currentLayerIndex].anim[index].type"
            class="m-2"
            size="small"
            style="width: 150px"
            @change="
              () =>
                konva.animation.toggleAnimType(
                  konva.slideshows[konva.currentLayerIndex].anim[index].type,
                  index,
                )
            "
          >
            <el-option
              v-for="(option, index) in animOptions"
              :key="index"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <i
            class="fi fi-br-caret-right"
            @click="() => konva.animation.startAnim(item.tween)"
          ></i>
        </div>
      </div>
    </div>
    <i class="fi fi-bs-cross-circle cross" @click="handleHideContent"></i>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { animOptions } from '../../../utils/konva/config'
import useKonvaStore from '../../../store/modules/konva'
const { konva } = useKonvaStore()
const toggleSettingRef = inject('toggleSettingRef')

const handleHideContent = () => {
  toggleSettingRef.value = null
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  position: absolute;
  background: white;
  top: 75vh;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
  .btn-group {
    display: flex;
    flex-direction: column;
    margin-right: 0.5rem;
    padding-right: 0.5rem;
    border-right: 2px solid gray;
    .el-button {
      margin-left: 0;
      padding: 1.5rem 0.5rem;
      writing-mode: vertical-lr;
    }
  }
  .el-button {
    font-weight: 700;
    padding: 1.5rem 0.5rem;
    height: 100%;
    writing-mode: vertical-lr;
  }
  .anim-group {
    margin: 0.5rem;
    display: flex;
    align-items: center;
    .anim-item {
      width: 100%;
      margin: 0.5rem;
      .anim-header {
        margin-bottom: 1em;
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid gray;
        span {
          font-weight: 600;
          margin: 0 0.2rem;
        }
        i {
          color: rgb(235, 60, 95);
        }
      }
      .anim-body {
        display: flex;
        .el-select:deep {
          .el-input__inner {
            font-weight: 600;
          }
        }
      }
    }
  }

  .cross {
    font-size: 20px;
    position: fixed;
    top: 76vh;
    right: 10px;
  }
}

@media screen and (min-width: 768px) {
  .container {
    position: static;
    .el-button {
      padding: 0.5rem 0.5rem;
      margin: 0.5rem;
      writing-mode: horizontal-tb;
    }
  }
  .anim-group {
    flex-direction: column;
    align-items: center;
  }
  .cross {
    display: none;
  }
}
</style>

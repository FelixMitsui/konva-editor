<template>
  <div class="container">
    <div class="tool-content">
      <div class="tool-group">
        <el-tooltip effect="dark" content="文字" placement="bottom">
          <div
            class="tool-item"
            draggable="true"
            @mousedown="handlePickType(TextType.TEXT)"
          >
            <i class="fi fi-rr-text"></i>
          </div>
        </el-tooltip>

        <el-popover
          :width="300"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px;"
        >
          <template #reference>
            <div class="tool-item"><i class="fi fi-br-pattern"></i></div>
          </template>
          <template #default>
            <div class="graph-group">
              <div
                v-for="(graph, key) in graphList"
                :key="key"
                class="graph-item"
                draggable="true"
                @mousedown="handlePickType(graph.type)"
              >
                <i class="iconfont" :class="graph.icon"></i>
              </div>
            </div>
          </template>
        </el-popover>
        <div class="tool-item">
          <label for="videoInput"><i class="fi fi-br-video-plus"></i></label>
          <input
            type="file"
            accept="video/*"
            id="videoInput"
            @click="konva.addVideo"
          />
        </div>
      </div>
      <div class="tool-group">
        <div class="tool-item">
          <el-tooltip effect="dark" content="背景縮放" placement="bottom">
            <el-dropdown
              style="margin: 0 0.5rem"
              ref="zoomRef"
              trigger="contextmenu"
              @command="
                (command: string) => konva.controller.changeZoom(command)
              "
            >
              <i class="fi fi-br-search" @click="zoomRef?.handleOpen()"></i>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="0.5">50%</el-dropdown-item>
                  <el-dropdown-item command="0.75">75%</el-dropdown-item>
                  <el-dropdown-item command="1">100%</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
          <span>{{ konva.zoom * 100 + '%' }}</span>
        </div>
        <div class="tool-item">
          <el-tooltip effect="dark" content="全屏模式" placement="bottom">
            <i
              class="fi fi-br-expand"
              @click="() => handleFullScreen(true)"
            ></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useKonvaStore from '@/store/modules/konva'
import { graphList } from '@/utils/konva/config'
import { DropdownInstance } from 'element-plus'
import { GraphType, TextType } from '@/utils/konva/type'

const { konva } = useKonvaStore()
const zoomRef = ref<DropdownInstance | null>(null)

const handlePickType = (type: GraphType | TextType) => {
  konva.type = type
}

const handleFullScreen = (bool: boolean) => {
  konva.transf?.nodes([])
  konva.controller.toggleFullScreen(bool)
}
</script>

<style scoped lang="scss">
#videoInput {
  display: none;
}
.container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .tool-content {
    display: flex;
    .tool-group {
      width: 100%;
      display: flex;
      align-items: center;
      flex-grow: 1;
      gap: 0.5rem;
      padding: 0 0.5rem;
      border-left: 2px dashed white;
      .tool-item {
        display: flex;
        span {
          font-size: 14px;
        }
      }
    }
    :nth-child(2) {
      justify-content: end;
    }
  }
}

.graph-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .graph-item {
    margin: 0 0.5rem;
  }
}
@media screen and (min-width: 768px) {
  .container {
    color: $base-color;
    i {
      color: $base-color;
    }
  }
}
</style>

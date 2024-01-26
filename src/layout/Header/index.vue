<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12">
        <div class="setting-group">
          <div class="setting-item">
            <span>X軸</span>
            <el-input-number
              v-model="attrs.x"
              :controls="false"
              @change="konva.controller.updatePickAttrs({ x: attrs.x })"
            ></el-input-number>
          </div>
          <div class="setting-item">
            <span>Y軸</span>
            <el-input-number
              v-model="attrs.y"
              :controls="false"
              @change="konva.controller.updatePickAttrs({ y: attrs.y })"
            ></el-input-number>
          </div>
          <div class="setting-item">
            <el-tooltip effect="dark" content="角度" placement="bottom">
              <i class="fi fi-br-angle-90"></i>
            </el-tooltip>
            <el-input-number
              v-model="attrs.rotation"
              :controls="false"
              @change="
                konva.controller.updatePickAttrs({
                  rotation: attrs.rotation,
                  offset: {
                    x: konva.selectTarget.width() / 2,
                    y: konva.selectTarget.height() / 2,
                  },
                })
              "
            ></el-input-number>
          </div>
          <div class="setting-item">
            <span>
              透明度({{ getOpacity(konva.selectTarget.attrs.opacity) }}%)
            </span>
            <el-slider
              v-model="opacityRef"
              size="small"
              :min="0"
              :max="1"
              :step="0.1"
              style="width: 80px"
              @change="
                konva.controller.updatePickAttrs({
                  opacity: opacityRef,
                })
              "
            ></el-slider>
          </div>
          <div class="setting-item">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="填充"
              placement="bottom"
            >
              <i class="fi fi-sr-fill"></i>
            </el-tooltip>
            <el-color-picker
              size="small"
              v-model="konva.selectTarget.attrs.fill"
              @change="
                konva.controller.updatePickAttrs({
                  fill: konva.selectTarget.attrs.fill,
                })
              "
            ></el-color-picker>
          </div>
          <div class="setting-item">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="外框顏色"
              placement="bottom"
            >
              <i class="fi fi-rs-no-people"></i>
            </el-tooltip>
            <el-color-picker
              size="small"
              v-model="konva.selectTarget.attrs.stroke"
              @change="
                konva.controller.updatePickAttrs({
                  stroke: konva.selectTarget.attrs.stroke,
                })
              "
            ></el-color-picker>
          </div>
          <div class="setting-item">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="外框粗度"
              placement="bottom"
            >
              <el-dropdown
                ref="strokeWidthRef"
                trigger="contextmenu"
                style="margin-right: 30px"
                @command="
                  (command: string) =>
                    konva.controller.updatePickAttrs({
                      strokeWidth: Number(command),
                    })
                "
              >
                <i
                  class="fi fi-ss-line-width"
                  @click="strokeWidthRef?.handleOpen()"
                ></i>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="1">1px</el-dropdown-item>
                    <el-dropdown-item command="2">2px</el-dropdown-item>
                    <el-dropdown-item command="3">3px</el-dropdown-item>
                    <el-dropdown-item command="4">4px</el-dropdown-item>
                    <el-dropdown-item command="8">8px</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </div>
        </div>
      </el-col>
      <el-col :span="24" :xs="24" :sm="24" :md="12">
        <div class="text-content">
          <el-select
            v-model="attrs.fontSize"
            style="width: 56px"
            :disabled="!konva.selectTarget.attrs.fontSize"
            class="custom-el-select"
          >
            <el-option
              v-for="(item, index) in fontSizes"
              :key="index"
              :label="item"
              :value="item"
              @click="() => konva.controller.setFontSize(item)"
            />
          </el-select>
          <el-tooltip effect="dark" content="粗體" placement="bottom">
            <div
              :class="{
                selected: konva.selectTarget.attrs.fontStyle?.includes('bold'),
              }"
              class="text-item"
              @click="() => konva.controller.setTextStyle('bold')"
            >
              <i class="fi fi-br-bold"></i>
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="底線" placement="bottom">
            <div
              :class="{
                selected:
                  konva.selectTarget.attrs.textDecoration?.includes(
                    'underline',
                  ),
              }"
              class="text-item"
              @click="() => konva.controller.setTextDecoration('underline')"
            >
              <i class="fi fi-bs-underline"></i>
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="斜體" placement="bottom">
            <div
              :class="{
                selected:
                  konva.selectTarget.attrs.fontStyle?.includes('italic'),
              }"
              class="text-item"
              @click="() => konva.controller.setTextStyle('italic')"
            >
              <i class="fi fi-br-italic"></i>
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="文字定位" placement="bottom">
            <el-dropdown
              style="margin: 0 0.5rem"
              ref="textPositionRef"
              trigger="contextmenu"
              @command="
                (command: string) => konva.controller.setPosition(command)
              "
            >
              <i
                style="color: white"
                class="fi fi-sr-caret-square-down"
                @click="textPositionRef?.handleOpen()"
              ></i>
              <template #dropdown>
                <el-dropdown-menu style="display: flex">
                  <el-dropdown-item command="left">
                    <i
                      :class="{
                        selected: konva.selectTarget.attrs?.align == 'left',
                      }"
                      class="fi fi-rr-align-left"
                    ></i>
                  </el-dropdown-item>
                  <el-dropdown-item command="center">
                    <i
                      :class="{
                        selected: konva.selectTarget.attrs?.align == 'center',
                      }"
                      class="fi fi-rr-align-justify"
                    ></i>
                  </el-dropdown-item>
                  <el-dropdown-item command="right">
                    <i
                      :class="{
                        selected: konva.selectTarget.attrs?.align == 'right',
                      }"
                      class="fi fi-rr-symbol"
                    ></i>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </div>
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
                <i
                  style="color: white"
                  class="fi fi-br-search"
                  @click="zoomRef?.handleOpen()"
                ></i>
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
              <i class="fi fi-br-expand" @click="fullScreen"></i>
            </el-tooltip>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, inject, Ref } from 'vue'
import { graphList } from '@/utils/konva/config'
import { GraphType, TextType } from '@/utils/konva/type'
import useKonvaStore from '@/store/modules/konva'
import type { DropdownInstance } from 'element-plus'
import { fontSizes } from './config'
const strokeWidthRef = ref<DropdownInstance | null>(null)
const zoomRef = ref<DropdownInstance | null>(null)
const textPositionRef = ref<DropdownInstance | null>(null)
const opacityRef = ref<number>(1)
const isFullScreen = inject('isFullScreen')
const { konva } = useKonvaStore()

const attrs = computed(() => {
  const selectTarget = konva.selectTarget.attrs

  return {
    fontSize: selectTarget.fontSize ? selectTarget.fontSize + 'px' : '0px',
    x: Math.round(selectTarget.x),
    y: Math.round(selectTarget.y),
    rotation: Math.round(selectTarget.rotation) || 0,
  }
})

const handlePickType = (type: GraphType | TextType) => {
  konva.type = type
}

const getOpacity = (opacity: number) => {
  return Math.round(opacity * 100)
}

const fullScreen = () => {
  let full = document.fullscreenElement
  const target = document.getElementById('screen') as HTMLElement | null

  if (!full) {
    ;(isFullScreen as Ref<boolean>).value = true
    konva.controller.changeZoom(1)
    konva.transf.nodes([])
     target?.requestFullscreen()
  }
  
}
</script>

<style scoped lang="scss">
.container {
  height: $header-height;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: $content-background;
  color: $base-color;
  .setting-group {
    padding: 0 0.5rem;
    display: flex;
    justify-content: center;
    .setting-item {
      height: 36px;
      margin: 0 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      span {
        font-size: 12px;
        line-height: 20px;
        margin-right: 0.2rem;
      }
      i {
        margin: 0 0.2rem;
        color: white;
      }
    }
  }
}
.tool-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  border-left: 2px dashed white;

  .tool-item {
    span {
      font-size: 14px;
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

.text-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  border-left: 2px dashed white;
  .text-item {
    padding: 0.2rem;
    font-size: 14px;
  }
}
.selected {
  color: $focus-color;
}
.el-row :deep {
  .el-col {
    margin: 0.2rem 0;
    padding: 0.2rem;
    display: flex;
    justify-content: center;
  }
  .el-input-number {
    width: 36px;
    height: 16px;
    .el-input__wrapper {
      padding: 0;
    }
  }
}
.el-tooltip {
  margin: 0.2rem;
}
.tooltip-base-box .box-item {
  max-width: 80px;
}
.custom-el-select :deep {
  .el-input {
    height: 16px;
    .el-input__suffix {
      display: none;
    }
  }
}
</style>

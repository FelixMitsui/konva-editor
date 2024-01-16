<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12">
        <div class="setting-content">
          <div class="setting-item">
            <span>寬</span>
            <el-input-number
              v-model="konva.currentAttrs.width"
              :controls="false"
              @change="
                konva.updatePickAttrs({ width: konva.currentAttrs.width })
              "
            ></el-input-number>
          </div>
          <div class="setting-item">
            <span>高</span>
            <el-input-number
              v-model="konva.currentAttrs.height"
              :controls="false"
              @change="
                konva.updatePickAttrs({ height: konva.currentAttrs.height })
              "
            ></el-input-number>
          </div>
          <div class="setting-item">
            <span>X軸</span>
            <el-input-number
              v-model="konva.currentAttrs.x"
              :controls="false"
              @change="konva.updatePickAttrs({ x: konva.currentAttrs.x })"
            ></el-input-number>
          </div>
          <div class="setting-item">
            <span>Y軸</span>
            <el-input-number
              v-model="konva.currentAttrs.y"
              :controls="false"
              @change="konva.updatePickAttrs({ y: konva.currentAttrs.y })"
            ></el-input-number>
          </div>
          <div class="setting-item">
            <span>透明度({{ getOpacity(konva.currentAttrs.opacity) }}%)</span>
            <el-slider
              v-model="konva.currentAttrs.opacity"
              size="small"
              :min="0"
              :max="1"
              :step="0.01"
              style="width: 80px"
              @change="
                konva.updatePickAttrs({ opacity: konva.currentAttrs.opacity })
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
              v-model="konva.currentAttrs.fill"
              @change="konva.updatePickAttrs({ fill: konva.currentAttrs.fill })"
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
              v-model="konva.currentAttrs.stroke"
              @change="
                konva.updatePickAttrs({ stroke: konva.currentAttrs.stroke })
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
                @command="handleStrokeWidth"
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
        <div class="text-content custom-el-select">
          <el-select v-model="fontSizeRef" style="width: 56px">
            <el-option
              v-for="(item, index) in fontSizes"
              :key="index"
              :label="item"
              :value="item"
              @click="handleFontSize"
            />
          </el-select>
        </div>
        <div class="text-content">
          <el-tooltip effect="dark" content="粗體" placement="bottom">
            <div
              :class="{ selected: fontWeightRef ? true : false }"
              class="text-item"
              @click="handleTextStyle('bold')"
            >
              <i class="fi fi-br-bold"></i>
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="底線" placement="bottom">
            <div
              :class="{ selected: textDecorationRef ? true : false }"
              class="text-item"
              @click="handleTextDecoration"
            >
              <i class="fi fi-bs-underline"></i>
            </div>
          </el-tooltip>
          <el-tooltip effect="dark" content="斜體" placement="bottom">
            <div
              :class="{ selected: fontItalicRef ? true : false }"
              class="text-item"
              @click="handleTextStyle('italic')"
            >
              <i class="fi fi-br-italic"></i>
            </div>
          </el-tooltip>
        </div>
        <div class="tools-content">
          <div
            class="tool-item"
            draggable="true"
            @mousedown="handlePickType(text.type)"
          >
            <i class="fi fi-rr-text"></i>
          </div>
          <el-popover
            :width="300"
            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px;"
          >
            <template #reference>
              <div class="tool-item"><i class="fi fi-br-pattern"></i></div>
            </template>
            <template #default>
              <div class="shapes-content">
                <div
                  v-for="(item, key) in shapeList"
                  :key="key"
                  class="shape-item"
                  draggable="true"
                  @mousedown="handlePickType(item.type)"
                >
                  <i class="iconfont" :class="item.icon"></i>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
        <div>
          <el-tooltip effect="dark" content="背景縮放" placement="bottom">
            <el-dropdown
              style="margin: 0 0.5rem"
              ref="zoomRef"
              trigger="contextmenu"
              @command="(command) => konva.changeZoom(command)"
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
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { shapeList, text } from '@/utils/konva/config'
import { ShapeType, TextType } from '@/utils/konva/type'
import useShapeStore from '@/store/modules/shape'
import type { DropdownInstance } from 'element-plus'
import { fontSizes } from './config'
const strokeWidthRef = ref<DropdownInstance | null>(null)
const zoomRef = ref<DropdownInstance | null>(null)
const { konva } = useShapeStore()
const fontSizeRef = ref<string>('16px')
const fontWeightRef = ref<boolean>(false)
const fontItalicRef = ref<boolean>(false)
const textDecorationRef = ref<boolean>(false)

const handleStrokeWidth = (command: number) => {
  konva.currentAttrs.strokeWidth = Number(command)
  konva.updatePickAttrs({ strokeWidth: konva.currentAttrs.strokeWidth })
}
const handleFontSize = () => {
  if (konva.currentAttrs.type !== 'text') return
  const fontSize = Number(fontSizeRef.value.replace(/px/, ''))
  konva.updatePickAttrs({ fontSize: fontSize })
}

const handlePickType = (type: ShapeType | TextType) => {
  konva.type = type
}

const getOpacity = (opacity: number) => {
  return Math.round(opacity * 100)
}
const handleTextDecoration = () => {
  if (konva.currentAttrs.type !== 'text') return
  textDecorationRef.value = !textDecorationRef.value
  const textDecoration = textDecorationRef.value ? 'underline' : 'none'
  konva.updatePickAttrs({ textDecoration: textDecoration })
}

const handleTextStyle = (value: string) => {
  if (konva.currentAttrs.type !== 'text') return

  if (value === 'bold') {
    fontWeightRef.value = !fontWeightRef.value
  } else if (value === 'italic') {
    console.log(!fontItalicRef.value)
    fontItalicRef.value = !fontItalicRef.value
  }
  const fontWeight = fontWeightRef.value ? 'bold' : ''
  const fontItalic = fontItalicRef.value ? 'italic' : ''
  konva.updatePickAttrs({ fontStyle: fontWeight + ' ' + fontItalic })
}

watch(
  () => konva.currentAttrs,
  () => {
    if (konva.currentAttrs.fontSize) {
      fontSizeRef.value = konva.currentAttrs.fontSize + 'px'
    }
  },
)
</script>

<style scoped lang="scss">
.container {
  padding: 0.2rem auto;
  height: $header-height;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: $content-background;
  color: $base-color;
  .setting-content {
    width: 100%;
    height: 100%;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    .setting-item {
      height: 36px;
      margin: 0 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      span {
        font-size: 12px;
      }
      i {
        margin: 0 0.2rem;
        color: white;
      }
    }
  }
}
.tools-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  border-left: 2px dashed white;
  border-right: 2px dashed white;
}
.shapes-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .shape-item {
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
  .selected {
    color: rgb(255, 202, 30);
  }
}

.el-row :deep {
  .el-col {
    padding: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-input-number {
    width: 36px;
    height: 12px;
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
    height: 18px;
    .el-input__suffix {
      display: none;
    }
  }
}
</style>

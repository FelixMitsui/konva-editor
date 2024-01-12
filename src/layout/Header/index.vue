<template>
  <div class="header">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12">
        <div class="header-item-group">
          <div class="header-item">
            <span>寬</span>
            <el-input-number
              v-model="konva.currentAttrs.width"
              :controls="false"
              @change="
                konva.updatePickAttrs({ width: konva.currentAttrs.width })
              "
            ></el-input-number>
          </div>
          <div class="header-item">
            <span>高</span>
            <el-input-number
              v-model="konva.currentAttrs.height"
              :controls="false"
              @change="
                konva.updatePickAttrs({ height: konva.currentAttrs.height })
              "
            ></el-input-number>
          </div>
          <div class="header-item">
            <span>X軸</span>
            <el-input-number
              v-model="konva.currentAttrs.x"
              :controls="false"
              @change="konva.updatePickAttrs({ x: konva.currentAttrs.x })"
            ></el-input-number>
          </div>
          <div class="header-item">
            <span>Y軸</span>
            <el-input-number
              v-model="konva.currentAttrs.y"
              :controls="false"
              @change="konva.updatePickAttrs({ y: konva.currentAttrs.y })"
            ></el-input-number>
          </div>
          <div class="header-item">
            <span>透明度({{ getOpacity(konva.currentAttrs.opacity) }}%)</span>
            <el-slider
              v-model="konva.currentAttrs.opacity"
              size="small"
              :min="0"
              :max="1"
              :step="0.01"
              style="width: 100px"
              @change="
                konva.updatePickAttrs({ opacity: konva.currentAttrs.opacity })
              "
            ></el-slider>
          </div>
          <div class="header-item">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="填充"
              placement="bottom"
            >
              <i class="fi fi-sr-fill"></i>
            </el-tooltip>
            <el-color-picker
              v-model="konva.currentAttrs.fill"
              @change="konva.updatePickAttrs({ fill: konva.currentAttrs.fill })"
            ></el-color-picker>
          </div>
          <div class="header-item">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="外框顏色"
              placement="bottom"
            >
              <i class="fi fi-rs-no-people"></i>
            </el-tooltip>
            <el-color-picker
              v-model="konva.currentAttrs.stroke"
              @change="
                konva.updatePickAttrs({ stroke: konva.currentAttrs.stroke })
              "
            ></el-color-picker>
          </div>
          <div class="header-item">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="外框粗度"
              placement="bottom"
            >
              <el-dropdown
                ref="dropdownRef"
                trigger="contextmenu"
                style="margin-right: 30px"
                @command="handleCommand"
              >
                <i class="fi fi-ss-line-width" @click="handleDropdown"></i>
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
        <div class="header-tools">
          <div class="shapes-title">文本</div>
          <div class="shapes-content">
            <div
              class="shapes-item"
              draggable="true"
              @mousedown="handlePickType(text.type)"
            >
              <i class="iconfont" :class="text.icon"></i>
            </div>
          </div>
          <div class="shapes-title">圖形</div>
          <div class="shapes-content">
            <div
              v-for="(item, key) in shapeList"
              :key="key"
              class="shapes-item"
              draggable="true"
              @mousedown="handlePickType(item.type)"
            >
              <i class="iconfont" :class="item.icon"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { shapeList, text } from '@/utils/konva/config'
import { ShapeType, TextType } from '@/utils/konva/type'
import useShapeStore from '@/store/modules/shape'
import type { DropdownInstance } from 'element-plus'

const dropdownRef = ref<DropdownInstance>()
const { konva } = useShapeStore()
const handleDropdown = () => {
  if (!dropdownRef.value) return
  dropdownRef.value.handleOpen()
}
const handleCommand = (command: number) => {
  konva.currentAttrs.strokeWidth = Number(command)
  konva.updatePickAttrs({ strokeWidth: konva.currentAttrs.strokeWidth })
}

const handlePickType = (type: ShapeType | TextType) => {
  konva.type = type
}

const getOpacity = (opacity: number | undefined) => {
  if (!opacity) {
    return 100
  }
  return Math.round(opacity * 100)
}
</script>

<style scoped lang="scss">
.header {
  padding: 0.5rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: $content-background;
  color: $base-color;
  .header-item-group {
    width: 100%;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    .header-item {
      width: 100%;
      margin: 0.3rem;
      padding: 0.2rem;
      div {
        display: flex;
        span {
          margin: 0 0.5rem;
          margin-bottom: 0.2rem;
        }
      }
      i {
        margin-right: 0.2rem;
        color: white;
      }
    }
  }
}
.header-tools {
  width: 100%;
  padding: 0 0.5rem;
  display: flex;
  justify-content: center;
  .shapes-title {
    margin: auto 0;
    margin-right: 0.5rem;
    color: $base-color;
    background-color: $base-background;
  }
  .shapes-content {
    margin: 0 0.2rem;
    display: flex;
    flex-wrap: wrap;
    .shapes-item {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      transition: all 0.3s;
      cursor: pointer;
      color: $base-color;
      border: 2px solid $content-background;
      border-radius: 4px;

      &:hover {
        border: 2px solid #009dff;
        background-color: $base-background;
      }

      i {
        pointer-events: none;
        font-size: 24px;
      }
      label {
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
}
.el-row :deep {
  .el-col {
    display: flex;
    justify-content: center;
  }
  .el-input-number {
    width: 100%;

    height: 18px;
    .el-input__wrapper {
      padding: 0;
    }
  }
}
.tooltip-base-box .box-item {
  max-width: 80px;
  margin-top: 10px;
}
</style>

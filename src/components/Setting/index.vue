<template>
  <div class="container">
    <div class="setting-input-item">
      <span>文字</span>
      <el-select
        v-model="attrs.fontSize"
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
    </div>
    <div class="setting-group">
      <div class="setting-item">
        <el-tooltip effect="dark" content="粗體" placement="bottom">
          <div
            :class="{
              selected: konva.selectTarget.attrs.fontStyle?.includes('bold'),
            }"
            @click="() => konva.controller.setTextStyle('bold')"
          >
            <i class="fi fi-br-bold"></i>
          </div>
        </el-tooltip>
      </div>
      <div class="setting-item">
        <el-tooltip effect="dark" content="底線" placement="bottom">
          <div
            :class="{
              selected:
                konva.selectTarget.attrs.textDecoration?.includes('underline'),
            }"
            @click="() => konva.controller.setTextDecoration('underline')"
          >
            <i class="fi fi-bs-underline"></i>
          </div>
        </el-tooltip>
      </div>
      <div class="setting-item">
        <el-tooltip effect="dark" content="斜體" placement="bottom">
          <div
            :class="{
              selected: konva.selectTarget.attrs.fontStyle?.includes('italic'),
            }"
            @click="() => konva.controller.setTextStyle('italic')"
          >
            <i class="fi fi-br-italic"></i>
          </div>
        </el-tooltip>
      </div>
      <div class="setting-item">
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
    </div>
    <div class="setting-group">
      <div class="setting-input-item">
        <span>X軸</span>
        <el-input-number
          v-model="attrs.x"
          :controls="false"
          @change="konva.controller.updatePickAttrs({ x: attrs.x })"
        ></el-input-number>
      </div>
      <div class="setting-input-item">
        <span>Y軸</span>
        <el-input-number
          v-model="attrs.y"
          :controls="false"
          @change="konva.controller.updatePickAttrs({ y: attrs.y })"
        ></el-input-number>
      </div>
      <div class="setting-input-item">
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
      <div class="setting-input-item">
        <span>透明度{{ getOpacity(konva.selectTarget.attrs.opacity) }}%</span>
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
      <div class="setting-group">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, Ref, computed } from 'vue'
import type { DropdownInstance } from 'element-plus'
import useKonvaStore from '../../store/modules/konva'
import { fontSizes } from './config'

const strokeWidthRef = ref<DropdownInstance | null>(null)
const opacityRef = ref<number>(1)
const textPositionRef = ref<DropdownInstance | null>(null)
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

const getOpacity = (opacity: number) => {
  return Math.round(opacity * 100)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  .custom-el-select :deep {
    .el-input {
      max-width: 80px;
      min-width: 80px;
      max-height: 20px;
    }
  }

  .setting-group {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    flex-grow: 1;
    .setting-item {
      i {
        margin-right: 0.2rem;
      }
      span {
        margin-right: 0.2rem;
      }
      display: flex;
      align-items: center;
      padding: 0.2rem;
      font-size: 14px;
    }
  }
}

.setting-input-item {
  flex-grow: 1;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  span {
    text-align: center;
    text-wrap: nowrap;
    font-size: 14px;
    margin-right: 0.5rem;
  }
  i {
    margin-right: 1rem;
  }
  .el-input-number:deep {
    max-width: 56px;
    max-height: 20px;
    .el-input__wrapper {
      padding: 0;
    }
  }
}
.selected {
  color: $focus-color;
}

@media screen and (min-width: 768px) {
}
</style>

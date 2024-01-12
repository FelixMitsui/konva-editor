import { defineStore } from 'pinia'
import { IshapeState } from './types/shape'
import { KonvaJS } from '@/utils/konva/index'
const useShapeStore = defineStore('ShapeStore', {
  state: (): IshapeState => {
    return {
      konva: new KonvaJS('canvas'),
    }
  },
})

export default useShapeStore

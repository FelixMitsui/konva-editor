import { defineStore } from 'pinia'
import { IKonvaState } from './types/konva'
import { KonvaJS } from '@/utils/konva/index'
const useKonvaStore = defineStore('GraphStore', {
  state: (): IKonvaState => {
    return {
      konva: new KonvaJS('canvas'),
      slideshowUrls: [],
    }
  },
})

export default useKonvaStore

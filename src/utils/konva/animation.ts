import Konva from 'konva'
import { KonvaJS } from '.'
import { AnimType } from './type'

export default class Animation {
  private konva: KonvaJS
  constructor(konva: KonvaJS) {
    this.konva = konva
  }

  addTween() {
    const selectTarget = this.konva.selectTarget
    const type = selectTarget.attrs.type
    if (!type || type === 'canvas') return
    const tween = new Konva.Tween({
      node: selectTarget,
      duration: 1,
      rotation: 360,
      onFinish: () => tween.reset(),
    })
    const targetIndex = this.konva.slideshows.findIndex(
      (slideshow) => slideshow.layer._id === this.konva.layer?._id,
    )
    if (targetIndex !== -1) {
      if (!this.konva.slideshows[targetIndex].anim) {
        this.konva.slideshows[targetIndex].anim = []
      }
      this.konva.slideshows[targetIndex].anim.push({
        type: AnimType.ROTATION,
        tween: tween,
      })
    }
  }

  selectTween(type: string, anim: { type: string; tween: Konva.Tween }) {
    const config = {
      node: anim.tween.node,
      duration: 1,
    }
    switch (type) {
      case AnimType.ROTATION: {
        const tween = new Konva.Tween({
          ...config,
          rotation: 360,
          onFinish: () => tween.reset(),
        })
        return tween
      }
      case AnimType.FADE_IN: {
        config.node.opacity(0)
        const tween = new Konva.Tween({
          ...config,
          opacity: 1,
        })
        return tween
      }
      case AnimType.FADE_OUT: {
        const tween = new Konva.Tween({
          ...config,
          opacity: 0,
        })
        return tween
      }
      default:
        break
    }
  }

  startAnim(item: Konva.TweenConfig) {
    item.reset()
    item.play()
  }

  toggleAnimType(newType: string, index: number) {
    const anim = this.konva.slideshows[this.konva.currentLayerIndex].anim[index]
    const newTween = this.selectTween(newType, anim)

    this.konva.slideshows[this.konva.currentLayerIndex].anim[index] = {
      type: newType,
      tween: newTween as Konva.Tween,
    }
  }

  deleteAnim(index: number) {
    this.konva.slideshows[this.konva.currentLayerIndex].anim.splice(index, 1)
  }

  playAnim() {
  
    const anim = this.konva.slideshows[this.konva.currentLayerIndex].anim
    const animLen = anim.length
    if (anim && this.konva.animCount < animLen) {
      console.log( animLen )
      this.konva.slideshows[this.konva.currentLayerIndex].anim[
        this.konva.animCount
      ].tween.reset()

      this.konva.slideshows[this.konva.currentLayerIndex].anim[
        this.konva.animCount
      ].tween.play()

      this.konva.animCount++
      return
    } else if (
      this.konva.slideshows.length - 1 ==
      this.konva.currentLayerIndex
    ) {
      console.log('最後一頁')
      return
    }
    console.log('換頁')
    this.konva.animCount = 0
    this.konva.currentLayerIndex += 1
    
    this.konva.controller.switchSlideshow(this.konva.currentLayerIndex)
  }
  resetAllAnim() {
    this.konva.slideshows.forEach((slideshow: Konva.NodeConfig) => {
      slideshow.anim.forEach((anim: { tween: Konva.Tween; type: string }) => {
        if (anim.tween) {
          anim.tween.reset()
        }
      })
    })
  }
}

import { KonvaJS } from '.'
import Konva from 'konva'
export default class Controller {
  private konva: KonvaJS
  constructor(konva: KonvaJS) {
    this.konva = konva
  }

  onresize() {
    const el = document.getElementById(this.konva.id)
    if (!el) {
      return
    }
    const { clientWidth, clientHeight } = el
    this.konva.stage?.setAttrs({
      width: clientWidth,
      height: clientHeight,
    })
  }
  updatePickAttrs(attr: Konva.NodeConfig) {
    if (!this.konva.stage) return

    this.konva.selectTarget.setAttrs(attr)
    this.konva.selectTarget.draw()
    this.konva.transf?.nodes([this.konva.selectTarget])
  }
  pickMenuOption(type: string) {
    if (type === 'moveUp') {
      this.konva.selectTarget.moveUp()
    } else if (type === 'moveDown') {
      if (this.konva.selectTarget.getAbsoluteZIndex() === 5) {
        return
      }
      this.konva.selectTarget.moveDown()
    } else if (type === 'destroy') {
      this.konva.selectTarget.destroy()
      this.konva.isMenuVisible = false
    }
    this.konva.transf?.nodes([])
  }

  changeZoom(command: number) {
    if (!this.konva.stage) return
    const scaleFactor = Number(command)
    if (this.konva.stage.attrs.scaleX === scaleFactor) return
    this.konva.zoom = scaleFactor
    if (!this.konva.stage) return
    const newWidth = (this.konva.stage?.width() as number) * scaleFactor
    const newHeight = (this.konva.stage?.height() as number) * scaleFactor

    const x = Math.round(
      this.konva.stage.attrs.x -
        (newWidth - this.konva.stage?.width()) / 2 -
        this.konva.stage.attrs.x,
    )
    const y = Math.round(
      this.konva.stage.attrs.y -
        (newHeight - this.konva.stage?.height()) / 2 -
        this.konva.stage.attrs.y,
    )
    this.konva.stage.setAttrs({
      x: x,
      y: y,
      scaleX: scaleFactor,
      scaleY: scaleFactor,
    })
    this.konva.layer?.draw()
  }

  setTextDecoration(value: string) {
    if (this.konva.selectTarget.attrs.type !== 'text') return
    if (this.konva.selectTarget.attrs.textDecoration?.includes(value)) {
      this.konva.selectTarget.attrs.textDecoration = 'none'
    } else {
      this.konva.selectTarget.attrs.textDecoration = 'underline'
    }
    this.konva.selectTarget.setAttrs({
      textDecoration: this.konva.selectTarget.attrs.textDecoration,
    })
    this.konva.layer?.draw()
  }

  setTextStyle(value: string) {
    if (this.konva.selectTarget.attrs.type !== 'text') return
    if (value === 'bold') {
      if (this.konva.selectTarget.attrs.fontStyle?.includes('bold')) {
        this.konva.selectTarget.attrs.fontStyle =
          this.konva.selectTarget.attrs.fontStyle.replace(/bold/, '')
      } else {
        if (this.konva.selectTarget.attrs.fontStyle) {
          this.konva.selectTarget.attrs.fontStyle =
            this.konva.selectTarget.attrs.fontStyle + ' ' + 'bold'
        } else {
          this.konva.selectTarget.attrs.fontStyle = 'bold'
        }
      }
    } else if (value === 'italic') {
      if (this.konva.selectTarget.attrs.fontStyle?.includes('italic')) {
        this.konva.selectTarget.attrs.fontStyle =
          this.konva.selectTarget.attrs.fontStyle.replace(/italic/, '')
      } else {
        if (this.konva.selectTarget.attrs.fontStyle) {
          this.konva.selectTarget.attrs.fontStyle =
            this.konva.selectTarget.attrs.fontStyle + ' ' + 'italic'
        } else {
          this.konva.selectTarget.attrs.fontStyle = 'italic'
        }
      }
    }
    this.konva.selectTarget.setAttrs({
      fontStyle: this.konva.selectTarget.attrs.fontStyle,
    })
    this.konva.layer?.draw()
  }

  setFontSize(value: string) {
    const fontSize = Number(value.replace(/px/, ''))
    this.konva.selectTarget.setAttrs({ fontSize })
    this.konva.layer?.draw()
  }

  setPosition(value: string) {
    if (this.konva.selectTarget.attrs.type !== 'text') return
    this.konva.selectTarget.setAttrs({ align: value })
    this.konva.layer?.draw()
  }

  //切換圖層顯示到主畫布
  switchSlideshow(index: number) {
    const targetIndex = this.konva.slideshows.findIndex(
      (slideshow) => slideshow.layer._id === this.konva.layer?._id,
    )
    if (targetIndex == index) return
    if (targetIndex !== -1) {
      this.konva.slideshows[targetIndex].layer = this.konva.layer as Konva.Layer
      this.konva.slideshows[targetIndex].group = this.konva.group as Konva.Group
      this.konva.slideshows[targetIndex].transf = this.konva
        .transf as Konva.Transformer
    }

    this.konva.layer?.remove()
    this.konva.layer = this.konva.slideshows[index].layer
    this.konva.group = this.konva.slideshows[index].group
    this.konva.transf = this.konva.slideshows[index].transf
    this.konva.layer.add(this.konva.transf, this.konva.group)
    this.konva.stage?.add(this.konva.layer)
    this.changeZoom(this.konva.zoom)
  }
}

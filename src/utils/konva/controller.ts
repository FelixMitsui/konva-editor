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
    if (!this.konva.stage) return
    const { clientWidth, clientHeight } = el
    const target = this.konva.group?.findOne(
      (node) => node.attrs.type === 'canvas',
    )
    const width = this.konva.stage.width()
    const height = this.konva.stage.height()
    const scale = Math.min(1, width / 1024)
    const x = (width - 1024 * scale) / 2
    const y = (height - 576 * scale) / 2
    target?.setAttrs({
      x: x,
      y: y,
      scaleX: scale,
      scaleY: scale,
    })

    this.konva.stage?.setAttrs({
      width: clientWidth,
      height: clientHeight,
    })
  }
  updatePickAttrs(attr: Konva.NodeConfig) {
    if (!this.konva.stage) return

    const type = this.konva.selectTarget.attrs.type
    if (
      type === 'star' ||
      type === 'fan' ||
      type === 'hexagon' ||
      type === 'pentagon' ||
      type === 'rhombus' ||
      type === 'ellipse' ||
      type === 'circle'
    ) {
      attr = {
        ...attr,
        offset: {
          x: 0,
          y: 0,
        },
      }
    } else if (type === 'arrow' || type === 'line') {
      const points = this.konva.selectTarget.attrs.points
      const centerX = (points[points.length - 2] + points[0]) / 2
      const centerY = (points[1] + points[points.length - 1]) / 2

      attr = {
        ...attr,
        offset: {
          x: centerX,
          y: centerY,
        },
      }
    }

    this.konva.selectTarget.setAttrs(attr)
    this.konva.isUpdateSideLayer = true
    this.konva.selectTarget.draw()
    if (this.konva.selectTarget.attrs.type === 'canvas') return
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
      this.konva.transf?.nodes([])
    } else if (type === 'clone') {
      const cloneTarget = this.konva.selectTarget.clone()
      this.konva.group?.add(cloneTarget)
      this.konva.isMenuVisible = false
    }
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
    this.konva.slideshows[index].transf.nodes([])
    this.konva.transf = this.konva.slideshows[index].transf
    this.konva.layer.add(this.konva.transf, this.konva.group)
    this.konva.stage?.add(this.konva.layer)
    this.konva.currentLayerIndex = index
    if (this.konva.isScreen) return
    this.changeZoom(this.konva.zoom)
  }

  toggleFullScreen(isFull?: boolean) {
    const full = document.fullscreenElement
    const el = document.getElementById('canvas') as HTMLElement

    if (!full && isFull) {
      this.konva.animation.resetAllAnim()
      this.konva.transf?.nodes([])
      this.konva.selectTarget.setDraggable(false)
      this.changeZoom(1)
      this.konva.stage?.setAttrs({
        width: screen.width,
        height: screen.height,
        scaleX: 1.6,
        scaleY: 1.6,
        y: -45,
      })
      el?.requestFullscreen()
      this.konva.isScreen = true
    } else if (!full && isFull == undefined) {
      this.konva.selectTarget.setDraggable(true)
      const { clientWidth, clientHeight } = el
      const x = clientWidth / 2 - clientWidth / 2
      const y = clientHeight / 2 - clientHeight / 2
      this.konva.stage?.setAttrs({
        width: clientWidth,
        height: clientHeight,
        x: x,
        y: y,
        scaleX: 1,
        scaleY: 1,
      })
      this.konva.animCount = 0
      this.konva.animation.resetAllAnim()
      this.konva.isScreen = false
    }
  }
}

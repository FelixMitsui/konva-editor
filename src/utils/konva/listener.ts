import Konva from 'konva'
import { GraphType, TextType } from './type'
import { KonvaJS } from '.'
export default class Listener {
  private konva: KonvaJS

  constructor(konva: any) {
    this.konva = konva
  }

  stageEvent() {
    if (!this.konva.stage) return
    //舞台內容元素
    const container = this.konva.stage.container()
    //舞台滑鼠按下監聽
    this.konva.stage.on(
      'mousedown',
      (event: Konva.KonvaEventObject<MouseEvent>): void => {
        //禁止側欄更新畫面
        this.konva.isUpdateSideLayer = false
        //重製右鍵選單
        this.konva.isMenuVisible = false
        const dom = event.target
        const domAttrs = dom.getAttrs()

        //點擊左鍵
        if (event.evt.button === 0) {
          //目標不可編輯退出
          if (!domAttrs.isEdit) {
            return
          }
          if (this.konva.isScreen) {
            this.konva.animation.playAnim()
            return
          }
          console.log(this.konva.selectTarget.attrs.id)
          if (this.konva.selectTarget.attrs.id === domAttrs.id) return

          this.konva.selectTarget.off()
          this.konva.selectTarget = dom

          if (this.konva.selectTarget.attrs.type === 'text') {
            this.textEvent(dom)
          } else {
            this.shapeEvent(dom)
          }
          if (domAttrs.type === GraphType.CANVAS) {
            this.konva.transf?.nodes([])
            return
          }
          if (
            domAttrs.type === GraphType.LINE ||
            domAttrs.type === GraphType.ARROW
          ) {
            this.konva.transf?.nodes([dom])
            this.konva.transf?.enabledAnchors(['middle-right', 'middle-left'])
            return
          }

          if (domAttrs.type === TextType.TEXT) {
            this.konva.transf?.nodes([dom])
            this.konva.transf?.enabledAnchors(['middle-right', 'middle-left'])
            return
          } else {
            this.konva.transf?.enabledAnchors([
              'top-left',
              'top-right',
              'middle-right',
              'middle-left',
              'bottom-left',
              'bottom-right',
            ])
          }
          this.konva.transf?.nodes([dom])
        }
        //右鍵
        if (event.evt.button === 2) {
          if (!this.konva.isMenuVisible) {
            this.konva.isMenuVisible = true
            const menuDom = document.querySelector(
              '.contextMenu',
            ) as HTMLElement
            if (!menuDom) {
              return
            }
            if (dom.getAbsoluteZIndex() === 5) {
              this.konva.menuList[1].disabled = true
            } else {
              this.konva.menuList[1].disabled = false
            }
            menuDom.style.left = `${event.evt.clientX + 10}px`
            menuDom.style.top = `${event.evt.clientY + 1}px`
          }
        }
      },
    )
    //拖曳元素在舞台上
    container.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault()
    })

    //拖曳放置到舞台上
    container.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault()
      if (this.konva.type == null) {
        return
      }
      this.konva.stage?.setPointersPositions(event)
      const position = this.konva.stage?.getRelativePointerPosition()
      if (position) {
        this.konva.drawer.createGraph(
          this.konva.type,
          position,
        ) as unknown as Konva.Node
      }
    })
  }
  //監聽形狀
  shapeEvent(shape: Konva.Node) {
    if (!shape) return
    shape.on('dragstart', () => {
      this.konva.isUpdateSideLayer = false
    })
    shape.on('transformstart', () => {
      this.konva.isUpdateSideLayer = false
    })
    shape.on('transformend', (event) => {
      const attrs = event.target.getAttrs()
      this.konva.selectTarget.attrs = { ...attrs }
      this.konva.isUpdateSideLayer = true
    })

    shape.on('dragend', () => {
      const attrs = shape.getAttrs()
      this.konva.selectTarget.attrs = { ...attrs }
      this.konva.isUpdateSideLayer = true
    })

    shape.on('click', () => {
      const attrs = shape.getAttrs()
      if (attrs.name === 'video') {
        const video = document.createElement('video')

        const target = this.konva.group?.findOne(
          (node) => node.attrs.type === 'canvas',
        )
        if (!target) return
        video.src = shape?.image().src
        video.controls = true
        const rectClientRect = shape.getClientRect()
        video.style.position = 'absolute'
        video.style.left = `${rectClientRect.x}px`
        video.style.top = `${rectClientRect.y}px`
        video.style.width = `${rectClientRect.width}px`
        video.style.height = `${rectClientRect.height}px`
        this.konva.stage?.container()?.appendChild(video)
        this.konva.layer?.draw()

        video.addEventListener('blur', function () {
          video.remove()
        })
      }
    })

    shape.on('blur', () => {
      const attrs = shape.getAttrs()
      if (attrs.name != 'video') return
      const video = document.getElementsByTagName('video')[0]
      video.remove()
    })
  }
  //監聽文本
  textEvent(text: Konva.Node) {
    if (!text) return

    text.on('dragstart', () => {
      this.konva.isUpdateSideLayer = false
    })
    text.on('transformstart', () => {
      this.konva.isUpdateSideLayer = false
    })
    text.on('dragend', () => {
      const target = text.getAttrs()
      this.konva.selectTarget.attrs = { ...target }
      this.konva.isUpdateSideLayer = true
    })

    text.on('transform', () => {
      if (!this.konva.transf) return
      text.setAttrs({
        width: Math.max(text.width() * text.scaleX(), 20),
        scaleX: 1,
        scaleY: 1,
      })
    })
    text.on('transformend', () => {
      const target = text.getAttrs()
      this.konva.selectTarget.attrs = { ...target }
      this.konva.isUpdateSideLayer = true
    })
    text.on('dblclick', () => {
      //創建文字框
      const position = text.getAbsolutePosition()
      const input = document.createElement('textarea')
      const canvas = document.getElementById(this.konva.id)
      const { clientHeight } = canvas
      const diffHeight = (clientHeight - this.konva.stage?.height()) / 2
      input.style.position = 'absolute'
      const rotation = text.rotation()
      const offset = text.offset()
      const rotatedOffset = {
        x:
          offset.x * Math.cos((rotation * Math.PI) / 180) -
          offset.y * Math.sin((rotation * Math.PI) / 180),
        y:
          offset.x * Math.sin((rotation * Math.PI) / 180) +
          offset.y * Math.cos((rotation * Math.PI) / 180),
      }

      input.style.left = `${
        position.x - rotatedOffset.x * this.konva.stage?.scaleX()
      }px`
      input.style.padding = '10px'
      input.style.color = text.attrs.fill
      input.style.top = `${
        diffHeight + position.y - rotatedOffset.y * this.konva.stage?.scaleX()
      }px`
      input.style.transform = `rotate(${rotation}deg)`
      input.style.transformOrigin = 'top left'
      input.style.width = text.width() * this.konva.stage?.scaleX() + 'px'
      input.style.height = text.height() * this.konva.stage?.scaleX() + 'px'
      input.value = text.attrs.text
      input.style.outline = 'none'
      input.style.resize = 'vertical'
      input.style.textDecoration = text.attrs.textDecoration
      input.style.fontStyle = text.attrs.fontStyle.includes('italic')
        ? 'italic'
        : ''
      input.style.fontWeight = text.attrs.fontStyle.includes('bold')
        ? 'bold'
        : ''
      input.style.fontSize = (
        text.attrs.fontSize * this.konva.stage?.scaleX() +
        'px'
      ).toString()

      this.konva.stage?.container()?.appendChild(input)
      input.focus()
      text.setAttrs({ text: '', skewX: 0 })

      input.addEventListener('blur', function () {
        input.remove()
        text.setAttrs({ text: input.value })
      })
    })
  }
}

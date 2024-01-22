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

          if (this.konva.selectTarget.attrs.id === domAttrs.id) return

          this.konva.selectTarget.off()
          this.konva.selectTarget = dom

          if (this.konva.type === 'text') {
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
    //舞台滑鼠釋放監聽
    this.konva.stage.on('mouseup', () => {
      //允許側欄更新畫面
      this.konva.isUpdateSideLayer = true
    })

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

    shape.on('transformend', () => {
      const attrs = shape.getAttrs()
      this.konva.selectTarget.attrs = { ...attrs }
    })

    shape.on('dragend', () => {
      const attrs = shape.getAttrs()
      this.konva.selectTarget.attrs = { ...attrs }
    })
  }
  //監聽文本
  textEvent(text: Konva.Node) {
    if (!text) return

    text.on('dragend', () => {
      const target = text.getAttrs()
      this.konva.selectTarget.attrs = { ...target }
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
    })
    text.on('dblclick', () => {
      //創建文字框
      const position = text.getAbsolutePosition()
      const input = document.createElement('textarea')
      input.style.position = 'absolute'
      input.style.left = position.x + 'px'
      input.style.padding = '10px'
      input.style.color = text.attrs.fill
      input.style.top = position.y + 'px'
      input.style.transform = `rotate(${text.rotation()}deg)`
      input.style.transformOrigin = 'top left'
      input.style.width = text.width() + 'px'
      input.style.height = text.height() + 'px'
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
      input.style.fontSize = (text.attrs.fontSize + 'px').toString()
      const canvas = document.getElementById('canvas')
      canvas?.appendChild(input)
      input.focus()

      text.setAttrs({ text: '', skewX: 0 })

      input.addEventListener('blur', function () {
        input.remove()
        text.setAttrs({ text: input.value })
      })
    })
  }
}

import Konva from 'konva'
import { ShapeType, TextType, IMenuList } from '@/utils/konva/type'
import { menuList } from './config'
export class KonvaJS {
  public id: string
  public stage: Konva.Stage | null
  public layer: Konva.Layer | null
  public transf: Konva.Transformer | null
  public group: Konva.Group | null
  public type: ShapeType | TextType | null
  public isMenuVisible: boolean
  public isUpdateSideLayer: boolean
  public currentAttrs: Konva.NodeConfig
  public menuList: IMenuList[]
  public slideshows: {
    layer: Konva.Layer
    group: Konva.Group
    transf: Konva.Transformer
  }[]
  constructor(id: string) {
    //div標籤 id屬性
    this.id = id
    //選取目標的類型
    this.type = null
    this.stage = null
    this.layer = null
    this.transf = null
    this.group = null
    //控制目標顯示隱藏選單
    this.isMenuVisible = false
    //控制左側圖層區域更新
    this.isUpdateSideLayer = true
    //不同圖層容器
    this.slideshows = []
    //選取目標屬性
    this.currentAttrs = {}
    //隱藏選單內容
    this.menuList = menuList
  }
  init() {
    const el = document.getElementById(this.id)
    if (!el) {
      return
    }
    const { clientWidth, clientHeight } = el

    //此處建立主舞台
    this.stage = new Konva.Stage({
      container: this.id,
      width: clientWidth,
      height: clientHeight,
      draggable: false,
      type: ShapeType.CANVAS,
    })
    //建立圖層
    const { layer, group, transf } = this.newLayer()
    this.layer = layer
    this.group = group
    this.transf = transf
    this.group.add(this.transf)
    this.layer.add(this.group)
    this.stage.add(this.layer)

    this.listenerStageEvents()
  }
  drawBoard() {
    if (!this.stage) {
      return
    }
    const width = this.stage.width()
    const height = this.stage.height()
    const x = this.stage.width() / 2 - width / 2
    const y = this.stage.height() / 2 - height / 2
    const board = new Konva.Rect({
      id: this.getUUID(),
      title: '畫板',
      name: 'board',
      x: x,
      y: y,
      width: width,
      height: height,
      fill: '#ffffff',
      type: ShapeType.BOARD,
      stroke: '#ffffff',
      strokeWidth: 1,
      opacity: 1,
      create: true,
      scaleX: 1,
      scaleY: 1,
    })
    return board
  }
  // 放置圖形
  drawShapes(type: ShapeType, position: Konva.Vector2d) {
    if (!this.stage) {
      return
    }
    //取得所有該形狀
    const allShapes = this.stage.find(type)
    const shape = this.newShape(type, {
      id: this.getUUID(),
      title: `${type}${allShapes.length + 1}`,
    })
    if (!shape) {
      return
    }
    shape.position(position)
    this.group?.add(shape)
    return shape
  }
  onresize() {
    const el = document.getElementById(this.id)
    if (!el) {
      return
    }
    const { clientWidth, clientHeight } = el
    this.stage?.setAttrs({
      width: clientWidth,
      height: clientHeight,
    })
  }
  getUUID() {
    let d = Date.now()
    if (
      typeof performance !== 'undefined' &&
      typeof performance.now === 'function'
    ) {
      d += performance.now()
    }
    return 'xxxxxxxxxxxxxxxxxxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
  }
  //切換圖層顯示到主畫布
  switchSlideshow(index: number) {
    const targetIndex = this.slideshows.findIndex(
      (slideshow) => slideshow.layer._id === this.layer?._id,
    )
    if (targetIndex == index) return
    if (targetIndex !== -1) {
      this.slideshows[targetIndex].layer = this.layer as Konva.Layer
      this.slideshows[targetIndex].group = this.group as Konva.Group
      this.slideshows[targetIndex].transf = this.transf as Konva.Transformer
    }

    this.layer?.remove()
    this.layer = this.slideshows[index].layer
    this.group = this.slideshows[index].group
    this.transf = this.slideshows[index].transf
    this.group.add(this.transf)
    this.layer.add(this.group)
    this.stage?.add(this.layer)
  }
  //建立圖層
  newLayer() {
    const layer = new Konva.Layer({})
    const group = new Konva.Group()
    const transf = new Konva.Transformer()
    const board = this.drawBoard()
    if (board) {
      group.add(board)
    }
    layer.add(group)
    this.slideshows.push({
      layer: layer,
      group: group,
      transf: transf,
    })

    return {
      layer,
      group,
      transf,
    }
  }
  //建立變換器
  newTransformer(data: Konva.TransformerConfig) {
    return new Konva.Transformer(data)
  }

  newShape(type: ShapeType, data: { id: string; title: string }) {
    const shapeAttrs = {
      name: type,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      draggable: true,
      type: type,
      width: 200,
      height: 100,
      opacity: 1,
      create: true,
      scaleX: 1,
      scaleY: 1,
      ...data,
    } as Konva.NodeConfig

    switch (type) {
      case ShapeType.RECT:
        return new Konva.Rect(shapeAttrs)
      case ShapeType.PARALLELOGRAM:
        return new Konva.Rect({
          ...shapeAttrs,
          skewX: -0.5,
        })
      case ShapeType.RHOMBUS:
        return new Konva.RegularPolygon({
          ...shapeAttrs,
          sides: 4,
        } as Konva.RegularPolygonConfig)
      case ShapeType.PENTAGON:
        return new Konva.RegularPolygon({
          ...shapeAttrs,
          sides: 5,
          radius: 100,
        } as Konva.RegularPolygonConfig)
      case ShapeType.HEXAGON:
        return new Konva.RegularPolygon({
          ...shapeAttrs,
          sides: 6,
          radius: 100,
        } as Konva.RegularPolygonConfig)
      case ShapeType.STAR:
        return new Konva.Star({
          ...shapeAttrs,
          numPoints: 5,
          innerRadius: 50,
          outerRadius: 100,
        })
      case ShapeType.FAN:
        return new Konva.Wedge({ ...shapeAttrs, radius: 70, angle: 90 })
      case ShapeType.CIRCLE:
        return new Konva.Circle({
          ...shapeAttrs,
          radius: 100,
        })
      case ShapeType.LINE:
        return new Konva.Line({
          name: type,
          create: true,
          draggable: true,
          ...data,
          type: type,
          width: 200,
          opacity: 1,
          fill: 'black',
          points: [0, 50, 140, 50, 250, 50, 300, 50],
          stroke: 'black',
          strokeWidth: 8,
          lineCap: 'round',
          lineJoin: 'round',
        })
      case ShapeType.ELLIPSE:
        return new Konva.Ellipse({
          ...shapeAttrs,
          radiusX: 100,
          radiusY: 50,
        })
      case ShapeType.ARROW:
        return new Konva.Arrow({
          name: type,
          create: true,
          draggable: true,
          ...data,
          type: type,
          width: 200,
          pointerLength: 5,
          pointerWidth: 5,
          opacity: 1,
          fill: 'black',
          points: [0, 50, 140, 50],
          stroke: 'black',
          strokeWidth: 3,
        })
      default:
        break
    }
  }

  newText(position: Konva.Vector2d) {
    if (!this.stage) {
      return
    }
    const id = this.getUUID()
    //取得所有該文本
    const allTexts = this.stage.find('text')
    const text = new Konva.Text({
      id: id,
      title: `text${allTexts.length + 1}`,
      name: 'text',
      text: '編輯文本',
      fontSize: 16,
      scaleX: 1,
      scaleY: 1,
      draggable: true,
      type: 'text',
      create: true,
    })
    text.position(position)
    this.group?.add(text)
    return text
  }

  listenerStageEvents() {
    if (!this.stage) {
      return
    }
    //舞台內容元素
    const container = this.stage.container()
    //舞台點擊監聽
    this.stage.on('click', (event: Konva.KonvaEventObject<MouseEvent>) => {
      const dom = event.target
      this.isMenuVisible = false
      //右鍵點擊
      if (event.evt.button === 2) {
        this.getShapeAttrs(dom)
        if (!this.isMenuVisible) {
          this.isMenuVisible = true
          const menuDom = document.querySelector('.contextMenu') as HTMLElement
          if (!menuDom) {
            return
          }
          if (dom.getAbsoluteZIndex() === 5) {
            this.menuList[1].disabled = true
          } else {
            this.menuList[1].disabled = false
          }
          menuDom.style.left = `${event.evt.clientX + 10}px`
          menuDom.style.top = `${event.evt.clientY + 1}px`
        }
      }
    })
    //舞台滑鼠按下監聽
    this.stage.on(
      'mousedown',
      (event: Konva.KonvaEventObject<MouseEvent>): void => {
        this.isUpdateSideLayer = false
        const dom = event.target
        const domAttrs = dom.getAttrs()
        if (event.evt.button === 1) {
          this.stage?.draggable(true)
        }

        if (event.evt.button === 0) {
          if (domAttrs.type === ShapeType.CANVAS) {
            const target = this.stage?.findOne(`#${domAttrs.id}`)
            if (target) {
              this.getShapeAttrs(target)
            }
            this.transf?.nodes([])
            return
          }
          if (!domAttrs.create) {
            return
          }
          this.getShapeAttrs(dom)
          if (
            domAttrs.type === ShapeType.LINE ||
            domAttrs.type === ShapeType.ARROW
          ) {
            this.transf?.nodes([dom])
            this.transf?.enabledAnchors(['middle-right', 'middle-left'])
            return
          }

          if (domAttrs.type === ShapeType.BOARD) {
            this.transf?.nodes([])
            return
          }

          if (domAttrs.type === TextType.TEXT) {
            this.transf?.nodes([dom])
            this.getTextAttrs(dom)
            this.transf?.enabledAnchors(['middle-right'])
            return
          } else {
            this.transf?.enabledAnchors([
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
            ])
          }

          this.transf?.nodes([dom])
        }
      },
    )
    //舞台滑鼠釋放監聽
    this.stage.on('mouseup', (event: Konva.KonvaEventObject<MouseEvent>) => {
      this.isUpdateSideLayer = true
    })
    //拖曳元素在舞台上
    container.addEventListener('dragover', (event: DragEvent) => {
      event.preventDefault()
    })
    //拖曳放置到舞台上
    container.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault()
      if (this.type == null) {
        return
      }
      this.stage?.setPointersPositions(event)

      if (this.type == 'text') {
        const position = this.stage?.getRelativePointerPosition()
        if (position) {
          const text = this.newText(position) as Konva.Node

          this.listenerTextEvents(text)
        }
      } else {
        const position = this.stage?.getRelativePointerPosition()
        if (position) {
          const shape = this.drawShapes(this.type, position) as Konva.Node
          this.listenerShapeEvents(shape)
        }
      }
    })
  }

  listenerShapeEvents(shape: Konva.Node) {
    if (!shape) return

    shape.off('dragmove')
    shape.off('transform')

    shape.on('dragmove', (event) => {
      this.getShapeAttrs(event.target)
    })
    shape.on('transform', (event) => {
      this.getShapeAttrs(event.target)
    })
  }
  listenerTextEvents(text: Konva.Node) {
    if (!text) return

    text.off('transform')
    text.off('dragmove')

    text.on('transform', (event) => {
      this.getTextAttrs(event.target)
    })
    text.on('dragmove', (event) => {
      this.getTextAttrs(event.target)
    })
  }
  getTextAttrs(text: Konva.Node) {
    if (this.transf) {
      const { id, title, stroke, strokeWidth, width, height, x, y, type } =
        text.getAttrs()
      const selectedNode = this.transf.nodes()[0]

      const scaleX = selectedNode.scaleX()
      const transfWidth = selectedNode.width(selectedNode.width() * scaleX)

      const attrs = {
        id,
        title,
        stroke,
        strokeWidth,
        width,
        height,
        x: Math.round(x),
        y: Math.round(y),
        type,
      }
      attrs.width = Math.round(transfWidth.attrs.width)
      attrs.height = selectedNode.height()
      this.currentAttrs = attrs
    }
  }

  getShapeAttrs(shape: Konva.Node) {
    const {
      id,
      title,
      opacity,
      fill,
      stroke,
      strokeWidth,
      width,
      height,
      x,
      y,
      scaleX,
      scaleY,
      type,
      radius,
    } = shape.getAttrs()

    const attrs = {
      id,
      title,
      opacity,
      fill,
      stroke,
      strokeWidth,
      width,
      height,
      x,
      y,
      type,
      radius,
    }
    if (type === ShapeType.RECT || type === ShapeType.LINE) {
      attrs.width = Math.round(width * scaleX)
      attrs.height = Math.round(height * scaleY)
    } else {
      attrs.width = Math.round(200 * scaleX)
      attrs.height = Math.round(200 * scaleY)
    }
    attrs.x = Math.round(x)
    attrs.y = Math.round(y)
    this.currentAttrs = attrs
  }

  updatePickAttrs(attr: Konva.NodeConfig) {
    if (!this.stage) {
      return
    }
    const target = this.stage.findOne(`#${this.currentAttrs.id}`)

    if (!target) {
      return
    }
    const mergedAttrs = Object.assign({}, target.attrs, attr)
    target.setAttrs(mergedAttrs)
  }
  pickMenuOption(type: string) {
    const target = this.stage?.findOne(`#${this.currentAttrs.id}`)
    if (!target) {
      return
    }
    if (type === 'moveUp') {
      target.moveUp()
    } else if (type === 'moveDown') {
      if (target.getAbsoluteZIndex() === 5) {
        return
      }
      target.moveDown()
    } else if (type === 'destroy') {
      target.destroy()
    }
    this.transf?.nodes([])
  }
}

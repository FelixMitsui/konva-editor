import { KonvaJS } from '.'
import Konva from 'konva'
import { GraphType, TextType } from './type'

export default class Drawer {
  private konva: KonvaJS
  constructor(konva: any) {
    this.konva = konva
  }

  createGraph(type: GraphType | TextType, position: Konva.Vector2d) {
    if (!this.konva.stage) {
      return
    }

    const graph = this.newGraph(type, {
      id: this.konva.getUUID(),
    })
    if (!graph) {
      return
    }

    graph.position({ x: Math.round(position.x), y: Math.round(position.y) })
    this.konva.group?.add(graph)
  }
  newCanvas() {
    if (!this.konva.stage) return
    const width = this.konva.stage.width()
    const height = this.konva.stage.height()
    const x = width / 2 - width / 2
    const y = height / 2 - height / 2
    const canvas = new Konva.Rect({
      id: this.konva.getUUID(),
      name: GraphType.CANVAS,
      x: x,
      y: y,
      width: width,
      height: height,
      scaleX: 1,
      scaleY: 1,
      fill: '#ffffff',
      draggable: false,
      stroke: '#ffffff',
      strokeWidth: 0,
      type: GraphType.CANVAS,
      opacity: 1,
      isEdit: true,
    })
    return canvas
  }

  newGraph(type: GraphType | TextType, data: { id: string }) {
    const attrs = {
      name: type,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      draggable: true,
      type: type,
      width: 200,
      height: 100,
      opacity: 1,
      isEdit: true,
      scaleX: 1,
      scaleY: 1,
      offset: {
        x: 200 / 2,
        y: 100 / 2,
      },
      ...data,
    } as Konva.NodeConfig

    switch (type) {
      case GraphType.RECT:
        return new Konva.Rect(attrs)
      case GraphType.PARALLELOGRAM:
        return new Konva.Rect({
          ...attrs,
          skewX: -0.5,
        })
      case GraphType.RHOMBUS:
        return new Konva.RegularPolygon({
          ...attrs,
          sides: 4,
        } as Konva.RegularPolygonConfig)
      case GraphType.PENTAGON:
        return new Konva.RegularPolygon({
          ...attrs,
          sides: 5,
          radius: 50,
        } as Konva.RegularPolygonConfig)
      case GraphType.HEXAGON:
        return new Konva.RegularPolygon({
          ...attrs,
          sides: 6,
          radius: 50,
        } as Konva.RegularPolygonConfig)
      case GraphType.STAR:
        return new Konva.Star({
          ...attrs,
          numPoints: 5,
          innerRadius: 50,
          outerRadius: 50,
        })
      case GraphType.FAN:
        return new Konva.Wedge({ ...attrs, radius: 50, angle: 90 })
      case GraphType.CIRCLE: {
        return new Konva.Circle({
          ...attrs,
          radius: 50,
        })
      }
      case GraphType.LINE:
        return new Konva.Line({
          ...attrs,
          ...data,
          fill: 'black',
          points: [0, 50, 140, 50, 250, 50, 300, 50],
          stroke: 'black',
          strokeWidth: 8,
          lineCap: 'round',
          lineJoin: 'round',
        })
      case GraphType.ELLIPSE:
        return new Konva.Ellipse({
          ...attrs,
          radiusX: 50,
          radiusY: 25,
        })
      case GraphType.ARROW:
        return new Konva.Arrow({
          ...attrs,
          ...data,
          pointerLength: 5,
          pointerWidth: 5,
          fill: 'black',
          points: [0, 50, 140, 50],
          stroke: 'black',
          strokeWidth: 3,
        })
      case TextType.TEXT: {
        return new Konva.Text({
          ...attrs,
          ...data,
          text: '雙擊編輯文本',
          fontSize: 24,
          fontStyle: '',
          strokeWidth: 0,
          align: 'left',
          padding: 10,
          fill: 'black',
        })
      }
      default:
        break
    }
  }
}

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
      width: 100,
      height: 50,
      opacity: 1,
      isEdit: true,
      scaleX: 1,
      scaleY: 1,
      strokeScaleEnabled: false,
      offset: {
        x: 100 / 2,
        y: 50 / 2,
      },
      ...data,
    } as Konva.NodeConfig

    switch (type) {
      case GraphType.RECT:
        return new Konva.Rect(attrs)
      case GraphType.PARALLELOGRAM: {
        return new Konva.Rect({
          ...attrs,
          skewX: -0.5,
        })
      }

      case GraphType.RHOMBUS: {
        const { offset, ...rest } = attrs
        return new Konva.RegularPolygon({
          ...rest,
          sides: 4,
          offset: {
            x: 0,
            y: 0,
          },
        } as Konva.RegularPolygonConfig)
      }

      case GraphType.PENTAGON: {
        const { width, height, offset, ...rest } = attrs
        return new Konva.RegularPolygon({
          ...rest,
          sides: 5,
          radius: 50,
          offset: {
            x: 0,
            y: 0,
          },
        } as Konva.RegularPolygonConfig)
      }

      case GraphType.HEXAGON: {
        const { width, height, offset, ...rest } = attrs
        return new Konva.RegularPolygon({
          ...rest,
          sides: 6,
          radius: 50,
          offset: {
            x: 0,
            y: 0,
          },
        } as Konva.RegularPolygonConfig)
      }

      case GraphType.STAR: {
        const { width, height, offset, ...rest } = attrs
        return new Konva.Star({
          ...rest,
          numPoints: 5,
          innerRadius: 40,
          outerRadius: 15,
          offset: {
            x: 0,
            y: 0,
          },
        })
      }

      case GraphType.FAN: {
        const { width, height, offset, ...rest } = attrs
        return new Konva.Wedge({
          ...rest,
          radius: 50,
          angle: 90,
          offset: {
            x: 0,
            y: 0,
          },
        })
      }

      case GraphType.CIRCLE: {
        const { width, height, offset, ...rest } = attrs
        return new Konva.Circle({
          ...rest,
          radius: 50,
          offset: {
            x: 0,
            y: 0,
          },
        })
      }
      case GraphType.LINE: {
        const { width, height, offset, ...rest } = attrs
        const points = [0, 50, 140, 50, 250, 50, 300, 50]
        const centerX = (points[points.length - 2] + points[0]) / 2
        const centerY = (points[1] + points[points.length - 1]) / 2
        return new Konva.Line({
          ...rest,
          ...data,
          fill: 'black',
          points: points,
          stroke: 'black',
          lineCap: 'round',
          lineJoin: 'round',
          width: 100,
          strokeWidth: 2,
          offset: {
            x: centerX,
            y: centerY,
          },
        })
      }
       
      case GraphType.ELLIPSE: {
        const { width, height, offset, ...rest } = attrs
        return new Konva.Ellipse({
          ...rest,
          radiusX: 50,
          radiusY: 25,
          offset: {
            x: 0,
            y: 0,
          },
        })
      }

      case GraphType.ARROW: {
        const { width, height, offset, ...rest } = attrs
        const points = [0, 50, 140, 50]
        const centerX = (points[points.length - 2] + points[0]) / 2
        const centerY = (points[1] + points[points.length - 1]) / 2
        return new Konva.Arrow({
          ...rest,
          ...data,
          pointerLength: 5,
          pointerWidth: 5,
          fill: 'black',
          points: points,
          stroke: 'black',
          strokeWidth: 3,
          offset: {
            x: centerX,
            y: centerY,
          },
        })
      }

      case TextType.TEXT: {
        const { width, height, offset, ...rest } = attrs
        return new Konva.Text({
          ...rest,
          ...data,
          text: '雙擊編輯文本',
          fontSize: 24,
          fontStyle: '',
          width: 170,
          strokeWidth: 0,
          align: 'left',
          padding: 10,
          fill: 'black',
          offset: {
            x: 170 / 2,
            y: 40 / 2,
          },
        })
      }
      default:
        break
    }
  }
}

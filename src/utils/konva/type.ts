export enum ShapeType {
  RECT = 'rect',
  PARALLELOGRAM = 'parallelogram',
  RHOMBUS = 'rhombus',
  REGULARPOLYGON = 'regularPolygon',
  LINE = 'line',
  ARROW = 'arrow',
  CIRCLE = 'circle',
  PENTAGON = 'pentagon',
  HEXAGON = 'hexagon',
  STAR = 'star',
  TRAPEZIUM = 'trapezium',
  FAN = 'fan',
  CANVAS = 'canvas',
  BOARD = 'board',
  ELLIPSE = 'ellipse',
}
export enum TextType {
  TEXT = 'text',
}

export interface IText {
  name: string
  icon: string
  type: TextType
}
export interface IShape {
  name: string
  icon: string
  type: ShapeType
}

export interface IMenuList {
  name: string
  type: string
  disabled: boolean
}

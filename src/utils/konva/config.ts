import { IShape, IText, IMenuList } from './type'
import { ShapeType, TextType } from '@/utils/konva/type'

export const shapeList: IShape[] = [
  { name: '矩形', icon: 'icon-juxing', type: ShapeType.RECT },
  {
    name: '平行四邊形',
    icon: 'icon-tx-pinghangsibianxing',
    type: ShapeType.PARALLELOGRAM,
  },
  { name: '菱形', icon: 'icon-tubiao', type: ShapeType.RHOMBUS },
  { name: '直線', icon: 'icon-line', type: ShapeType.LINE },
  // { name: '箭頭', icon: 'icon-xiaoyoujiantou', type: ShapeType.ARROW },
  { name: '圓形', icon: 'icon-yuanxingweixuanzhong', type: ShapeType.CIRCLE },
  { name: '橢圓', icon: 'icon-tuoyuanxing', type: ShapeType.ELLIPSE },
  { name: '五邊形', icon: 'icon-pentagon', type: ShapeType.PENTAGON },
  { name: '六邊形', icon: 'icon-tx-liubianxing', type: ShapeType.HEXAGON },
  { name: '星形', icon: 'icon-wujiaoxing', type: ShapeType.STAR },
  { name: '扇形', icon: 'icon-shanxing', type: ShapeType.FAN },
]
export const text: IText = {
  name: '文本',
  icon: 'icon-wenben',
  type: TextType.TEXT,
}

export const menuList: IMenuList[] = [
  { name: '上移', type: 'moveUp', disabled: false },
  { name: '下移', type: 'moveDown', disabled: false },
  { name: '刪除', type: 'destroy', disabled: false },
]

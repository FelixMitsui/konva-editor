import { IGraph, GraphType, IMenuList } from './type'
export const graphList: IGraph[] = [
  { name: '矩形', icon: 'icon-juxing', type: GraphType.RECT },
  {
    name: '平行四邊形',
    icon: 'icon-tx-pinghangsibianxing',
    type: GraphType.PARALLELOGRAM,
  },
  { name: '菱形', icon: 'icon-tubiao', type: GraphType.RHOMBUS },
  { name: '直線', icon: 'icon-line', type: GraphType.LINE },
  { name: '箭頭', icon: 'icon-xiaoyoujiantou', type: GraphType.ARROW },
  { name: '圓形', icon: 'icon-yuanxingweixuanzhong', type: GraphType.CIRCLE },
  { name: '橢圓', icon: 'icon-tuoyuanxing', type: GraphType.ELLIPSE },
  { name: '五邊形', icon: 'icon-pentagon', type: GraphType.PENTAGON },
  { name: '六邊形', icon: 'icon-tx-liubianxing', type: GraphType.HEXAGON },
  { name: '星形', icon: 'icon-wujiaoxing', type: GraphType.STAR },
  { name: '扇形', icon: 'icon-shanxing', type: GraphType.FAN },
]
export const menuList: IMenuList[] = [
  { name: '上移', type: 'moveUp', disabled: false },
  { name: '下移', type: 'moveDown', disabled: false },
  { name: '複製', type: 'clone', disabled: false },
  { name: '刪除', type: 'destroy', disabled: false },
]

import Konva from 'konva'
import { IMenuList, GraphType, TextType } from '@/utils/konva/type'
import { menuList } from './config'
import Listener from './listener'
import Drawer from './drawer'
import Controller from './controller'
import Animation from './animation'
export class KonvaJS {
  [x: string]: any
  public id: string
  public stage: Konva.Stage | null
  public layer: Konva.Layer | null
  public transf: Konva.Transformer | null
  public group: Konva.Group | null
  public currentLayerIndex: number
  public zoom: number
  public type: GraphType | TextType | null
  public video: VideoFrame | null
  public isMenuVisible: boolean
  public isUpdateSideLayer: boolean
  public isScreen: boolean
  public selectTarget: Konva.Node
  public menuList: IMenuList[]
  public slideshows: {
    layer: Konva.Layer
    group: Konva.Group
    transf: Konva.Transformer
    anim: Array<{ tween: Konva.Tween; type: string }>
  }[]
  private listener: Listener
  public drawer: Drawer
  public controller: Controller
  public animation: Animation
  public animCount: number
  constructor(id: string) {
    //div標籤 id屬性
    this.id = id
    //選取目標的類型
    this.type = null
    this.stage = null
    this.screen = null
    this.layer = null
    this.transf = null
    this.group = null
    this.currentLayerIndex = 0
    this.video = null
    this.isScreen = false
    this.zoom = 1
    //控制目標顯示隱藏選單
    this.isMenuVisible = false
    //控制左側圖層區域更新
    this.isUpdateSideLayer = true
    //不同圖層容器
    this.slideshows = []
    //選取目標屬性
    this.selectTarget = new Konva.Rect({})
    //隱藏選單內容
    this.menuList = menuList
    this.listener = new Listener(this)
    this.drawer = new Drawer(this)
    this.controller = new Controller(this)
    this.animation = new Animation(this)
    this.animCount = 0
  }
  init() {
    const el = document.getElementById(this.id)
    if (!el) {
      return
    }
    const { clientWidth, clientHeight } = el
    const x = clientWidth / 2 - clientWidth / 2
    const y = clientHeight / 2 - clientHeight / 2
    //此處建立主舞台
    this.stage = new Konva.Stage({
      container: this.id,
      width: clientWidth,
      height: clientHeight,
      x: x,
      y: y,
      draggable: false,
      isEdit: false,
      type: GraphType.STAGE,
    })
    //建立圖層
    const { layer, group, transf } = this.newLayer()
    this.layer = layer
    this.group = group
    this.transf = transf
    this.layer.add(this.transf)
    this.layer.add(this.group)
    this.stage.add(this.layer)
    this.listener.stageEvent()
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
  //建立圖層
  newLayer() {
    const layer = new Konva.Layer({})
    const group = new Konva.Group()
    const transf = new Konva.Transformer()
    const canvas = this.drawer.newCanvas()
    if (canvas) {
      group.add(canvas)
    }
    layer.add(group)
    this.slideshows.push({
      anim: [],
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
  //新增影片
  addVideo() {
    const input = document.getElementById('videoInput')
    if (!input) return
    const video = document.createElement('video')

    const videoChange = (event: { target: { files: any[] } }) => {
      const file = event.target.files[0]
      if (!file) return
      const src = URL.createObjectURL(file)
      video.src = src

      video.addEventListener('loadedmetadata', () => {
        video.controls = true
        const target = this.group?.findOne(
          (node: Konva.Node) => node.attrs.type === 'canvas',
        )
        if (!target) return
        const rect = new Konva.Image({
          image: video,
          name: 'video',
          type: GraphType.RECT,
          id: this.getUUID(),
          draggable: true,
          isEdit: true,
          width: 500 * target.scaleX(),
          height: 281 * target.scaleY(),
          x: 0,
          y: 0,
        })

        const position = rect.getAbsolutePosition()
        video.style.position = 'absolute'
        video.style.left = `${position.x}px`
        video.style.top = `${position.y}px`
        video.style.zIndex = '0'
        video.style.background = 'black'
        video.style.width = `${500 * target.scaleX()}px`
        video.style.height = `${281 * target.scaleY()}px`
        this.stage?.container()?.appendChild(video)
        this.group?.add(rect)
        this.layer?.draw()
        this.selectTarget = rect
      })

      video.addEventListener('error', (e) => {
        URL.revokeObjectURL(src)
        console.log(e.message)
      })
    }

    video.addEventListener('blur', function () {
      video.remove()
    })
    input.removeEventListener('change', videoChange)
    input.addEventListener('change', videoChange)
  }
}

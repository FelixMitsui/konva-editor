import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'
import router from '@/router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import './styles/index.scss'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

zhCn.el.colorpicker.confirm = '確定'
const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})

app.use(pinia)
app.use(router)
app.mount('#app')

<template>
  <div class="container">
    <el-button size="small" @click="handleOpenVideo">開啟</el-button>
    <video ref="selfRef" style="width: 100%; height: 100%" autoplay></video>
    <i class="fi fi-bs-cross-circle cross" @click="handleHideContent"></i>
  </div>
</template>
<script lang="ts" setup>
import { inject, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const toggleSettingRef: Ref<string | null> = inject('toggleSettingRef')!
const selfRef = ref<HTMLVideoElement>()
let socket: WebSocket | null = null
const handleHideContent = () => {
  toggleSettingRef.value = null
}

const initWebsocket = () => {
  socket = new WebSocket('wss://localhost:5001')
  if (socket == null) return

  socket.onopen = () => {
    console.log('已連接')
  }

  socket.onclose = () => {
    console.log('已關閉')
  }
  socket.onmessage = (event) => {
    const { code, data } = JSON.parse(event.data)
    if (code === 'connect') {
      console.log('連接成功')
    } else if (code === 'offer') {
      console.log('offer')
    } else if (code === 'answer') {
      console.log('answer')
    }
  }
  socket.onerror = (event) => {
    console.error(event)
  }
}

const handleOpenVideo = () => {

  console.log(route.query.id)
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      if (selfRef.value) {
        selfRef.value.srcObject = stream
        initWebsocket()
      }
    })
    .catch(function (error) {
      console.error('無法取得視訊鏡頭：', error)
    })
}


</script>
<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  background: white;
  position: fixed;
  top: 75vh;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 500;
}
.el-button {
  font-weight: 700;
  padding: 1.5rem 0.5rem;
  height: 100%;
  writing-mode: vertical-lr;
}

.cross {
  font-size: 20px;
  position: fixed;
  top: 76vh;
  right: 10px;
}
@media screen and (min-width: 768px) {
  .container {
    position: static;
  }

  .el-button {
    padding: 0.5rem 0.5rem;
    margin: 0.5rem;
    writing-mode: horizontal-tb;
  }

  .cross {
    display: none;
  }
}
</style>

<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index">
        {{ msg }}
      </div>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="輸入訊息..."
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

const messages = ref([])
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    socket.emit('message', newMessage.value)
    newMessage.value = ''
  }
}

onMounted(() => {
  socket.on('connect', () => {
    console.log('已連線至伺服器')
  })

  socket.on('disconnect', () => {
    console.log('已與伺服器斷線')
  })

  socket.on('message', (msg) => {
    messages.value.push(msg)
  })
})
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
}
.chat-messages {
  border: 1px solid #ccc;
  height: 300px;
  overflow-y: scroll;
  padding: 10px;
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>

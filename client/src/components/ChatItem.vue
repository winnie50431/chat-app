<template>
  <div class="chat-container">
    <div v-if="!userName" class="login-form">
      <input
        v-model="tempUserName"
        @keyup.enter="setUser"
        placeholder="請輸入你的名字..."
      />
      <button @click="setUser">開始聊天</button>
    </div>
    <div v-else>
      <div class="chat-header">
        <span>歡迎, {{ userName }}</span>
      </div>
      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <div class="message-header">
            <span class="username">{{ msg.user?.name || '未知使用者' }}</span>
            <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
          </div>
          <div class="message-content">{{ msg.content || msg }}</div>
        </div>
      </div>
      <div class="chat-input">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="輸入訊息..."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')
const messages = ref([])
const newMessage = ref('')
const userName = ref('')
const tempUserName = ref('')
const userId = ref('')

const setUser = () => {
  if (tempUserName.value.trim()) {
    userName.value = tempUserName.value
    socket.emit('setUser', {
      name: userName.value
    })
  }
}

const sendMessage = () => {
  if (newMessage.value.trim() && userId.value) {
    socket.emit('message', {
      content: newMessage.value
    })
    newMessage.value = ''
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  socket.on('connect', () => {
    console.log('已連線至伺服器')
  })

  socket.on('disconnect', () => {
    console.log('已與伺服器斷線')
  })

  socket.on('userSet', (data) => {
    userId.value = data.userId
    console.log('使用者 ID 已設定：', userId.value)
  })

  socket.on('message', (msg) => {
    messages.value.push(msg)
  })

  socket.on('error', (error) => {
    console.error('錯誤：', error)
  })
})
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.login-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.chat-header {
  padding: 10px;
  border-radius: 8px 8px 0 0;
  margin-bottom: 10px;
}

.chat-messages {
  border: 1px solid #111;
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 0 0 8px 8px;
}

.message {
  margin-bottom: 15px;
  padding: 8px;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.username {
  font-weight: bold;
  color: #333;
}

.timestamp {
  font-size: 0.8em;
  color: #666;
}

.message-content {
  margin-left: 32px;
  background: #aaa;
  border-radius: 8px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}
</style>

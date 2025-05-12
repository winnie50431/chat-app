<template>
  <div class="chat-container">
    <div v-if="!userName" class="login-form">
      <input
        v-model="tempUserName"
        @keyup.enter="setUser"
        placeholder="請輸入你的名字..."
      />
      <button class="chat-button" @click="setUser">開始聊天</button>
    </div>
    <div v-else>
      <div class="chat-header">
        <span>歡迎, {{ userName }}</span>
      </div>
      <div class="chat-messages">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          class="message"
          :class="{ 'message-own': msg.user?.id === userId }"
        >
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

const socket = io('https://chat-server-ckpa.onrender.com')
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

<style lang="scss" scoped>
$dark-gray: #343A40;
$blue: #3B7DCD;
$white: #FFFFFF;
$light-gray: #F8F9FA;

.chat-button {
  background: $blue;
  color: $white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.chat-button:hover {
  cursor: pointer;
}

.chat-container {
  max-width: 400px;
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
  background: $dark-gray;
  color: $white;  
}

.chat-messages {
  border: 1px solid #111;
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 0 0 8px 8px;
  background: $light-gray;
}

.message {
  margin-bottom: 15px;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.message-own {
  align-items: flex-end;
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
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  background: #E9ECEF;
  color: #333;
  overflow-wrap: break-word;
  text-align: left;
}

.message-own .message-content {
  background: $blue;
  color: $white;
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
  background: #646cff;
}
</style>

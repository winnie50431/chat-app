const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// 儲存使用者資訊
const users = new Map();

io.on('connection', (socket) => {
  console.log('使用者已連線');
  
  // 使用者加入時設定身份
  socket.on('setUser', (userData) => {
    const userId = uuidv4();
    users.set(socket.id, {
      id: userId,
      name: userData.name,
      avatar: userData.avatar || null,
      socketId: socket.id
    });
    console.log('使用者已設定身份：', userData.name);
    // 回傳使用者 ID 給客戶端
    socket.emit('userSet', { userId });
  });

  socket.on('message', (msg) => {
    const user = users.get(socket.id);
    if (!user) {
      socket.emit('error', '請先設定使用者身份');
      return;
    }

    const messageWithUser = {
      id: uuidv4(),
      content: msg.content,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      timestamp: new Date().toISOString()
    };

    console.log('收到訊息：', messageWithUser);
    io.emit('message', messageWithUser);
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log('使用者已離線：', user.name);
      users.delete(socket.id);
    }
  });
});

server.listen(3000, () => {
  console.log('伺服器運行於 http://localhost:3000');
});

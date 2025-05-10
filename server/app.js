const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('使用者已連線');

  socket.on('message', (msg) => {
    console.log('收到訊息：', msg);
    io.emit('message', msg); // 廣播給所有連線的客戶端
  });

  socket.on('disconnect', () => {
    console.log('使用者已離線');
  });
});

server.listen(3000, () => {
  console.log('伺服器運行於 http://localhost:3000');
});

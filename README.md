# chat-app

這個專案是一個使用Vue3和Socket.IO開發的即時聊天應用程式，
使用者可在線上進行即時的文字對話。

## 使用說明

使用者可以輸入自己的名字開始聊天，且能夠發送和接收訊息。訊息會即時顯示在聊天視窗中，並且會顯示發送者的名字和訊息發送時間。

可至 [LIVE DEMO](https://starlit-dusk-5e40ff.netlify.app/) 進行實際操作。

## 技術

**Client**

- vue3 + vite
- sass/scss

**Server**

- node.js + express
- socket.io
- uuid

## Roadmap

[v] socket server開發  
[v] 可在網頁傳送、接收訊息  
[v] 識別不同的使用者  
[v] 完成部署  

[ ] 聊天室功能：新增、進入指定聊天室/ 隨機配對聊天室

-----

### code review & 優化項目

- 改用 .env 控制環境變數
- UI介面美化
- 改用符合設計模式規範的class命名
- 檢查 coding style
- 補上 formatter


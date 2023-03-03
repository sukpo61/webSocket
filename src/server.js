import http from "http";
import SocketIo from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
//어느 곳으로 가도 홈으로 이동
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`listening on http://localhost:3000`);

//emit 보내기
//on 받기
//http, ws 모두 작동
const httpServer = http.createServer(app);
const wsServer = SocketIo(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`socket Event:${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    //roomName이라는 방을 만들어 참가
    socket.join(roomName);
    //프론트에서 받은 함수를 프론트에서 실행(뭔가를 담아서 보낼수도있음)
    done();
    //roomName이라는방에 자신을 제외한 welcome이라는 이벤트를 받는 모두에게 보냄
    socket.to(roomName).emit("welcome");
  });
});

// const wss = new WebSocket.Server({ server });
// wss.on("connection", (socket) => {
//   //connection이 일어나면 모두 나오는 것들
//   console.log("connected to browser");
//   //브라우저 닫는걸 감지
//   socket.on("close", () => console.log("disconnected form browser"));
//   //브라우저에서 메세지 받는걸 감지
//   socket.on("message", (message) => {
//     console.log(message.toString());
//   });
//   //브라우저에게 보냄
//   socket.send("hello@");
// });

httpServer.listen(3000, handleListen);

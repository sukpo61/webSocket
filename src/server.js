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

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    // if (sids.get(key) === undefined) {
    publicRooms.push(key);
    // }
  });
  return publicRooms;
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms
}

//emit 보내기
//on 받기
//http, ws 모두 작동
const httpServer = http.createServer(app);
const wsServer = SocketIo(httpServer);
let userSocketId = [];

wsServer.on("connection", (socket) => {
  // socket["nickname"] = "Anon";
  // socket.onAny((event) => {
  //   console.log(`socket Event:${event}`);
  // });
  // socket.on("enter_room", (roomName, done) => {
  //   //roomName이라는 방을 만들어 참가
  //   socket.join(roomName);
  //   //프론트에서 받은 함수를 프론트에서 실행(뭔가를 담아서 보낼수도있음)
  //   done();
  //   //roomName이라는방에 자신을 제외한 welcome이라는 이벤트를 받는 모두에게 보냄
  //   socket.to(roomName).emit("welcome", socket.nickname);
  //   wsServer.sockets.emit("room_change", publicRooms());
  // });
  // socket.on("disconnecting", () => {
  //   socket.rooms.forEach((room) =>
  //     socket.to(room).emit("bye", socket.nickname)
  //   );
  // });
  // socket.on("disconnect", () => {
  //   wsServer.sockets.emit("room_change", publicRooms());
  // });
  // socket.on("new_message", (msg, room, done) => {
  //   socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
  //   done();
  // });
  // socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
  socket["nickname"] = "";

  socket.on("nickName", (myId, id) => {
    socket["nickname"] = `${myId}/${id}`;
    let newUserSocketId = userSocketId.filter((i) => {
      if (i.split("/")[0] === myId) {
        return;
      } else {
        return i;
      }
    });
    newUserSocketId.push(socket["nickname"]);
    userSocketId = newUserSocketId;
    console.log(userSocketId);
    wsServer.sockets.emit("userId", userSocketId);
  });

  socket.on("friendChat", (clickId, roomName) => {
    console.log(clickId, roomName);
    socket.join(roomName);
    wsServer.in(clickId.split("/")[1].toString()).socketsJoin(roomName);
    console.log("adddddaoter", wsServer.sockets.adapter);

    // socket.emit("friendId", publicRooms());
  });

  socket.on("friendMessage", (newChat) => {
    console.log(parseInt(newChat.roomId));
    socket.to(parseInt(newChat.roomId)).emit("friendNew_message", newChat);
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

httpServer.listen(4500, handleListen);

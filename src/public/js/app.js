const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const nickName = document.querySelector("#welcome #name");

room.hidden = true;

let roomName;

function addMessage(message) {
  //welcome을 받으면 실행되는 함수
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector("#name input");
  const value = input.value;
  console.log(value);

  socket.emit("nickname", value);
}

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
};

function handleRoomSubmit(event) {
  event.preventDefault();

  const input = form.querySelector("input");
  //enter_room이라는 이벤트를 생성해서 보냄
  //입력값과 함수를 보냄
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function handleNameSubmit(event) {
  event.preventDefault();
  console.log("work");
  const nameForm = welcome.querySelector("#name");
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

form.addEventListener("submit", handleRoomSubmit);
nickName.addEventListener("submit", handleNameSubmit);

socket.on("welcome", (user) => {
  //welcome이벤트를 받으면 함수를 실행시킴
  addMessage(`${user} joined`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left room`);
});

socket.on("new_message", addMessage);
const roomList = welcome.querySelector("ul");
socket.on("room_change", (rooms) => {
  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

// rooms.forEach((value, key) => {
//   if(sids.get(key) === undefined){
//       console.log(key)
//   }
// })

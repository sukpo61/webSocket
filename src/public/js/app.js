const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  //welcome을 받으면 실행되는 함수
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
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

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  //welcome이벤트를 받으면 함수를 실행시킴
  addMessage("someone joined");
});

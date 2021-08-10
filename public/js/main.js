const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from URL

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from the server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  //get message text
  const msg = event.target.elements.msg.value;

  //emit message to server
  socket.emit('chatMessage', msg);

  //clear input
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

//output message to DOM

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  chatMessages.appendChild(div);
}

//room name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

//add users to dom
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join('')}
  `;
}

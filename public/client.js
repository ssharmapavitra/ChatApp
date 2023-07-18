const socket = io();
let username;

const textarea = document.querySelector("#textarea");
const messageArea = document.querySelector(".message__area");

do {
	username = prompt("Please enter your name: ");
} while (!username);

textarea.addEventListener("keyup", (e) => {
	if (e.key === "Enter") {
		sendMessage(e.target.value);
	}
});

function sendMessage(message) {
	let msg = {
		user: username,
		message: message.trim(),
	};

	//Append
	appendMessage(msg, "outgoing");
	textarea.value = "";
	//Send to Server
	socket.emit("send message", msg);
}

function appendMessage(msg, type) {
	let mainDiv = document.createElement("div");
	let className = type;
	mainDiv.classList.add(className, "message");

	let markup = `
	<h4>${msg.user}</h4>
	<p>${msg.message}</p>
	`;

	mainDiv.innerHTML = markup;
	messageArea.appendChild(mainDiv);
	scrollToBottom();
}

function appendUser(msg) {
	let mainDiv = document.createElement("div");
	let className = msg.type;
	mainDiv.classList.add(className, "user");
	let markup = `${msg.user} ${msg.type}`;
	mainDiv.innerHTML = markup;
	messageArea.appendChild(mainDiv);
	scrollToBottom();
}

//Receive Message
socket.on("send message", (msg) => {
	appendMessage(msg, "incoming");
});

//Joining Chat
socket.on("connect", () => {
	let msg = {
		user: username,
		type: "joined",
	};
	socket.emit("user connection", msg);
});

//Receiving User Joining and Lefting info
socket.on("user connection", (msg) => {
	appendUser(msg);
});

function scrollToBottom() {
	messageArea.scrollTop = messageArea.scrollHeight;
}

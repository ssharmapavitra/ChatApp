const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const port = 3000;

const chatServer = new Server(server);

// app.get("/", (req, res) => {
// 	res.send("Hello World!");
// });

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

chatServer.on("connection", (socket) => {
	//When Connection is disconnected
	socket.on("disconnect", () => {
		console.log("Connection broke");
	});

	//Event Listener for message
	socket.on("chat message", (msg) => {
		console.log("message: " + msg);

		//Emmit Event
		chatServer.emit("chat from server", msg);
	});

	console.log("a user connection");
});

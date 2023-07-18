const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
	console.log(`Listening at port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

//Socket
const io = require("socket.io")(http);
io.on("connection", (socket) => {
	console.log("Connected...");
	socket.on("send message", (msg) => {
		socket.broadcast.emit("send message", msg);
	});
	socket.on("user connection", (msg) => {
		socket.li_chat_name = msg.user;
		socket.broadcast.emit("user connection", msg);
	});

	socket.on("disconnect", () => {
		let msg = {
			user: socket.li_chat_name,
			type: "left",
		};
		socket.broadcast.emit("user connection", msg);
	});
});

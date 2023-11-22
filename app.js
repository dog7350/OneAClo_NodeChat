var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.redirect("http://www.oneaclo.kro.kr")
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require("mongoose");
const chatLog = require("./config/mongo_config");

const http = require("http").createServer(app);
http.listen(8811, "0.0.0.0", () => { console.log("Chatting Server Starting...") });

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server : http });

wss.on('connection', (socket) => {
    console.log("클라이언트 연결");

    try {
        mongoose.connect('mongodb://oac:oac@43.202.160.36:27017/oneaclo', { useNewUrlParser: true }, (err, db) => {});
    } catch (e) {
        console.log(e);
    }
    mongoose.connection.on("error", console.error.bind(console, "연결 오류 : "));

    socket.on("message", (msg) => {
        const str = String(msg).split('|');

        const site = str[0];
        const img = str[1];
        const id = str[2];
        const ext = str[3];
        let content = str[4];
        const nick = content.split(':')[0];
        content = content.replace(nick + ": ", "");

        var chat = new chatLog();
        chat.site = site;
        chat.img = img;
        chat.id = id;
        chat.nick = nick;
        chat.ext = ext;
        chat.content = content;
        chat.save((err, data) => { if (err) { console.log(err); } });

        socket.send(msg);
    });

    socket.on("close", () => {
        console.log("클라이언트 종료");
        try {
            mongoose.disconnect();
        } catch (error) {
            console.log(error);
        }
    });
});
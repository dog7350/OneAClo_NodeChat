var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const mongoose = require("mongoose");
const chatLog = require("./config/mongo_config");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on('connection', (socket) => {
    try {
        mongoose.connect('mongodb://oac:oac@oneaclo.kro.kr:27017/oacChatLog', { useNewUrlParser: true }, (err, db) => {});
    } catch (e) {
        console.log(e);
    }
    mongoose.connection.on("error", console.error.bind(console, "연결 오류 : "));

    socket.on("chat message", (msg) => {
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

        io.emit('chat message', msg);
    });

    socket.on("disconnect", () => {
        try {
            mongoose.disconnect();
        } catch (error) {
            console.log(error);
        }
    });
});

http.listen(8811, "0.0.0.0", () => { console.log("Server Starting...") });
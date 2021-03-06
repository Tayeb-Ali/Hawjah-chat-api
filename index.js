let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let socketioJwt = require('socketio-jwt');
var myEnv = require('dotenv').config({ path: '.env' });
const typeorm = require("typeorm"); // import * as typeorm from "typeorm";
const UserChat = require("./models/UserChat").UserChat
const UserChatEntity = require("./entity/UserChatSchema");



let userObj = { id: null, name: null, }
const db = typeorm.createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "medical",
    synchronize: true,
    logging: false,
    entities: [
        UserChatEntity,
    ]
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

/* 
Accept connection and authorize token code
*/
io.on('connection', socketioJwt.authorize({
    secret: myEnv.JWT_SECRET,
    timeout: 15000
}));


io.on('connection', (socket) => {

    socket.on('disconnect', function() {
        io.emit('users-changed', { user: socket.username, event: 'left' });
    }); //end disconnect user funcation 

    socket.on('set-user', (user) => {
        socket.username = user.name;
        userObj = user;

        io.emit('users-changed', { user: user.name, event: 'joined' });
    }); // end socket response from user and save data in userObject.

    // start mysql conn
    socket.on('send-message', (message) => {
        let createdAt = new Date("2020-05-19 12:48:56")
        io.emit('message', { msg: message.text, user: socket.username, createdAt: createdAt });
        db.then(function(connection) {
            let userChat = new UserChat();
            userChat.message = message.text;
            userChat.from_user_id = userObj.id;
            userChat.to_user_id = 2;
            const userChatRepository = connection.getRepository("user_chat");
            userChatRepository.save(userChat)
                .then(function(savedChat) {
                    console.log("message has been saved: ", savedChat);
                    console.log("Now lets load all message: ");

                    return userChatRepository.find();
                })
                .catch(error => {
                    console.log('error: ', error)
                })
        }); //end of conn fun

    }); // socket response
});

var port = process.env.PORT || myEnv.PORT;

server.listen(port, function() {
    console.log('listening in http://localhost:' + port);
});
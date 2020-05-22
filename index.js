let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let socketioJwt = require('socketio-jwt');
var myEnv = require('dotenv').config({ path: '.env' });


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
    });

    socket.on('set-name', (name) => {
        socket.username = name;
        io.emit('users-changed', { user: name, event: 'joined' });
    });

    socket.on('send-message', (message) => {
        io.emit('message', { msg: message.text, user: socket.username, createdAt: new Date() });
    });
});


var port = process.env.PORT || myEnv.PORT;

server.listen(port, function() {
    console.log('listening in http://localhost:' + port);
});

/* 
When authenticated, send back userid + email over socket
*/
// io.on('authenticated', function(socket) {

//     socket.username = name;
//     io.emit('users-changed', { user: name, event: 'joined' });
//     console.log(socket.decoded_token);
//     socket.emit('user-id', socket.decoded_token.id);
//     socket.emit('name', socket.decoded_token.name);


//     // socket.on('public-my-message', function (data) {
//     // socket.emit('receive-my-message', data.msg);
//     socket.on('send-message', (message) => {
//         io.emit('message', { msg: message.text, user: socket.username, createdAt: new Date() });
//     });
//     // });


// });
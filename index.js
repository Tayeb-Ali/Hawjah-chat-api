let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let socketioJwt = require('socketio-jwt');
var myEnv = require('dotenv').config({ path: '.env' });
var mysql = require('mysql')

// mysql conn data
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medical'
})


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

    socket.on('set-user', (user) => {
        socket.username = user.name;
        io.emit('users-changed', { user: user.name, event: 'joined' });
    });

    // start mysql conn
    connection.connect()

    socket.on('send-message', (message) => {

        let createdAt = new Date()
        io.emit('message', { msg: message.text, user: socket.username, createdAt: createdAt });

        connection.query(`INSERT INTO users_chats
     ('from_user_id', 'to_user_id', 'message', 'date')
     VALUES (${user.id}, ${user.id}, ${message.text}, ${createdAt});    `, function(err, rows, fields) {
            if (err) throw err

            console.log('The solution is: ', rows[0].solution)
        })
        connection.end()

    });
    //end mysql conn

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
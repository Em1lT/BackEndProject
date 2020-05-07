
let io;
let socketHandler;

const connect = (server) => {
    io = require("socket.io")(server);
    io.on('connection', (socket) => {
      console.log('user connected');
      socketHandler = socket;
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    })  
}

const sendMessage = (msg) => {
    console.log(msg);
    io.emit('event', msg)
}

module.exports = {
    connect,
    sendMessage
}

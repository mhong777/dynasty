module.exports = function (io) {
    'use strict';
    
    
    io.on('connection', function(socket){
        socket.broadcast.emit('user connected');

         socket.on('send msg', function(msg){
            console.log(msg.user + ': ' + msg.msg); 
             io.emit('addChat', msg);
         });
    });    
        
};

let http = require('http').createServer();
let port = 9000;
http.listen(port, function(){console.log("Hosting on port " + port)})
let io = require('socket.io')(http,{
    cors: { origin: "*"}
})


io.on('connection', function(socket){
    console.log("User " + socket.id + " connection made") 

});
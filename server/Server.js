
let http = require("http").createServer();
let port = 9000;
http.listen(port, function(){console.log("Hosting on port " + port)})
let io = require("socket.io")(http,{
    cors: { origin: "*"}
})

let registeredUsers = [];


io.on("connection", function(socket){
    
    console.log("Connection Made")

    socket.on("RegisterUser", function(userdata)
    {
        console.log("User " + userdata + " connected");
        registeredUsers.push(userdata);
    });

    socket.on('disconnect', function() 
    {    
        console.log('user disconnected');  
    });
    
  
});


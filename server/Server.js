
let http = require("http").createServer();
let port = 9000;
http.listen(port, function(){console.log("Hosting on port " + port)})
let io = require("socket.io")(http,{
    cors: { origin: "*"}
})



class Player
{
    playerScore = 0;

    playerConnected = true;
    
    constructor(username, socketid) 
    {
            this.username = username;
            this.socketid = socketid;        
    }

}


let gameStarted = false;

let registeredUsers = [];


io.on("connection", function(socket)
{
    
    console.log("Connection Made")


    if(gameStarted == false)
    {
        socket.on("RegisterUser", function(userdata)
    {

        for (let index = 0; index < registeredUsers.length; index++) 
        {
            if(userdata == registeredUsers[index])
            {
                console.log("username " + userdata + " is already taken");
                socket.disconnect();
                return;
            }
        }

        console.log("User " + userdata + " connected. With socket id " + socket.id);
        registeredUsers.push(userdata);
    });

    }
    

    socket.on("disconnect", function() 
    {    
        console.log("user with id " + socket.id + " disconnected");  
    });
    
  
});


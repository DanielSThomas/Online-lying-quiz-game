
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


        socket.on("RegisterUser", function(userdata)
    {
        if(gameStarted == false)
        {
            for (let index = 0; index < registeredUsers.length; index++) 
            {
                if(userdata == registeredUsers[index].username)
                {
                    console.log("username " + userdata + " is already taken");
                    socket.disconnect();
                    return;
                }
            }
            console.log("User " + userdata + " connected. With socket id " + socket.id);
            let player = new Player(userdata,socket.id)
            registeredUsers.push(player);


            console.log("Current lobby---------------")
            for (let index = 0; index < registeredUsers.length; index++) 
            {
                console.log(registeredUsers[index].username)
                console.log(registeredUsers[index].socketid)
            }
       
        }

        else if(gameStarted == true)
        {
            //Reconnect player...
        } 

    })  

    
    

    socket.on("disconnect", function() 
    {    
        
        for (let index = 0; index < registeredUsers.length; index++) 
        {
            if(socket.id == registeredUsers[index].socketid)
            {
                console.log("user " + registeredUsers[index].username + " disconnected");  
                registeredUsers.splice(index,1);
            }
        }
    });
    
  
});


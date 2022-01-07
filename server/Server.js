const { emit } = require("process");
require('../PlayerClass.js');

// Server setup
let http = require("http").createServer();
let port = 5600;
http.listen(port, function(){console.log("Hosting on port " + port)})
let io = require("socket.io")(http,{
    cors: { origin: "*"}
})


// Classes
// class Player
// {
//     playerScore = 0;

//     playerConnected = true;
    
//     constructor(username, socketid) 
//     {
//             this.username = username;
//             this.socketid = socketid;        
//     }

// }


//Game Vars
let gameStarted = false;

let registeredUsers = [];


//Functions


//Server Things

io.on("connection", function(socket)
{
    
    console.log("Connection Made")


        socket.on("RegisterUser", function(userdata)
    {
        if(gameStarted == false)
        {
            for (let index = 0; index < registeredUsers.length; index++) //Check all users for duplicate
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

                io.emit("updateplayerlobby", (registeredUsers[index].username));
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
        {
            for (let index = 0; index < registeredUsers.length; index++) 
            {
                if(socket.id == registeredUsers[index].socketid)
                {
                    console.log("user " + registeredUsers[index].username + " disconnected");  


                    if (gameStarted == false) // Fully disconnect the player
                    {
                    registeredUsers.splice(index,1);
                    }
                    else if (gameStarted == true)
                    {
                    registeredUsers[index].disconnect = true;
                    }
                }
            }
        }
        
    });
    
  
});


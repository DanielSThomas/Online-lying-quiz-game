const { emit, disconnect } = require("process");

const Player = require("../classes/PlayerClass.js");

// Server setup
let http = require("http").createServer();
let port = 5600;
http.listen(port, function(){console.log("Hosting on port " + port)})
let io = require("socket.io")(http,{
    cors: { origin: "*"}
})




//Game Vars
let gameStarted = false;

let registeredUsers = [];


//Functions


//Server Things

io.on("connection", function(socket)
{
    
    console.log("Connection Made by " + socket.id)

        socket.on("RegisterUser", function(userdata)
    {
        if(gameStarted == false)
        {
            for (let index = 0; index < registeredUsers.length; index++) //Check all users for duplicate
            {
                if(userdata == registeredUsers[index].username)
                {
                    console.log("Username " + userdata + " is already taken, disconnect user");
                    socket.disconnect();
                    return;
                }
            }

            console.log("User " + userdata + " registered. With socket id " + socket.id);

            let player = new Player(userdata,socket.id)

            player.playerConnected = true;

            registeredUsers.push(player);

            io.emit("updateLocalRegisteredUsers", (registeredUsers));
                
        }
        else if (gameStarted == true)
        {
            console.log("Game already started, disconnect user");
            socket.disconnect();
        }

    })  


    socket.on("gameStart", function()
    {

        gameStarted = true;
        
        io.emit("gameStarted");
        console.log("Game Starting")
    })
    
    

    
    socket.on("disconnect", function() 
    {    
        {
            for (let index = 0; index < registeredUsers.length; index++) 
            {
                if(socket.id == registeredUsers[index].socketid)
                {
                    console.log("user " + registeredUsers[index].username + " disconnected");  
                    registeredUsers[index].playerConnected = false;

                   // disconnect the player
                    registeredUsers.splice(index,1);

                    io.emit("updateLocalRegisteredUsers", (registeredUsers));

                    if (registeredUsers.length == 0)
                    {
                     //End game
                        gameStarted = false;
                        console.log("All players disconnected, endding game.")
                    }
                    
                    
                        
                    }
                }
            }
        }
        
    );
    
  
});


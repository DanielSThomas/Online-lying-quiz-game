const { emit, disconnect } = require("process");

const Player = require("../classes/PlayerClass.js");
const Question = require("../classes/QuestionClass.js");
const Round = require("../classes/RoundClass.js");
const FakeAnswer = require("../classes/FakeAnswerClass.js");

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

let questions = [];

let rounds = [];

let currentRoundNumber = 0;

let playersSelectedCount = 0;

let maxRounds = 3;


function CreateRounds(howManyRounds) 
{
    rounds = [];
    for (let index = 0; index < howManyRounds; index++) 
    {
        let round = new Round(index,questions[index]);
        rounds.push(round);      
    }
}

function CreateQuestions()
{
    questions = [];
    let hardcodedquestion01 = new Question(01,"What is 2+2","4");

    let hardcodedquestion02 = new Question(02,"What is 8+8","16");

    let hardcodedquestion03 = new Question(03,"What is the meaning of life","42");

    questions.push(hardcodedquestion01);
    questions.push(hardcodedquestion02);
    questions.push(hardcodedquestion03);

}

function SetupAnswer() 
{
    let allAnswers = [];


    for (let index = 0; index < rounds[currentRoundNumber].roundFakeAnswers.length; index++) 
    {
        allAnswers.push(rounds[currentRoundNumber].roundFakeAnswers[index].fakeAnswer);
    }

    allAnswers.push(rounds[currentRoundNumber].roundAnswer);

    allAnswers.sort(() => Math.random() - 0.5);

    return allAnswers;
    
}

//Server Things

io.on("connection", function(socket)
{
    
    console.log("Connection Made by " + socket.id)

        socket.on("registerUser", function(userdata)
    {
        if(gameStarted == false)
        {
            for (let index = 0; index < registeredUsers.length; index++) //Check all users for duplicate
            {
                if(userdata == registeredUsers[index].username)
                {
                    console.log("Username " + userdata + " is already taken, disconnect user");
                    io.emit("errormsg",("Username " + userdata + " is already taken"))
                    socket.disconnect();
                    return;
                }
            }

            console.log("User " + userdata + " registered. With socket id " + socket.id);

            let player = new Player(userdata,socket.id)

            player.playerConnected = true;

            registeredUsers.push(player);

            io.emit("registerSuccess");

            io.emit("updateLocalRegisteredUsers", (registeredUsers));
                
        }
        else if (gameStarted == true)
        {
            io.emit("errormsg",("Game already started"))

            console.log("Game already started, disconnect user");
            socket.disconnect();
        }

    })  


    socket.on("gameStart", function()
    {
        gameStarted = true;

        CreateQuestions();
        
        CreateRounds(maxRounds);

        
        io.emit("gameStarted");
        console.log("Game Starting")
    })

    socket.on("roundStart",function() 
    {
        
        console.log("New Round. Round : " + currentRoundNumber)
        playersSelectedCount = 0;
        io.emit("getRoundInfo",(rounds[currentRoundNumber]));
        io.emit("roundStarted")
        

    })

    

    socket.on("fakeanswer",function(fakeAnswer)
    {
         
    //Check answer is not the actual answer   
    if(fakeAnswer.fakeAnswer == rounds[currentRoundNumber].roundAnswer)
    {
        socket.emit("errormsg","Nope: Answer already taken. Try another.")
        return;
    }        
        
    //Check for duplicate answers
    for (let index = 0; index < rounds[currentRoundNumber].roundFakeAnswers.length; index++) 
    {
        if(fakeAnswer.fakeAnswer == rounds[currentRoundNumber].roundFakeAnswers[index].fakeAnswer)
        {
            socket.emit("errormsg","Nope: Answer already taken. Try another.")
            return;
        }
    }        
            
    rounds[currentRoundNumber].roundFakeAnswers.push(fakeAnswer);
    console.log("Got fake answer " + fakeAnswer.fakeAnswer + " From " + fakeAnswer.owner)

    socket.emit("validfakeanswer");

    if(rounds[currentRoundNumber].roundFakeAnswers.length == registeredUsers.length)
    {
        console.log("Got all fake answers, continuing game");

        io.emit("gatherdAllFakeAnswers");

        io.emit("getAnswers",(SetupAnswer()))
    }
        
        
    })

    socket.on("selectedanswer",function(selectedAnswer) 
    {

        let _owner = selectedAnswer[0];
        let _selectedAnswer = selectedAnswer[1];

        playersSelectedCount ++;

        for (let i = 0; i < rounds[currentRoundNumber].roundFakeAnswers.length; i++) 
        {
            if(_selectedAnswer == rounds[currentRoundNumber].roundFakeAnswers[i].fakeAnswer)
            {
                
                for (let j = 0; j< registeredUsers.length; j++) 
                {
                    if(rounds[currentRoundNumber].roundFakeAnswers[i].owner == registeredUsers[j].username)
                    {
                        registeredUsers[j].playerScore ++;

                        rounds[currentRoundNumber].roundFakeAnswers[i].playersTricked.push(_owner);

                        console.log(registeredUsers[j].username + " Just scored from tricking "+  (_owner)  +". Total score is: " + registeredUsers[j].playerScore);
                    }
                    
                }
            } 
            
        }
        if (_selectedAnswer == rounds[currentRoundNumber].roundAnswer)
        {
            for (let j = 0; j < registeredUsers.length; j++) 
            {
                if(_owner == registeredUsers[j].username)
                {
                    registeredUsers[j].playerScore ++;

                    rounds[currentRoundNumber].roundQuestion.correctPlayers.push(_owner); // check this works

                    console.log(registeredUsers[j].username + " Just scored by getting the right answer. Total score is: " + registeredUsers[j].playerScore);
                }
             }
        }

        if(playersSelectedCount == registeredUsers.length)
        {
            console.log("All players have selected an answer")
            io.emit("getRoundInfo",(rounds[currentRoundNumber]));
            io.emit("allPlayersAnswered");
            io.emit("getResults",(registeredUsers));
        }      


    })

    socket.on("roundEnd",function() 
    {
        
        currentRoundNumber ++;
        
        
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
                        currentRoundNumber = 0;
                        console.log("All players disconnected, endding game.")

                    }
                    
                    
                        
                    }
                }
            }
        }
        
    );
    
  
});


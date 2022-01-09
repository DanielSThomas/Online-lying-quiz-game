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

//Functions

    //Game loop

    //Open the fake answers popup to clients

    //Display the question & round to clients

    //Collect fake answers from clients

    //Wait for all users to give answer

    //Suffle answers

    //Open the pick correct answer popup

    //Display all answers

    //Collect user picked answers

    //Wait for all users

    //Calculate scoring, check if user answered correctly or picked another users fake answer

    //Give score to users who answered correctly and for every user that picked thier fake answer

    //Display what players picked, show real answer, display scores

    //open popup for total scores

    //end round, loop back to round start till all rounds complete. Other wise show final scores / winner.




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

    questions.push(hardcodedquestion01);
    questions.push(hardcodedquestion02);

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
        
        CreateRounds(2);
         
        io.emit("gameStarted");
        console.log("Game Starting")

        io.emit("getRoundInfo",(rounds[0]));

    })

    

    socket.on("fakeanswer",function(fakeAnswer)
    {


        let _fakeAnswer = new FakeAnswer(fakeAnswer[0],fakeAnswer[1]);
        

        rounds[currentRoundNumber].roundFakeAnswers.push(_fakeAnswer);
        console.log("Got fake answer " + fakeAnswer)

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

        for (let i = 0; i < rounds[currentRoundNumber].roundFakeAnswers.length; i++) 
        {
            if(_selectedAnswer == rounds[currentRoundNumber].roundFakeAnswers[i].fakeAnswer)
            {
                
                for (let j = 0; j< registeredUsers.length; j++) 
                {
                    if(rounds[currentRoundNumber].roundFakeAnswers[i].owner == registeredUsers[j].username)
                    {
                        registeredUsers[j].playerScore ++;
                        console.log(registeredUsers[j].username + " Just scored from tricking someone. Total score is: " + registeredUsers[j].playerScore);
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
                    console.log(registeredUsers[j].username + " Just scored by getting the right answer. Total score is: " + registeredUsers[j].playerScore);
                }
             }
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


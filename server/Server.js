const { emit, disconnect } = require("process");

const Player = require("../classes/PlayerClass.js");
const Question = require("../classes/QuestionClass.js");
const Round = require("../classes/RoundClass.js");
const FakeAnswer = require("../classes/FakeAnswerClass.js");
const QuestionSchema = require("../schemas/QuestionSchema.js");

//mongodb connection
const dbURIReadOnly = "mongodb+srv://Fib_User:Fib_Pass@fibtriviadb.flnrf.mongodb.net/FibTriviaDatabase?retryWrites=true&w=majority"
const dbURI = "mongodb+srv://Fib_Admin:Winter1@fibtriviadb.flnrf.mongodb.net/FibTriviaDatabase?retryWrites=true&w=majority"
const Mongoose = require("mongoose")
Mongoose.connect(dbURIReadOnly)
.then(()=>console.log("Connected to mongo database"))
.catch((err) => console.log(err));

// Server setup
let http = require("http").createServer();
let port = 5600;
http.listen(port, function(){console.log("Hosting on port " + port)})
let io = require("socket.io")(http,{
    cors: { origin: "*"}
})




//Server Global Vars
let gameStarted = false;

let registeredUsers = [];

let questions = [];

let rounds = [];

let currentRoundNumber = 0;

let playersSelectedCount = 0;

let dbquestions;



//Server Options
let maxRounds = 3;

questionCatagory = "standard_question"


GetQuestions(); 


function CreateRounds(howManyRounds) 
{
    rounds = [];
    for (let index = 0; index < howManyRounds; index++) 
    {
        let round = new Round(index,questions[index]);
        rounds.push(round);      
    }
}


async function GetQuestions() 
{

    dbQuestion = Mongoose.model(questionCatagory,QuestionSchema);

    dbquestions = await dbQuestion.find();

    questions = [];

    for (let index = 0; index < maxRounds; index++) 
    {

        randomnumber = Math.floor(Math.random() * dbquestions.length)

        let _question = new Question([index],dbquestions[randomnumber]._doc.questionContent,dbquestions[randomnumber]._doc.questionAnswer);
        questions.push(_question);
    }

    
    
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
                    socket.emit("errormsg",("Username " + userdata + " is already taken"))
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
            socket.emit("errormsg",("Game already started"))

            console.log("Game already started, disconnect user");
            socket.disconnect();
        }

    })  

    socket.on("updateSettings",function(settings) 
    {
        maxRounds = settings[0]
        questionCatagory = settings[1]

        GetQuestions();

    })


    socket.on("gameStart", function()
    {
        gameStarted = true;

        
        
        CreateRounds(maxRounds);

        
        io.emit("gameStarted");
        console.log("Game Starting")
        console.log("Rounds : " + maxRounds )
        console.log("Question Catagory : " + questionCatagory )
    })

    socket.on("roundStart",function() 
    {
        if (currentRoundNumber == maxRounds)
        {
            console.log("All rounds done, ending game");
            io.emit("gameEnded");
            return;
        }
        
        console.log("New Round. Round : " + currentRoundNumber);
        playersSelectedCount = 0;
        io.emit("getRoundInfo",(rounds[currentRoundNumber]));
        io.emit("roundStarted");
        

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


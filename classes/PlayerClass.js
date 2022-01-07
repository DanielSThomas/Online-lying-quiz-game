class Player
{
    constructor(username, socketid) 
    {
        this.username = username;
        this.socketid = socketid;        
    }

    playerScore = 0;

    playerConnected = false;
    
}

module.exports = Player
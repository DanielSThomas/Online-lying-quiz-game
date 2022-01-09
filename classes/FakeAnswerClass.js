class FakeAnswer
{
    constructor(owner, fakeAnswer) 
    {
        this.owner = owner;
        this.fakeAnswer = fakeAnswer;        
    }

    playersTricked = [];
    
}

module.exports = FakeAnswer
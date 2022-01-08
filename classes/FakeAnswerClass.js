class FakeAnswer
{
    constructor(owner, fakeAnswer) 
    {
        this.owner = owner;
        this.fakeAnswer = fakeAnswer;        
    }

    playersTricked = 0;
    
}

module.exports = FakeAnswer
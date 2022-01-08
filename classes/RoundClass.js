class Round
{
    constructor(roundNumber, roundQuestion) 
    {
        this.roundNumber = roundNumber;
        this.roundQuestion = roundQuestion;    
        
    }

    roundAnswer = this.roundQuestion.questionAnswer;

    roundFakeAnswers = [];



}

module.exports = Round
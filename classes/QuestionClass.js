class Question
{
    constructor(questionId, questionContent, questionAnswer) 
    {
        this.questionId = questionId;
        this.questionContent = questionContent;    
        this.questionAnswer = questionAnswer;     
    }
    correctPlayers = [];

}

module.exports = Question
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const questionSchema = new Schema(
    {
        questionContent: 
        {
            type: String,
            required: true
        },
        questionAnswer:
        {
            type: String,
            required: true
        }
    }, { id : true }
)

const dbQuestion = Mongoose.model("dbQuestion",questionSchema);
module.exports = dbQuestion;
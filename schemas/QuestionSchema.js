const Mongoose = require("../server/node_modules/mongoose");
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

const dbQuestion = Mongoose.model("Question",questionSchema);
module.exports = dbQuestion;
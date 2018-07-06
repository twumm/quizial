const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  answerCorrect: { type: String, max: 300, required: true },
  answerOption: [{ type: String, max: 300, required: true }],
});

module.exports = mongoose.model('Answer', AnswerSchema);

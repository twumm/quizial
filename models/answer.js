const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  answer: { type: String, max: 300, required: true },
  answerOption: [{ type: String, max: 300, required: true }],
  question: { type: Schema.ObjectId, ref: 'Question', required: true },
});
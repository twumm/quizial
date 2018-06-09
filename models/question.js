const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: { type: String, max: 1000, required: true },
  answer: [{ type: Schema.ObjectId, ref: 'Answer', required: true }],
  usersAnsweredCorect: [{ type: Schema.ObjectId, ref: 'User' }],
  submittedBy: { type: Schema.ObjectId, ref: 'User' },
  seenCount: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now }
});
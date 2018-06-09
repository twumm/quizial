const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: { type: String, max: 1000, required: true },
  usersCorrect: [{ type: Schema.ObjectId, ref: 'User' }],
  usersAttempted: [{ type: Schema.ObjectId, ref: 'User' }],
  submittedBy: { type: Schema.ObjectId, ref: 'User' },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now }
  // seenCount: { type: Number, default: 0 },
  // correctCount: { type: Number, default: 0 },
  // wrongCount: { type: Number, default: 0 },
});
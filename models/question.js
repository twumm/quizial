const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: { type: String, max: 1000, required: true },
  answer: { type: Schema.ObjectId, ref: 'Answer', required: true },
  usersCorrect: [{ type: Schema.ObjectId, ref: 'User'}],
  usersAttempted: [{ type: Schema.ObjectId, ref: 'User' }],
  submittedBy: { type: Schema.ObjectId, ref: 'User' },
  dateCreated: { type: Date, default: Date.now, required: true },
  dateUpdated: { type: Date, default: Date.now, required: true },
  // seenCount: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
});

// Count number of unique users who answered correctly.
/*QuestionSchema.statics.uniqueUsersCorrect = (questionID, count) => {
  
}*/

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;

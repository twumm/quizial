const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // first_name: { type: String, required: true, max: 60 },
  // last_name: { type: String, required: true, max: 60 },
  username: { type: String, unique: true, required: true, trim: true, max: 40, unique: true },
  email: { type: String, unique: true, required: true, trim: true, unique: true },
  password: { type: String, required: true }
  passwordConf: { type: String, required: true },
  birthday: Date,
  bio: { type: String, max: 2000 },
  friends: [{ type: Schema.ObjectId, ref: 'User' }],
  questionPosted: [{ type: Schema.ObjectId, ref: 'Question' }],
  questionSeen: [{ type: Schema.ObjectId, ref: 'Question' }],
  correctAnswer: Number,
  wrongAnswer: Number,

  // country: { type: String, required: true },
  // total_answered: Number,
  // streak: Number,
  // pluses: Number,
  // dp: { type: String, max: 300 }
});
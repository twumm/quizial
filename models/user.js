const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // first_name: { type: String, required: true, max: 60 },
  // last_name: { type: String, required: true, max: 60 },
  username: { type: String, unique: true, required: true, trim: true, max: 40, unique: true },
  email: { type: String, unique: true, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  passwordConf: { type: String, required: true },
  questionsPosted: [{ type: Schema.ObjectId, ref: 'Question' }],
  questionsAttempted: [{ type: Schema.ObjectId, ref: 'Question' }],
  questionsCorrect: [{ type: Schema.ObjectId, ref: 'Question' }]
    // birthday: Date,
    // bio: { type: String, max: 2000 },
    // friends: [{ type: Schema.ObjectId, ref: 'User' }],
    // country: { type: String, required: true },
    // dp: { type: String, max: 300 }
});
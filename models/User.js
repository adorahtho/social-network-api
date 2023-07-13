const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'Thought' 
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User' 
    }]
  }
)

const User = model('user', userSchema)

module.exports = User;
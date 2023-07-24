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
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'Thought' 
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User' 
    }],
  },
  {
    // Use the toObject() method with the transform option
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id; // Remove _id field from the nested objects
      },
    },
  }
)

userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = model('User', userSchema)

module.exports = User;
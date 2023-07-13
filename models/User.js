const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      
    }
  }
)

const User = model('user', userSchema)
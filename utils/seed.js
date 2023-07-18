const connection = require('../config/connnection')
const { User, Thought } = require('../models')
const { getRandomUsername } = require('./data')

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Delete the collections if they exist
  let userCheck = await connection.db.listCollections({ name: 'users'}).toArray()
  if (userCheck.length) {
    await connection.dropCollection('users')
  }
}

// const thought = `This is random thought number ${Math.floor(Math.random() * 200) + 1}.`
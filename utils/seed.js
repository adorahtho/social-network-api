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

  let thoughtCheck = await connection.db.listCollections({ name: 'thoughts '}).toArray()
  if (thoughtCheck) {
    await connection.dropCollection('thoughts')
  }

  const users = [];

  for (let i = 0; i < 20; i++) {
    const username = getRandomUsername();
    const email = `${username}@email.com`;
    const thoughts = `This is random thought number ${Math.floor(Math.random() * 200) + 1}.`
    const friends = getRandomUsername();

    users.push({
      username,
      email,
      thoughts,
      friends,
    })
  }
})


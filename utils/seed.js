const connection = require('../config/connection')
const { User, Thought } = require('../models')
const { getRandomUsername, getRandomThoughtText, getRandomReaction } = require('./data')
const mongoose = require('mongoose');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Delete the collections if they exist
  let userCheck = await connection.db.listCollections({ name: 'users'}).toArray()
  if (userCheck.length) {
    await connection.dropCollection('users')
  }

  let thoughtCheck = await connection.db.listCollections({ name: 'thoughts'}).toArray()
  if (thoughtCheck.length) {
    await connection.dropCollection('thoughts')
  }

  const usersData = [];
  const allUsernames = new Set();

  for (let i = 0; i < 20; i++) {
    let username
    do {
      username = getRandomUsername()
    } while (allUsernames.has(username))
    allUsernames.add(username)

    const email = `${username}@email.com`;

    usersData.push({
      username,
      email,
      thoughts: [],
      friends: [],
    })
  }

  const thoughtsData = []
  for (const user of usersData) {
    const thoughtText = getRandomThoughtText();
    const createdAt = new Date()
    const reactions = getRandomReaction(); 
    const thought = {
      _id: new mongoose.Types.ObjectId(),
      thoughtText,
      createdAt,
      username: user.username,
      reactions,
    }
    thoughtsData.push(thought);
  }

  await Thought.collection.insertMany(thoughtsData);

  for (const user of usersData) {
    const userThoughts = thoughtsData.filter((thought) => thought.username === user.username);
    user.thoughts.push(...userThoughts);

    const friendsCount = Math.min(Math.floor(Math.random() * 5), usersData.length - 1);
    const otherUsers = usersData.filter((u) => u.username !== user.username);
    for (let i = 0; i < friendsCount; i++) {
      const randomIndex = Math.floor(Math.random() * otherUsers.length);
      const friendId = otherUsers[randomIndex]._id;
      user.friends.push(friendId);
      // Remove the friend from the list to avoid duplicate friendships
      otherUsers.splice(randomIndex, 1);
    }
  }


  await User.collection.insertMany(usersData);

  console.table(usersData);
  console.info('Seeding complete! 🌱')
  process.exit(0);
})


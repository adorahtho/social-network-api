const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomArrItem, getRandomUsername, getRandomThoughtText, getRandomReaction } = require('./data');
const mongoose = require('mongoose');

connection.on('error', (err) => console.error('Error connecting to the database:', err));

connection.once('open', async () => {
  try {
    console.log('Connected to the database');

    // Delete existing collections
    await Promise.all([
      User.deleteMany({}),
      Thought.deleteMany({}),
    ]);

    // Generate and insert users
    const usersData = [];
    while (usersData.length < 20) {
      let username = getRandomUsername();
      const email = `${username}@example.com`;

      usersData.push({
        username,
        email,
        thoughts: [],
      });
    }
    const createdUsers = await User.insertMany(usersData);

    // Generate and insert thoughts
    const thoughtsData = [];
    for (const user of createdUsers) {
      for (let i = 0; i < 3; i++) {
        const thoughtText = getRandomThoughtText();
        const thought = new Thought({ thoughtText, username: user.username });
        thoughtsData.push(thought);
        user.thoughts.push(thought._id); // Push the thought _id into user's thoughts array
      }
    }
    await Thought.insertMany(thoughtsData);

    // Generate and insert reactions
    for (const thought of thoughtsData) {
      const reactionsData = [];
      for (let i = 0; i < 3; i++) {
        const reactionBody = getRandomReaction();
        const username = createdUsers[Math.floor(Math.random() * createdUsers.length)].username;
        reactionsData.push({
          reactionBody,
          username,
          thoughtId: thought._id,
        });
      }
      await Thought.collection.updateOne({ _id: thought._id }, { $set: { reactions: reactionsData } });
    }

    // Generate and insert friends
    for (const user of createdUsers) {
      const friendsCount = Math.min(Math.floor(Math.random() * 4) + 1, createdUsers.length - 1);
      const otherUsers = createdUsers.filter((u) => u.username !== user.username);

      for (let i = 0; i < friendsCount; i++) {
        const randomFriend = getRandomArrItem(otherUsers);
        user.friends.push(randomFriend._id); // Push only the _id value
        otherUsers.splice(otherUsers.indexOf(randomFriend), 1);
      }
      await user.save();
    }

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    connection.close();
    process.exit(0);
  }
});
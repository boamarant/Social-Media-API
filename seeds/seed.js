const mongoose = require('mongoose');
const db = require('../config/connection');
const { User, Thought } = require('../models');

// Sample data
const users = [
  {
    username: 'Jake',
    email: 'jake@gmail.com',
  },
  {
    username: 'Eric',
    email: 'eric@gmail.com',
  },
  {
    username: 'Grace',
    email: 'grace@gmail.com',
  },
  {
    username: 'Maya',
    email: 'maya@gmail.com',
  },
  {
    username: 'Thomas',
    email: 'thomas@gmail.com',
  },
];

const thoughts = [
  {
    thoughtText: "I'm taking a coding class right now, I'm learning a lot!",
    username: 'Jake',
  },
  {
    thoughtText: 'I just visited New York, I had some great food!',
    username: 'Eric',
  },
  {
    thoughtText: "Just got a new job, I'm super excited!",
    username: 'Grace',
  },
  {
    thoughtText: 'This new restaurant near my house is so good, they have amazing pizza.',
    username: 'Maya',
  },
  {
    thoughtText: 'I just bought a new game, anybody wanna play?',
    username: 'Thomas',
  },
];

// Function to seed the database
async function seedDatabase() {
  try {
    await db.once('open', async () => {
      console.log('Connected to the database');

      // Clear the existing data
      await User.deleteMany({});
      await Thought.deleteMany({});

      // Insert users
      const createdUsers = await User.insertMany(users);
      console.log('Users seeded!');

      // Insert thoughts and associate them with users
      for (const thought of thoughts) {
        const user = createdUsers.find((user) => user.username === thought.username);
        const newThought = await Thought.create({ ...thought, userId: user._id });
        await User.findByIdAndUpdate(user._id, { $push: { thoughts: newThought._id } });
      }

      console.log('Thoughts seeded!');

      // Close the connection
      mongoose.connection.close();
      console.log('Database seeding complete!');
    });
  } catch (error) {
    console.error('Error seeding the database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
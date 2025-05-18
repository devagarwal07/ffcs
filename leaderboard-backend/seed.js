require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Create test users
    const testUsers = [
      {
        name: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student'
      },
      {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin'
      }
    ];

    // Create users
    for (const user of testUsers) {
      try {
        await User.create(user);
        console.log(`Created user: ${user.email}`);
      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error.message);
      }
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

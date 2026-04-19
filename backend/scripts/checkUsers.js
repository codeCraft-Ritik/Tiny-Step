import connectDB from './config/database.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
  try {
    await connectDB();

    // Get all users (with password)
    const users = await User.find().select('+password');

    console.log('\n✅ USERS IN DATABASE:\n');
    
    if (users.length === 0) {
      console.log('No users found. Please signup first.');
    } else {
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`);
        console.log(`  ID: ${user._id}`);
        console.log(`  Name: ${user.firstName} ${user.lastName}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Password (Hashed): ${user.password}`);
        console.log(`  Active: ${user.isActive}`);
        console.log(`  Created: ${user.createdAt}`);
        console.log(`  Last Login: ${user.lastLogin || 'Never'}`);
        console.log('---\n');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();

import connectDB from '../config/database.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixDuplicateUsers = async () => {
  try {
    await connectDB();

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   🔍 Checking for Duplicate Users      ║');
    console.log('╚════════════════════════════════════════╝\n');

    // Get all users
    const allUsers = await User.find().select('+password');

    if (allUsers.length === 0) {
      console.log('❌ No users found in database. Please signup first.\n');
      process.exit(0);
    }

    console.log(`📊 Total users in database: ${allUsers.length}\n`);

    // Find duplicates by email
    const emailCounts = {};
    const duplicates = [];

    allUsers.forEach(user => {
      const email = user.email.toLowerCase();
      if (!emailCounts[email]) {
        emailCounts[email] = [];
      }
      emailCounts[email].push(user);
    });

    // Find emails with multiple users
    Object.entries(emailCounts).forEach(([email, users]) => {
      if (users.length > 1) {
        duplicates.push({ email, users });
      }
    });

    if (duplicates.length === 0) {
      console.log('✅ No duplicate emails found!\n');
    } else {
      console.log(`⚠️  Found ${duplicates.length} email(s) with duplicate accounts:\n`);

      for (const dup of duplicates) {
        console.log(`📧 Email: ${dup.email}`);
        console.log(`   Number of accounts: ${dup.users.length}`);
        dup.users.forEach((user, idx) => {
          console.log(`   ${idx + 1}. ID: ${user._id}`);
          console.log(`      Name: ${user.firstName} ${user.lastName}`);
          console.log(`      Created: ${user.createdAt}`);
          console.log(`      Last Login: ${user.lastLogin || 'Never'}`);
        });
        console.log('');
      }

      // Ask to remove duplicates
      console.log('🗑️  Removing duplicate accounts (keeping the latest)...\n');

      for (const dup of duplicates) {
        // Sort by creation date and keep the latest
        const sorted = dup.users.sort((a, b) => b.createdAt - a.createdAt);
        const keepUser = sorted[0];
        const removeUsers = sorted.slice(1);

        for (const removeUser of removeUsers) {
          await User.findByIdAndDelete(removeUser._id);
          console.log(`🗑️  Deleted duplicate account: ${removeUser._id} (Created: ${removeUser.createdAt})`);
        }
        console.log(`✅ Kept account: ${keepUser._id} (Created: ${keepUser.createdAt})\n`);
      }
    }

    // Show all users after cleanup
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   ✅ Final User List in Database       ║');
    console.log('╚════════════════════════════════════════╝\n');

    const finalUsers = await User.find().select('+password');

    finalUsers.forEach((user, idx) => {
      console.log(`User ${idx + 1}:`);
      console.log(`  ✓ ID: ${user._id}`);
      console.log(`  ✓ First Name: ${user.firstName}`);
      console.log(`  ✓ Last Name: ${user.lastName}`);
      console.log(`  ✓ Email: ${user.email}`);
      console.log(`  ✓ Password (Hashed): ${user.password.substring(0, 20)}...`);
      console.log(`  ✓ Email Verified: ${user.isEmailVerified}`);
      console.log(`  ✓ Active: ${user.isActive}`);
      console.log(`  ✓ Created: ${user.createdAt}`);
      console.log(`  ✓ Last Login: ${user.lastLogin || 'Never'}`);
      console.log(`  ✓ Children: ${user.children.length} child/children`);
      console.log('---\n');
    });

    console.log(`✅ Total verified users: ${finalUsers.length}\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

fixDuplicateUsers();

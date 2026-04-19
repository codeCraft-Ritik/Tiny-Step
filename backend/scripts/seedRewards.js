import Reward from '../models/Reward.js';
import User from '../models/User.js';

// Sample rewards data
const sampleRewards = [
  {
    title: 'Golden Star Sticker',
    description: 'Unlock a special golden star sticker for your collection',
    emoji: '⭐',
    rewardType: 'sticker',
    pointsRequired: 10,
    category: 'stickers',
    isActive: true,
    isOneTime: false,
  },
  {
    title: 'Trophy Badge',
    description: 'Earn the prestigious trophy badge for completing 5 tasks',
    emoji: '🏆',
    rewardType: 'badge',
    pointsRequired: 50,
    category: 'badges',
    isActive: true,
    isOneTime: false,
  },
  {
    title: 'Screen Time Pass',
    description: 'Get 30 minutes of extra screen time',
    emoji: '📱',
    rewardType: 'activity',
    pointsRequired: 75,
    category: 'screen-time',
    isActive: true,
    isOneTime: false,
  },
  {
    title: 'Ice Cream Treat',
    description: 'Enjoy a delicious ice cream with your family',
    emoji: '🍦',
    rewardType: 'activity',
    pointsRequired: 100,
    category: 'food',
    isActive: true,
    isOneTime: false,
  },
  {
    title: 'Special Outing',
    description: 'Plan a special outing to your favorite place',
    emoji: '🎢',
    rewardType: 'activity',
    pointsRequired: 150,
    category: 'outing',
    isActive: true,
    isOneTime: false,
  },
  {
    title: 'Toy Prize',
    description: 'Choose a new toy you\'ve been wanting',
    emoji: '🧸',
    rewardType: 'physical',
    pointsRequired: 200,
    category: 'toy',
    isActive: true,
    isOneTime: false,
  },
  {
    title: 'Golden Rocket Ship',
    description: 'Unlock the ultimate reward - a golden rocket ship badge',
    emoji: '🚀',
    rewardType: 'badge',
    pointsRequired: 300,
    category: 'badges',
    isActive: true,
    isOneTime: true,
  },
];

// Seed rewards to database
const seedRewards = async () => {
  try {
    console.log('🌱 Starting rewards seeding...');

    // Get a parent and child from the database
    const parent = await User.findOne({ role: 'parent' });
    
    if (!parent) {
      console.log('❌ No parent found. Please create a parent account first.');
      return;
    }

    // Check if parent has children
    if (!parent.familyChildren || parent.familyChildren.length === 0) {
      console.log('❌ Parent has no children. Please add children first.');
      return;
    }

    const childId = parent.familyChildren[0]._id; // Use first child

    // Insert sample rewards
    const rewardsToInsert = sampleRewards.map(reward => ({
      ...reward,
      parentId: parent._id,
      childId: childId,
    }));

    const result = await Reward.insertMany(rewardsToInsert);
    console.log(`✅ Successfully seeded ${result.length} rewards!`);
    console.log('📊 Sample rewards created:');
    result.forEach(reward => {
      console.log(`   - ${reward.emoji} ${reward.title} (${reward.pointsRequired} points)`);
    });

  } catch (error) {
    console.error('❌ Error seeding rewards:', error.message);
  }
};

export default seedRewards;

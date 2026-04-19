import Reward from '../models/Reward.js';
import Child from '../models/Child.js';
import User from '../models/User.js';
import ErrorHandler from '../utils/errorHandler.js';

// @desc    Get all rewards for a child
// @route   GET /api/rewards/:childId
// @access  Private
export const getChildRewards = async (req, res, next) => {
  try {
    let { childId } = req.params;

    // Validate childId is not empty or invalid format
    if (!childId || childId === 'undefined' || childId === 'null') {
      throw new ErrorHandler('Invalid child ID provided', 400);
    }

    console.log(`🔍 getChildRewards - childId: ${childId}`);

    let rewards = [];
    
    // Try to find rewards with the provided childId directly
    try {
      rewards = await Reward.find({ childId, isActive: true })
        .populate('childId', 'firstName lastName')
        .populate('parentId', 'firstName lastName email')
        .sort({ createdAt: -1 });
      
      if (rewards.length > 0) {
        console.log(`✅ Found ${rewards.length} rewards with childId`);
        return res.status(200).json({
          success: true,
          count: rewards.length,
          data: rewards,
        });
      }
    } catch (err) {
      console.warn(`⚠️ Direct childId query failed, trying alternative method`);
    }

    // If direct query failed, try to find from parent's children
    const parent = await User.findOne({});
    if (parent && parent.familyChildren && parent.familyChildren.length > 0) {
      const children = parent.familyChildren.map(c => c._id);
      console.log(`🔄 Trying with parent's children: ${children.join(', ')}`);
      
      rewards = await Reward.find({ childId: { $in: children }, isActive: true })
        .populate('childId', 'firstName lastName')
        .populate('parentId', 'firstName lastName email')
        .sort({ createdAt: -1 });
      
      if (rewards.length > 0) {
        console.log(`✅ Found ${rewards.length} rewards with parent's children`);
        return res.status(200).json({
          success: true,
          count: rewards.length,
          data: rewards,
        });
      }
    }

    // Return empty if no rewards found
    res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  } catch (error) {
    console.error(`❌ Error in getChildRewards:`, error);
    next(error);
  }
};

// @desc    Create a new reward
// @route   POST /api/rewards
// @access  Private
export const createReward = async (req, res, next) => {
  try {
    const { title, description, childId, parentId, pointsRequired, rewardType, emoji, category } = req.body;

    // Validate required fields
    if (!title || !description || !childId || !parentId) {
      throw new ErrorHandler('Please provide all required fields', 400);
    }

    const reward = new Reward({
      title,
      description,
      childId,
      parentId,
      pointsRequired: pointsRequired || 10,
      rewardType: rewardType || 'sticker',
      emoji: emoji || '🎁',
      category: category || 'stickers',
      isActive: true,
    });

    await reward.save();

    res.status(201).json({
      success: true,
      message: 'Reward created successfully',
      data: reward,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Redeem a reward
// @route   POST /api/rewards/:rewardId/redeem
// @access  Private
export const redeemReward = async (req, res, next) => {
  try {
    const { rewardId } = req.params;
    let { childId } = req.body;

    // Validate IDs
    if (!rewardId || rewardId === 'undefined') {
      throw new ErrorHandler('Invalid reward ID', 400);
    }

    if (!childId || childId === 'undefined' || childId === 'null') {
      throw new ErrorHandler('Invalid child ID', 400);
    }

    console.log(`🔍 redeemReward - rewardId: ${rewardId}, childId: ${childId}`);

    // Try to find reward with the provided ID
    let reward = null;
    try {
      reward = await Reward.findById(rewardId);
    } catch (err) {
      console.warn(`⚠️ Could not find reward by ID, trying alternative: ${err.message}`);
    }

    if (!reward) {
      throw new ErrorHandler('Reward not found', 404);
    }

    if (!reward.isActive) {
      throw new ErrorHandler('This reward is no longer available', 400);
    }

    // Check if reward is expired
    if (reward.expiresAt && reward.expiresAt < new Date()) {
      reward.isExpired = true;
      await reward.save();
      throw new ErrorHandler('This reward has expired', 400);
    }

    // Check if it's a one-time reward and already redeemed
    if (reward.isOneTime && reward.timesRedeemed > 0) {
      throw new ErrorHandler('This reward can only be redeemed once', 400);
    }

    // Update reward - use validateBeforeSave: false to avoid strict validation
    reward.timesRedeemed += 1;
    reward.lastRedeemedDate = new Date();
    
    // Add redemption record - childId can be any format (timestamp or ObjectId)
    reward.redeemedBy.push({
      redeemedAt: new Date(),
      redeemedByChild: childId.toString(), // Convert to string to ensure compatibility
    });

    // Save without pre-save validation if there are issues
    try {
      await reward.save();
      console.log(`✅ Reward redeemed successfully`);
    } catch (saveErr) {
      console.error(`❌ Error saving reward: ${saveErr.message}`);
      // If save fails, try without validation
      await reward.save({ validateBeforeSave: false });
      console.log(`✅ Reward saved without validation`);
    }

    res.status(200).json({
      success: true,
      message: 'Reward redeemed successfully!',
      data: reward,
    });
  } catch (error) {
    console.error(`❌ Error in redeemReward:`, error);
    next(error);
  }
};

// @desc    Get reward by ID
// @route   GET /api/rewards/detail/:rewardId
// @access  Private
export const getRewardById = async (req, res, next) => {
  try {
    const { rewardId } = req.params;

    const reward = await Reward.findById(rewardId)
      .populate('childId', 'firstName lastName')
      .populate('parentId', 'firstName lastName');

    if (!reward) {
      throw new ErrorHandler('Reward not found', 404);
    }

    res.status(200).json({
      success: true,
      data: reward,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reward
// @route   PUT /api/rewards/:rewardId
// @access  Private
export const updateReward = async (req, res, next) => {
  try {
    const { rewardId } = req.params;
    const { title, description, pointsRequired, isActive, emoji, category } = req.body;

    let reward = await Reward.findById(rewardId);

    if (!reward) {
      throw new ErrorHandler('Reward not found', 404);
    }

    // Update fields
    if (title) reward.title = title;
    if (description) reward.description = description;
    if (pointsRequired) reward.pointsRequired = pointsRequired;
    if (isActive !== undefined) reward.isActive = isActive;
    if (emoji) reward.emoji = emoji;
    if (category) reward.category = category;

    reward.updatedAt = new Date();
    await reward.save();

    res.status(200).json({
      success: true,
      message: 'Reward updated successfully',
      data: reward,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reward
// @route   DELETE /api/rewards/:rewardId
// @access  Private
export const deleteReward = async (req, res, next) => {
  try {
    const { rewardId } = req.params;

    const reward = await Reward.findByIdAndDelete(rewardId);

    if (!reward) {
      throw new ErrorHandler('Reward not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Reward deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rewards by category
// @route   GET /api/rewards/category/:category
// @access  Private
export const getRewardsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { childId } = req.query;

    const query = { category, isActive: true };
    if (childId) query.childId = childId;

    const rewards = await Reward.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rewards.length,
      data: rewards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed sample rewards (Development endpoint)
// @route   POST /api/rewards/seed
// @access  Private
export const seedSampleRewards = async (req, res, next) => {
  try {
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
      {
        title: 'Diamond Crown',
        description: 'You\'re a champion! Wear the prestigious diamond crown',
        emoji: '👑',
        rewardType: 'badge',
        pointsRequired: 500,
        category: 'badges',
        isActive: true,
        isOneTime: true,
      },
    ];

    // Get all parents with children
    const parents = await User.find({ role: 'parent' }).populate('familyChildren');

    if (!parents || parents.length === 0) {
      throw new ErrorHandler('No parents found. Please create a parent account first.', 404);
    }

    let totalRewardsCreated = 0;
    const createdRewards = [];

    // Create rewards for each parent's children
    for (const parent of parents) {
      if (!parent.familyChildren || parent.familyChildren.length === 0) {
        console.log(`⚠️ Parent ${parent._id} has no children, skipping`);
        continue;
      }

      // Create rewards for each child
      for (const child of parent.familyChildren) {
        // Check if rewards already exist for this child
        const existingRewards = await Reward.findOne({ 
          parentId: parent._id, 
          childId: child._id 
        });

        if (existingRewards) {
          console.log(`ℹ️ Rewards already exist for child ${child._id}, skipping`);
          continue;
        }

        // Insert sample rewards for this child
        const rewardsToInsert = sampleRewards.map(reward => ({
          ...reward,
          parentId: parent._id,
          childId: child._id,
        }));

        const result = await Reward.insertMany(rewardsToInsert);
        totalRewardsCreated += result.length;
        createdRewards.push(...result);
        
        console.log(`✅ Created ${result.length} rewards for child ${child.name || child._id}`);
      }
    }

    if (totalRewardsCreated === 0) {
      return res.status(200).json({
        success: true,
        message: 'Rewards already seeded. Skipping to avoid duplicates.',
        count: 0,
      });
    }

    res.status(201).json({
      success: true,
      message: `✅ Successfully seeded ${totalRewardsCreated} rewards!`,
      count: totalRewardsCreated,
      data: createdRewards,
    });
  } catch (error) {
    console.error(`❌ Error seeding rewards:`, error);
    next(error);
  }
};

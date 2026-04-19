import express from 'express';
import {
  getChildRewards,
  createReward,
  redeemReward,
  getRewardById,
  updateReward,
  deleteReward,
  getRewardsByCategory,
  seedSampleRewards,
} from '../controllers/rewardController.js';

const router = express.Router();

// Seed sample rewards (for development/testing)
router.post('/seed', seedSampleRewards);

// Get all rewards for a child
router.get('/child/:childId', getChildRewards);

// Get rewards by category
router.get('/category/:category', getRewardsByCategory);

// Create a new reward
router.post('/', createReward);

// Get reward by ID
router.get('/detail/:rewardId', getRewardById);

// Update reward
router.put('/:rewardId', updateReward);

// Redeem reward
router.post('/:rewardId/redeem', redeemReward);

// Delete reward
router.delete('/:rewardId', deleteReward);

export default router;

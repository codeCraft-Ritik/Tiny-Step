import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/family/save
// @desc    Save family information (parent names, children)
// @access  Private
router.post('/save', protect, async (req, res) => {
  try {
    const userId = req.userId;
    const { fatherName, motherName, children } = req.body;

    console.log("📥 Received family data:", { fatherName, motherName, children });

    // Find user and update family information
    const user = await User.findByIdAndUpdate(
      userId,
      {
        fatherName: fatherName || null,
        motherName: motherName || null,
        familyChildren: children || [],
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ Family info saved to database for user:", userId);

    res.status(200).json({
      message: 'Family information saved successfully',
      family: {
        fatherName: user.fatherName,
        motherName: user.motherName,
        children: user.familyChildren,
      },
    });
  } catch (error) {
    console.error('❌ Error saving family info:', error);
    res.status(500).json({ message: 'Error saving family information', error: error.message });
  }
});

// @route   GET /api/family/get
// @desc    Get family information for current user
// @access  Private
router.get('/get', protect, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('fatherName motherName familyChildren');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ Family info retrieved from database for user:", userId);

    res.status(200).json({
      message: 'Family information retrieved successfully',
      family: {
        fatherName: user.fatherName || '',
        motherName: user.motherName || '',
        children: user.familyChildren || [],
      },
    });
  } catch (error) {
    console.error('❌ Error retrieving family info:', error);
    res.status(500).json({ message: 'Error retrieving family information', error: error.message });
  }
});

// @route   GET /api/family/children
// @desc    Get all linked children for parent
// @access  Private
router.get('/children', protect, async (req, res) => {
  try {
    const userId = req.userId;

    // Find user
    const user = await User.findById(userId).select('familyChildren');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ Linked children retrieved for user:", userId);

    res.status(200).json({
      message: 'Linked children retrieved successfully',
      children: user.familyChildren || [],
    });
  } catch (error) {
    console.error('❌ Error retrieving children:', error);
    res.status(500).json({ message: 'Error retrieving children', error: error.message });
  }
});

// @route   GET /api/family/children?parentEmail=...
// @desc    Get children list by parent email (for child signup)
// @access  Public (no authentication required)
router.get('/children/by-email', async (req, res) => {
  try {
    const { parentEmail } = req.query;

    if (!parentEmail || !parentEmail.trim()) {
      return res.status(400).json({ message: 'Parent email is required' });
    }

    // Find parent user by email
    const parent = await User.findOne({ 
      email: parentEmail.trim().toLowerCase(), 
      role: 'parent' 
    }).select('familyChildren');

    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    if (!parent.familyChildren || parent.familyChildren.length === 0) {
      return res.status(404).json({ message: 'No children added for this parent' });
    }

    console.log("✅ Children retrieved by parent email:", parentEmail);

    res.status(200).json({
      message: 'Children retrieved successfully',
      children: parent.familyChildren,
    });
  } catch (error) {
    console.error('❌ Error retrieving children by email:', error);
    res.status(500).json({ message: 'Error retrieving children', error: error.message });
  }
});

export default router;

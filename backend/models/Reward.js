import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide reward title'],
      trim: true,
      maxlength: [100, 'Reward title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide reward description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    emoji: {
      type: String,
      default: '🎁',
      maxlength: [2, 'Emoji should be a single character'],
    },
    icon: {
      type: String,
      default: null,
    },

    // Relationships
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reward must be assigned to a parent'],
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: [true, 'Reward must be assigned to a child'],
    },

    // Reward Type
    rewardType: {
      type: String,
      enum: ['sticker', 'badge', 'prize', 'activity', 'special-privilege', 'digital', 'physical'],
      default: 'sticker',
    },

    // Cost/Requirements
    pointsRequired: {
      type: Number,
      required: [true, 'Please specify points required for reward'],
      min: [1, 'Points must be at least 1'],
      max: [100000, 'Points cannot exceed 100000'],
    },
    stickersRequired: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Quantity for Physical Rewards
    quantity: {
      type: Number,
      default: null,
      min: [1, 'Quantity must be at least 1'],
    },
    quantityRemaining: {
      type: Number,
      default: null,
    },

    // Reward Details
    stickerColor: {
      type: String,
      default: '#f2a61c',
      match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color'],
    },
    badgeLevel: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    },
    activityDescription: {
      type: String,
      maxlength: [1000, 'Activity description cannot exceed 1000 characters'],
    },
    privilegeDescription: {
      type: String,
      maxlength: [1000, 'Privilege description cannot exceed 1000 characters'],
    },

    // Reward Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isOneTime: {
      type: Boolean,
      default: false,
    },

    // Redemption Tracking
    timesRedeemed: {
      type: Number,
      default: 0,
    },
    lastRedeemedDate: {
      type: Date,
      default: null,
    },
    redeemedBy: [
      {
        redeemedAt: {
          type: Date,
          default: Date.now,
        },
        redeemedByChild: {
          type: String, // Accept any format of child ID (timestamp, ObjectId, etc)
        },
      },
    ],

    // Category & Tags
    category: {
      type: String,
      enum: ['stickers', 'badges', 'screen-time', 'outing', 'toy', 'food', 'special-privilege', 'other'],
      default: 'stickers',
    },
    tags: [
      {
        type: String,
        maxlength: [20, 'Tag cannot exceed 20 characters'],
      },
    ],

    // Expiration
    expiresAt: {
      type: Date,
      default: null,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
rewardSchema.index({ parentId: 1, childId: 1 });
rewardSchema.index({ childId: 1 });
rewardSchema.index({ parentId: 1 });
rewardSchema.index({ isActive: 1 });
rewardSchema.index({ createdAt: -1 });

// Check if reward is expired
rewardSchema.pre('save', function (next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.isExpired = true;
  }
  next();
});

// Populate references
rewardSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'childId',
    select: 'firstName lastName',
  });
  next();
});

const Reward = mongoose.model('Reward', rewardSchema);

export default Reward;

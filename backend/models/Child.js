import mongoose from 'mongoose';

const childSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, 'Please provide child first name'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide child last name'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide child date of birth'],
      validate: {
        validator: function (value) {
          return value < new Date();
        },
        message: 'Date of birth must be in the past',
      },
    },
    age: {
      type: Number,
      required: true,
      min: [1, 'Age must be at least 1'],
      max: [18, 'Age cannot exceed 18'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    // Parent Reference
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Child must be associated with a parent'],
    },

    // Child Profile Stats
    totalTasksCompleted: {
      type: Number,
      default: 0,
    },
    totalStickersEarned: {
      type: Number,
      default: 0,
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },
    experiencePoints: {
      type: Number,
      default: 0,
    },

    // Preferences
    favoriteColor: {
      type: String,
      default: '#7cc9f7',
    },
    favoriteEmoji: {
      type: String,
      default: '👦',
      maxlength: [2, 'Emoji should be a single character'],
    },

    // Account Activity
    lastActivityDate: {
      type: Date,
      default: null,
    },
    accountCreatedDate: {
      type: Date,
      default: Date.now,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Relationships
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    rewards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
      },
    ],
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
      },
    ],

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
childSchema.index({ parentId: 1 });
childSchema.index({ firstName: 1, lastName: 1 });
childSchema.index({ createdAt: -1 });

// Calculate age from date of birth
childSchema.pre('save', function (next) {
  const today = new Date();
  let age = today.getFullYear() - this.dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
    age--;
  }

  this.age = age;
  next();
});

// Populate parent when querying
childSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'parentId',
    select: 'firstName lastName email',
  });
  next();
});

const Child = mongoose.model('Child', childSchema);

export default Child;

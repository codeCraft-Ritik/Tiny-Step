import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { validateSignupData, validateLoginData } from '../utils/validators.js';
import ErrorHandler from '../utils/errorHandler.js';
import { sendOTPEmail } from '../utils/emailService.js';

// @desc    Register (Signup) a new parent or child
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role = 'parent', parentEmail, childName, termsAgreed, privacyAgreed, confirmPassword } = req.body;

    // ===== CHILD SIGNUP FLOW =====
    if (role === 'child') {
      // Validate child-specific fields
      if (!childName || !childName.trim()) {
        throw new ErrorHandler('Please select or enter your name', 400);
      }
      if (!parentEmail || !parentEmail.trim()) {
        throw new ErrorHandler('Parent email is required', 400);
      }
      if (!password) {
        throw new ErrorHandler('Password is required', 400);
      }
      if (password !== confirmPassword) {
        throw new ErrorHandler('Passwords do not match', 400);
      }
      if (password.length < 6) {
        throw new ErrorHandler('Password must be at least 6 characters', 400);
      }

      // Prepare normalized values
      const normalizedEmail = parentEmail.toLowerCase().trim();
      const normalizedChildName = childName.trim();

      // Find parent and verify child exists
      const parent = await User.findOne({ email: normalizedEmail, role: 'parent' }).select('_id firstName children familyChildren');
      
      if (!parent) {
        throw new ErrorHandler(
          'Parent email not found. Please ensure your parent has an active parent account.',
          404
        );
      }

      // Verify child name exists in parent's children list
      const childExists = parent.familyChildren && parent.familyChildren.some(
        child => child.name.toLowerCase() === normalizedChildName.toLowerCase()
      );

      if (!childExists) {
        throw new ErrorHandler(
          `"${normalizedChildName}" is not in your parent's children list. Please ask your parent to add you first.`,
          404
        );
      }

      // Check if child account already exists
      const existingChildAccount = await User.findOne({ 
        parentId: parent._id, 
        childName: normalizedChildName 
      }).select('_id');

      if (existingChildAccount) {
        throw new ErrorHandler('This child account already exists. Please login with your password.', 409);
      }

      // Create child account
      const child = new User({
        firstName: normalizedChildName,
        lastName: normalizedChildName,
        email: null, // No email for children
        password,
        role: 'child',
        childName: normalizedChildName,
        parentEmail: normalizedEmail,
        parentId: parent._id,
        hasAgreedToTerms: true,
        hasAgreedToPrivacy: true,
        isEmailVerified: true, // Always true for children
      });

      await child.save();

      // Generate token for child
      const token = generateToken(child._id);

      res.status(201).json({
        status: 'success',
        message: 'Child account created successfully! 🎉',
        data: {
          userId: child._id,
          childName: child.childName,
          parentId: parent._id,
          parentName: parent.firstName,
          token,
          user: {
            _id: child._id,
            childName: child.childName,
            parentId: parent._id,
            role: 'child',
          },
        },
      });

      console.log(`✅ New child account created: ${normalizedChildName} (Parent: ${normalizedEmail}) (ID: ${child._id})`);
      return;
    }

    // ===== PARENT SIGNUP FLOW (Original) =====
    const validatedData = validateSignupData(req.body);
    const { firstName: fName, lastName: lName, email: userEmail, password: pwd } = validatedData;

    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      throw new ErrorHandler(
        'This email is already registered. Please login with your existing account or use a different email.',
        409
      );
    }

    const user = new User({
      firstName: fName.trim(),
      lastName: lName.trim(),
      email: userEmail.toLowerCase(),
      password: pwd,
      role: 'parent',
      hasAgreedToTerms: termsAgreed || true,
      hasAgreedToPrivacy: privacyAgreed || true,
      isEmailVerified: false,
    });

    await user.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiryTime;
    user.otpAttempts = 0;
    await user.save();

    try {
      await sendOTPEmail(userEmail, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
    }

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully! 🎉 Check your email for the verification OTP.',
      data: {
        userId: user._id,
        email: user.email,
        requiresOTPVerification: true,
        otpExpiresIn: '10 minutes',
      },
    });

    console.log(`✅ New parent registered: ${userEmail} (ID: ${user._id}) - Awaiting OTP verification`);
  } catch (error) {
    next(error);
  }
};

// @desc    Login a parent or child
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password, parentEmail, childName } = req.body;

    let user;

    // ===== CHILD LOGIN FLOW =====
    if (parentEmail && childName) {
      // Child login with parent email + child name
      const normalizedParentEmail = parentEmail.toLowerCase().trim();
      const normalizedChildName = childName.trim();

      // First verify parent exists
      const parent = await User.findOne({ email: normalizedParentEmail, role: 'parent' });
      if (!parent) {
        throw new ErrorHandler('Parent email not found', 401);
      }

      // Find child account
      user = await User.findOne({
        parentId: parent._id,
        childName: normalizedChildName,
        role: 'child'
      }).select('+password');

      if (!user) {
        throw new ErrorHandler('Invalid parent email or child name', 401);
      }
    } else if (email && password) {
      // ===== PARENT LOGIN FLOW =====
      // Find user by email
      user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new ErrorHandler('Invalid email or password', 401);
      }

      // Check if email is verified for parents
      if (!user.isEmailVerified && user.role === 'parent') {
        throw new ErrorHandler(
          'Please verify your email first. Check your inbox for the OTP.',
          403
        );
      }
    } else {
      throw new ErrorHandler('Please provide valid login credentials', 400);
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      throw new ErrorHandler(
        'Account temporarily locked due to multiple failed login attempts. Please try again later.',
        423
      );
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      await user.incLoginAttempts();
      const attemptsLeft = Math.max(0, 5 - (user.loginAttempts + 1));

      if (attemptsLeft > 0) {
        throw new ErrorHandler(
          `Invalid credentials. ${attemptsLeft} attempts remaining before account lock`,
          401
        );
      } else {
        throw new ErrorHandler(
          'Maximum login attempts exceeded. Account locked for 2 hours',
          423
        );
      }
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ErrorHandler('Your account has been deactivated. Contact support.', 403);
    }

    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Re-fetch user to get complete data
    const freshUser = await User.findById(user._id).select('-password');

    // Generate token
    const token = generateToken(freshUser._id);

    // Return success response
    res.status(200).json({
      status: 'success',
      message: `Welcome back${freshUser.role === 'child' ? ', ' + freshUser.childName : ', ' + freshUser.firstName}! 👋`,
      data: {
        token,
        user: {
          _id: freshUser._id,
          firstName: freshUser.firstName,
          lastName: freshUser.lastName,
          email: freshUser.email,
          role: freshUser.role,
          childName: freshUser.childName || null,
          parentId: freshUser.parentId || null,
          profileImage: freshUser.profileImage,
          createdAt: freshUser.createdAt,
          lastLogin: freshUser.lastLogin,
        },
      },
    });

    console.log(`✅ User logged in: ${user.role === 'child' ? user.childName + ' (child)' : user.email} (Role: ${freshUser.role})`);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          language: user.language,
          timezone: user.timezone,
          notifications: user.notifications,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (client-side token deletion)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully. See you soon! 👋',
    });

    console.log(`✅ User logged out: ${req.user.email}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, language, timezone } = req.body;

    // Update allowed fields only
    const updateData = {};

    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (phone) updateData.phone = phone;
    if (language) updateData.language = language;
    if (timezone) updateData.timezone = timezone;

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          language: user.language,
          timezone: user.timezone,
        },
      },
    });

    console.log(`✅ User profile updated: ${user.email}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new ErrorHandler('All password fields are required', 400);
    }

    if (newPassword.length < 6) {
      throw new ErrorHandler('New password must be at least 6 characters', 400);
    }

    if (newPassword !== confirmPassword) {
      throw new ErrorHandler('New passwords do not match', 400);
    }

    // Get user with password field
    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    // Check current password
    const isPasswordValid = await user.matchPassword(currentPassword);

    if (!isPasswordValid) {
      throw new ErrorHandler('Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });

    console.log(`✅ User password changed: ${user.email}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw new ErrorHandler('Password is required to delete account', 400);
    }

    // Get user with password
    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      throw new ErrorHandler('Password is incorrect', 401);
    }

    // Delete user
    await User.findByIdAndDelete(req.userId);

    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully. We hope to see you again!',
    });

    console.log(`✅ User account deleted: ${user.email}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP to email for verification
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ErrorHandler('Email is required', 400);
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      throw new ErrorHandler('Please provide a valid email', 400);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in a temporary collection or session
    // For now, we'll store it in cache with expiry (10 minutes)
    const otpData = {
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
    };

    // Store in session/cache (you can use Redis in production)
    if (!global.otpStore) {
      global.otpStore = {};
    }
    global.otpStore[email.toLowerCase()] = otpData;

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent to your email. Please check your inbox.',
      data: {
        email: email,
        expiresIn: '10 minutes',
      },
    });

    console.log(`✅ OTP sent to: ${email}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ErrorHandler('Email and OTP are required', 400);
    }

    const normalizedEmail = email.toLowerCase();
    let isValidOTP = false;
    let otpSource = null; // Track where OTP came from

    // FIRST: Check global.otpStore (for settings modal email verification)
    if (global.otpStore && global.otpStore[normalizedEmail]) {
      const storedOtpData = global.otpStore[normalizedEmail];
      
      // Check if OTP has expired
      if (new Date() > storedOtpData.expiresAt) {
        delete global.otpStore[normalizedEmail];
        throw new ErrorHandler('OTP has expired. Please request a new OTP.', 400);
      }

      // Check attempts (max 5 attempts)
      if (storedOtpData.attempts >= 5) {
        delete global.otpStore[normalizedEmail];
        throw new ErrorHandler('Maximum OTP verification attempts exceeded. Please request a new OTP.', 400);
      }

      // Verify OTP
      if (storedOtpData.otp === otp.toString()) {
        isValidOTP = true;
        otpSource = 'temp-store';
        delete global.otpStore[normalizedEmail]; // Clear after successful verification
      } else {
        storedOtpData.attempts += 1;
        const attemptsLeft = 5 - storedOtpData.attempts;
        throw new ErrorHandler(`Invalid OTP. ${attemptsLeft} attempts remaining.`, 401);
      }
    } else {
      // SECOND: Check User model (for signup OTP)
      const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpiry +otpAttempts');

      if (!user) {
        throw new ErrorHandler('User not found. Please signup first.', 404);
      }

      // Check if OTP exists
      if (!user.otp || !user.otpExpiry) {
        throw new ErrorHandler('OTP not found. Please request a new OTP.', 400);
      }

      // Check if OTP has expired
      if (new Date() > user.otpExpiry) {
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;
        await user.save();
        throw new ErrorHandler('OTP has expired. Please request a new OTP.', 400);
      }

      // Check attempts (max 5 attempts)
      if (user.otpAttempts >= 5) {
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;
        await user.save();
        throw new ErrorHandler('Maximum OTP verification attempts exceeded. Please request a new OTP.', 400);
      }

      // Verify OTP
      if (user.otp !== otp.toString()) {
        user.otpAttempts += 1;
        await user.save();
        const attemptsLeft = 5 - user.otpAttempts;
        throw new ErrorHandler(`Invalid OTP. ${attemptsLeft} attempts remaining.`, 401);
      }

      isValidOTP = true;
      otpSource = 'user-model';
    }

    // OTP verified successfully - find/update user and mark email as verified
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new ErrorHandler('User not found.', 404);
    }

    // Clear OTP from user model if it was stored there
    if (otpSource === 'user-model') {
      user.otp = undefined;
      user.otpExpiry = undefined;
      user.otpAttempts = 0;
    }

    user.isEmailVerified = true;
    await user.save();

    // Re-fetch user without sensitive fields
    const verifiedUser = await User.findById(user._id).select('-password -otp -otpExpiry -otpAttempts');

    // Generate JWT token for login
    const token = generateToken(verifiedUser._id);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully! 🎉 Welcome to TinySteps!',
      data: {
        token,
        user: {
          id: verifiedUser._id,
          firstName: verifiedUser.firstName,
          lastName: verifiedUser.lastName,
          email: verifiedUser.email,
          role: verifiedUser.role,
          profileImage: verifiedUser.profileImage,
          isEmailVerified: verifiedUser.isEmailVerified,
          createdAt: verifiedUser.createdAt,
        },
      },
    });

    console.log(`✅ Email verified and user logged in: ${email} (Source: ${otpSource})`);
  } catch (error) {
    next(error);
  }
};

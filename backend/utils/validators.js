import validator from 'validator';
import ErrorHandler from './errorHandler.js';

// Validate email
export const validateEmail = (email) => {
  if (!email) {
    throw new ErrorHandler('Email is required', 400);
  }
  if (!validator.isEmail(email)) {
    throw new ErrorHandler('Please provide a valid email', 400);
  }
  return email.toLowerCase();
};

// Validate password
export const validatePassword = (password) => {
  if (!password) {
    throw new ErrorHandler('Password is required', 400);
  }
  if (password.length < 6) {
    throw new ErrorHandler('Password must be at least 6 characters long', 400);
  }
  if (password.length > 50) {
    throw new ErrorHandler('Password cannot exceed 50 characters', 400);
  }
  return password;
};

// Validate name
export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    throw new ErrorHandler(`${fieldName} is required`, 400);
  }
  if (name.trim().length < 2) {
    throw new ErrorHandler(`${fieldName} must be at least 2 characters long`, 400);
  }
  if (name.length > 50) {
    throw new ErrorHandler(`${fieldName} cannot exceed 50 characters`, 400);
  }
  return name.trim();
};

// Validate signup data
export const validateSignupData = (data) => {
  const { firstName, lastName, email, password, confirmPassword, termsAgreed, privacyAgreed } = data;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new ErrorHandler('All fields are required', 400);
  }

  // Validate names
  const validFirstName = validateName(firstName, 'First name');
  const validLastName = validateName(lastName, 'Last name');

  // Validate email
  const validEmail = validateEmail(email);

  // Validate password
  const validPassword = validatePassword(password);

  // Check passwords match
  if (password !== confirmPassword) {
    throw new ErrorHandler('Passwords do not match', 400);
  }

  // Check agreement
  if (!termsAgreed) {
    throw new ErrorHandler('You must agree to Terms of Service', 400);
  }

  if (!privacyAgreed) {
    throw new ErrorHandler('You must agree to Privacy Policy', 400);
  }

  return {
    firstName: validFirstName,
    lastName: validLastName,
    email: validEmail,
    password: validPassword,
  };
};

// Validate login data
export const validateLoginData = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ErrorHandler('Email and password are required', 400);
  }

  const validEmail = validateEmail(email);
  const validPassword = validatePassword(password);

  return {
    email: validEmail,
    password: validPassword,
  };
};

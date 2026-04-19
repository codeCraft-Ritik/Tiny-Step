/**
 * Email validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation with strength levels
 * Returns { isValid: boolean, strength: 'weak' | 'medium' | 'strong', message: string }
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      strength: "weak",
      message: `Password must be at least ${minLength} characters long`,
    };
  }

  let strength = "weak";
  let score = 0;

  if (password.length >= minLength) score++;
  if (hasUpperCase) score++;
  if (hasLowerCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChar) score++;

  if (score <= 2) strength = "weak";
  else if (score <= 3) strength = "medium";
  else strength = "strong";

  return {
    isValid: score >= 3,
    strength,
    message:
      score < 3
        ? "Password should contain uppercase, lowercase, numbers, and special characters"
        : `Password strength: ${strength}`,
  };
};

/**
 * Name validation
 */
export const validateName = (name) => {
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters long" };
  }
  if (trimmedName.length > 50) {
    return { isValid: false, message: "Name must not exceed 50 characters" };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
    return { isValid: false, message: "Name contains invalid characters" };
  }
  return { isValid: true, message: "Name is valid" };
};

/**
 * Form validation groups
 */
export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignupForm = (parentName, email, password) => {
  const errors = {};

  // Validate parent name
  const nameValidation = validateName(parentName);
  if (!nameValidation.isValid) {
    errors.parentName = nameValidation.message;
  }

  // Validate email
  if (!email) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize input - Basic XSS prevention
 */
export const sanitizeInput = (input) => {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

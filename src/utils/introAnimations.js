/**
 * TinySteps Intro Page - Utility Functions
 * Optional enhancements for interactivity and animations
 */

/**
 * Smooth scroll to element
 * @param {string} elementId - The ID of the target element
 * @param {number} offset - Optional offset from top in pixels
 */
export const smoothScroll = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Detect if element is in viewport
 * @param {HTMLElement} element - The element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean} - Whether element is visible
 */
export const isElementInViewport = (element, threshold = 0.5) => {
  const rect = element.getBoundingClientRect();
  const elementHeight = rect.height;
  const elementWidth = rect.width;
  
  return (
    rect.top <= (window.innerHeight - elementHeight * threshold) &&
    rect.left <= (window.innerWidth - elementWidth * threshold) &&
    rect.bottom >= elementHeight * threshold &&
    rect.right >= elementWidth * threshold
  );
};

/**
 * Count up animation for numbers
 * @param {HTMLElement} element - The element containing the number
 * @param {number} target - Target number to count to
 * @param {number} duration - Duration in milliseconds
 */
export const countUpAnimation = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
};

/**
 * Fade in effect on scroll
 * @param {HTMLElement} element - The element to fade in
 * @param {number} duration - Duration in milliseconds
 */
export const fadeInOnView = (element, duration = 500) => {
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-in`;
  
  setTimeout(() => {
    element.style.opacity = '1';
  }, 100);
};

/**
 * Parallax scroll effect
 * @param {HTMLElement} element - The element to apply parallax
 * @param {number} speed - Parallax speed (0.5 = half speed)
 */
export const applyParallax = (element, speed = 0.5) => {
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    element.style.transform = `translateY(${scrollPos * speed}px)`;
  });
};

/**
 * Debounce function for scroll events
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Debounced function
 */
export const debounce = (func, wait = 250) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance-critical events
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} - Throttled function
 */
export const throttle = (func, limit = 250) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Observe multiple elements for intersection
 * @param {string} selector - CSS selector for elements
 * @param {function} callback - Callback when element enters view
 * @param {number} threshold - Visibility threshold (0-1)
 */
export const observeElements = (selector, callback, threshold = 0.1) => {
  const options = {
    threshold: threshold
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll(selector).forEach(element => {
    observer.observe(element);
  });

  return observer;
};

/**
 * Get scroll progress percentage
 * @returns {number} - Scroll progress from 0 to 100
 */
export const getScrollProgress = () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  return (scrolled / scrollHeight) * 100;
};

/**
 * Animate element appearance on scroll
 * @param {HTMLElement} element - Element to animate
 * @param {string} animation - CSS animation name
 * @param {number} threshold - Visibility threshold
 */
export const animateOnScroll = (element, animation, threshold = 0.5) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = animation;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });

  observer.observe(element);
};

/**
 * Get element scroll position relative to viewport
 * @param {HTMLElement} element - Element to check
 * @returns {object} - Position object with x, y, inView properties
 */
export const getElementScrollPosition = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    inView: rect.top < window.innerHeight && rect.bottom > 0,
    distanceFromTop: rect.top
  };
};

/**
 * Create a scroll progress bar
 * @param {string} elementId - ID of element to use as progress bar
 * @param {string} color - CSS color for progress bar
 */
export const createScrollProgressBar = (elementId, color = '#ff9500') => {
  const progressBar = document.getElementById(elementId) || document.createElement('div');
  progressBar.id = elementId;
  progressBar.style.position = 'fixed';
  progressBar.style.top = '0';
  progressBar.style.left = '0';
  progressBar.style.height = '3px';
  progressBar.style.background = color;
  progressBar.style.zIndex = '9999';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const progress = getScrollProgress();
    progressBar.style.width = `${progress}%`;
  });
};

/**
 * Highlight text when user selects it
 * @param {string} color - Highlight color
 */
export const enableTextHighlight = (color = 'rgba(255, 149, 0, 0.3)') => {
  document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const span = document.createElement('span');
      span.style.backgroundColor = color;
      
      window.setTimeout(() => {
        span.style.backgroundColor = 'transparent';
      }, 3000);
    }
  });
};

/**
 * Load external script dynamically
 * @param {string} src - Script source URL
 * @param {function} callback - Callback when script loads
 */
export const loadScript = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
};

/**
 * Detect user's device type
 * @returns {string} - 'mobile', 'tablet', or 'desktop'
 */
export const detectDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/mobile|android/.test(userAgent)) return 'mobile';
  if (/tablet|ipad/.test(userAgent)) return 'tablet';
  return 'desktop';
};

/**
 * Generate random color
 * @returns {string} - Random hex color
 */
export const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

/**
 * Animate percentage number
 * @param {HTMLElement} element - Element containing number
 * @param {number} percentage - Target percentage
 * @param {number} duration - Animation duration in ms
 */
export const animatePercentage = (element, percentage, duration = 1000) => {
  const start = 0;
  const increment = percentage / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= percentage) {
      element.textContent = `${percentage}%`;
      clearInterval(timer);
    } else {
      element.textContent = `${Math.floor(current)}%`;
    }
  }, 16);
};

/**
 * Create toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'info'
 * @param {number} duration - Duration in milliseconds
 */
export const showToast = (message, type = 'info', duration = 3000) => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideInUp 0.3s ease;
    ${type === 'success' ? 'background: #4caf50;' : ''}
    ${type === 'error' ? 'background: #f44336;' : ''}
    ${type === 'info' ? 'background: #2196F3;' : ''}
  `;

  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

export default {
  smoothScroll,
  isElementInViewport,
  countUpAnimation,
  fadeInOnView,
  applyParallax,
  debounce,
  throttle,
  observeElements,
  getScrollProgress,
  animateOnScroll,
  getElementScrollPosition,
  createScrollProgressBar,
  enableTextHighlight,
  loadScript,
  detectDeviceType,
  getRandomColor,
  animatePercentage,
  showToast
};

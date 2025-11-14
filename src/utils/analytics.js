/**
 * Simple analytics utilities for the Dzaleka Online Services
 * This collects basic page view information and stores it in localStorage
 * for display on the analytics page
 */

const STORAGE_KEY = 'dzaleka_analytics';
const VISITOR_ID_KEY = 'dzaleka_visitor_id';
const CLEANUP_KEY = 'dzaleka_analytics_last_cleanup';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 100; // ms

/**
 * Sleep utility for retry logic
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Safely access localStorage with retry logic
 * @param {string} key - Storage key
 * @param {string} defaultValue - Default value if retrieval fails
 * @param {number} retryCount - Current retry attempt
 * @returns {string|null}
 */
const safeGetItem = async (key, defaultValue = null, retryCount = 0) => {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (error) {
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      await sleep(RETRY_DELAY * (retryCount + 1));
      return safeGetItem(key, defaultValue, retryCount + 1);
    }
    console.error(`Failed to get localStorage item ${key} after ${MAX_RETRY_ATTEMPTS} attempts:`, error);
    return defaultValue;
  }
};

/**
 * Safely set localStorage with retry logic
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @param {number} retryCount - Current retry attempt
 * @returns {boolean} Success status
 */
const safeSetItem = async (key, value, retryCount = 0) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    // Handle QuotaExceededError
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, cleaning old data');
      try {
        // Try to free up space by removing old cleanup key
        localStorage.removeItem(CLEANUP_KEY);
        localStorage.setItem(key, value);
        return true;
      } catch (retryError) {
        console.error('Failed to set item even after cleanup:', retryError);
        return false;
      }
    }

    if (retryCount < MAX_RETRY_ATTEMPTS) {
      await sleep(RETRY_DELAY * (retryCount + 1));
      return safeSetItem(key, value, retryCount + 1);
    }
    console.error(`Failed to set localStorage item ${key} after ${MAX_RETRY_ATTEMPTS} attempts:`, error);
    return false;
  }
};

/**
 * Initialize the analytics data structure if it doesn't exist
 * @returns {Object} Analytics data object
 */
const initializeAnalytics = async () => {
  try {
    const existingData = await safeGetItem(STORAGE_KEY);
    if (!existingData) {
      const initialData = {
        pageViews: {},
        totalViews: 0,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        visitors: {},
        referrers: {},
        version: '1.0' // Track data structure version
      };
      await safeSetItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }

    // Validate and parse existing data
    const parsed = JSON.parse(existingData);

    // Ensure all required fields exist
    if (!parsed.pageViews || !parsed.visitors || !parsed.referrers) {
      throw new Error('Invalid analytics data structure');
    }

    return parsed;
  } catch (error) {
    console.error('Error initializing analytics:', error);
    // Create fresh data on error
    const initialData = {
      pageViews: {},
      totalViews: 0,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visitors: {},
      referrers: {},
      version: '1.0',
      errors: (error && error.message) ? [{
        timestamp: new Date().toISOString(),
        message: error.message
      }] : []
    };
    await safeSetItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
};

// Check if the current page is the analytics page
const isAnalyticsPage = () => {
  return window.location.pathname.includes('/analytics');
};

/**
 * Record a page view with robust error handling
 * @returns {Promise<void>}
 */
export const recordPageView = async () => {
  try {
    // Don't record views on the analytics page itself to prevent feedback loop
    if (isAnalyticsPage()) {
      return;
    }

    const analytics = await initializeAnalytics();
    const currentPath = window.location.pathname;
    const currentDate = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    const visitorId = await getVisitorId();

    // Clean old data periodically (once per day)
    const lastCleanup = await safeGetItem(CLEANUP_KEY);
    if (!lastCleanup || lastCleanup !== currentDate) {
      await cleanOldData(analytics);
      await safeSetItem(CLEANUP_KEY, currentDate);
    }

    // Update page views
    if (!analytics.pageViews[currentPath]) {
      analytics.pageViews[currentPath] = 0;
    }
    analytics.pageViews[currentPath]++;
    analytics.totalViews++;

    // Update visitor data
    if (!analytics.visitors[currentDate]) {
      analytics.visitors[currentDate] = [];
    }
    if (!analytics.visitors[currentDate].includes(visitorId)) {
      analytics.visitors[currentDate].push(visitorId);
    }

    // Update referrer data if available
    const referrer = document.referrer;
    if (referrer && !referrer.includes(window.location.hostname)) {
      if (!analytics.referrers[referrer]) {
        analytics.referrers[referrer] = 0;
      }
      analytics.referrers[referrer]++;
    }

    // Update last visit time
    analytics.lastVisit = new Date().toISOString();

    // Save with retry logic
    const success = await safeSetItem(STORAGE_KEY, JSON.stringify(analytics));
    if (!success) {
      console.warn('Failed to save analytics data after retries');
    }
  } catch (error) {
    console.error('Error recording analytics:', error);
    // Don't throw - fail silently for analytics
  }
};

// Clean old data to prevent continuously growing storage
const cleanOldData = (analytics) => {
  try {
    // Keep only the last 30 days of visitor data
    const today = new Date();
    const dates = Object.keys(analytics.visitors).sort();
    
    // Remove dates older than 30 days
    dates.forEach(date => {
      const dateObj = new Date(date);
      const daysDiff = Math.floor((today - dateObj) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 30) {
        delete analytics.visitors[date];
      }
    });
    
    // Limit the number of pageView entries to 100
    const pageEntries = Object.entries(analytics.pageViews);
    if (pageEntries.length > 100) {
      // Sort by view count (highest first)
      pageEntries.sort((a, b) => b[1] - a[1]);
      
      // Keep only top 100
      const topEntries = pageEntries.slice(0, 100);
      analytics.pageViews = Object.fromEntries(topEntries);
    }
    
    // Limit referrers to top 50
    const referrerEntries = Object.entries(analytics.referrers);
    if (referrerEntries.length > 50) {
      // Sort by count (highest first)
      referrerEntries.sort((a, b) => b[1] - a[1]);
      
      // Keep only top 50
      const topReferrers = referrerEntries.slice(0, 50);
      analytics.referrers = Object.fromEntries(topReferrers);
    }
  } catch (error) {
    console.error('Error cleaning old analytics data:', error);
  }
};

/**
 * Generate a simple visitor ID (not for tracking individuals, just for counting unique visitors)
 * @returns {Promise<string>} Visitor ID
 */
const getVisitorId = async () => {
  try {
    let id = await safeGetItem(VISITOR_ID_KEY);
    if (!id) {
      id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await safeSetItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch (error) {
    console.error('Error getting visitor ID:', error);
    // Return a session-only ID as fallback
    return 'session-' + Math.random().toString(36).substring(2, 15);
  }
};

/**
 * Get the analytics data for display
 * @returns {Promise<Object>} Analytics data
 */
export const getAnalyticsData = async () => {
  try {
    const data = await safeGetItem(STORAGE_KEY);
    return data ? JSON.parse(data) : await initializeAnalytics();
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return await initializeAnalytics();
  }
};

/**
 * Clear analytics data (for testing or resetting)
 * @returns {Promise<void>}
 */
export const clearAnalyticsData = async () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CLEANUP_KEY);
    localStorage.removeItem(VISITOR_ID_KEY);
    await initializeAnalytics();
  } catch (error) {
    console.error('Error clearing analytics data:', error);
  }
};

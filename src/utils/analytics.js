/**
 * Simple analytics utilities for the Dzaleka Online Services
 * This collects basic page view information and stores it in localStorage
 * for display on the analytics page
 */

// Initialize the analytics data structure if it doesn't exist
const initializeAnalytics = () => {
  try {
    const existingData = localStorage.getItem('dzaleka_analytics');
    if (!existingData) {
      const initialData = {
        pageViews: {},
        totalViews: 0,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        visitors: {},
        referrers: {}
      };
      localStorage.setItem('dzaleka_analytics', JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(existingData);
  } catch (error) {
    console.error('Error initializing analytics:', error);
    // If there's an error parsing existing data, create fresh data
    const initialData = {
      pageViews: {},
      totalViews: 0,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      visitors: {},
      referrers: {}
    };
    localStorage.setItem('dzaleka_analytics', JSON.stringify(initialData));
    return initialData;
  }
};

// Check if the current page is the analytics page
const isAnalyticsPage = () => {
  return window.location.pathname.includes('/analytics');
};

// Record a page view
export const recordPageView = () => {
  try {
    // Don't record views on the analytics page itself to prevent feedback loop
    if (isAnalyticsPage()) {
      return;
    }
    
    const analytics = initializeAnalytics();
    const currentPath = window.location.pathname;
    const currentDate = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    const visitorId = getVisitorId();
    
    // Clean old data periodically (once per day)
    const lastCleanup = localStorage.getItem('dzaleka_analytics_last_cleanup');
    if (!lastCleanup || lastCleanup !== currentDate) {
      cleanOldData(analytics);
      localStorage.setItem('dzaleka_analytics_last_cleanup', currentDate);
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
    
    localStorage.setItem('dzaleka_analytics', JSON.stringify(analytics));
  } catch (error) {
    console.error('Error recording analytics:', error);
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

// Generate a simple visitor ID (not for tracking individuals, just for counting unique visitors)
const getVisitorId = () => {
  let id = localStorage.getItem('dzaleka_visitor_id');
  if (!id) {
    id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('dzaleka_visitor_id', id);
  }
  return id;
};

// Get the analytics data for display
export const getAnalyticsData = () => {
  try {
    return JSON.parse(localStorage.getItem('dzaleka_analytics')) || initializeAnalytics();
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return initializeAnalytics();
  }
};

// Clear analytics data (for testing or resetting)
export const clearAnalyticsData = () => {
  localStorage.removeItem('dzaleka_analytics');
  localStorage.removeItem('dzaleka_analytics_last_cleanup');
  initializeAnalytics();
};

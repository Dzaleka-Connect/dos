export function calculateBounceRate(data) {
  if (!data?.sessions) return 0;
  const totalSessions = Object.keys(data.sessions).length;
  const bounceSessions = Object.values(data.sessions).filter(session => session.pageViews === 1).length;
  return totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;
}

export function calculateAvgSessionDuration(data) {
  if (!data?.sessions) return 0;
  const sessions = Object.values(data.sessions);
  const totalDuration = sessions.reduce((acc, session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.lastActive);
    return acc + (end - start) / 1000;
  }, 0);
  return sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;
}

export function calculatePagesPerSession(data) {
  if (!data?.sessions) return 0;
  const sessions = Object.values(data.sessions);
  const totalPageViews = sessions.reduce((acc, session) => acc + (session.pageViews || 0), 0);
  return sessions.length > 0 ? (totalPageViews / sessions.length).toFixed(1) : '0.0';
}

export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds} sec${seconds !== 1 ? 's' : ''}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
}

export function formatPagePath(path) {
  if (!path) return '-';
  if (path === '/') return 'Home';
  // Remove leading slash and capitalize first letter of each segment
  return path
    .slice(1)
    .split('/')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' / ');
}

export function exportAnalyticsData(data) {
  try {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'dzaleka_analytics_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    return false;
  }
}

export function downloadFile(content, type, filename) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function convertToCSV(data) {
  const rows = [
    ['Metric', 'Value'],
    ['Total Views', data.totalViews || 0],
    ['Total Visitors', Object.values(data.visitors || {}).reduce((acc, arr) => acc + arr.length, 0)],
    ['Bounce Rate', `${calculateBounceRate(data)}%`],
    ['Avg Session Duration', formatDuration(calculateAvgSessionDuration(data))],
    ['Pages per Session', calculatePagesPerSession(data)]
  ];
  return rows.map(row => row.join(',')).join('\n');
}

// Storage key for analytics data
const STORAGE_KEY = 'dzaleka_analytics';
const TOTAL_VIEWS_KEY = 'dzaleka_total_views';

export const MAX_BACKUP_SIZE = 2000000; // 2MB limit for localStorage

// Get total views synchronously
export function getTotalViews() {
  try {
    const totalViews = localStorage.getItem(TOTAL_VIEWS_KEY);
    return totalViews ? parseInt(totalViews, 10) : 0;
  } catch (error) {
    console.error('Error getting total views:', error);
    return 0;
  }
}

// Update total views synchronously
function updateTotalViews(increment = 1) {
  try {
    const currentViews = getTotalViews();
    localStorage.setItem(TOTAL_VIEWS_KEY, (currentViews + increment).toString());
    return currentViews + increment;
  } catch (error) {
    console.error('Error updating total views:', error);
    return getTotalViews();
  }
}

// Clean up old data to prevent storage overflow
export function cleanupOldData(data) {
  try {
    // Keep only last 30 days of visitor data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (data.visitors) {
      Object.keys(data.visitors).forEach(date => {
        if (new Date(date) < thirtyDaysAgo) {
          delete data.visitors[date];
        }
      });
    }
    
    // Keep only last 100 sessions
    if (data.sessions) {
      const sessionIds = Object.keys(data.sessions);
      if (sessionIds.length > 100) {
        const oldestSessions = sessionIds
          .sort((a, b) => new Date(data.sessions[a].startTime) - new Date(data.sessions[b].startTime))
          .slice(0, sessionIds.length - 100);
        
        oldestSessions.forEach(id => {
          delete data.sessions[id];
          if (data.locations?.[id]) delete data.locations[id];
        });
      }
    }
    
    // Limit error logs
    if (data.errors?.jsErrors) {
      data.errors.jsErrors = data.errors.jsErrors.slice(-100);
    }
    
    return data;
  } catch (error) {
    console.error('Error cleaning up old data:', error);
    return data;
  }
}

// Also export the compression function since it's used by other functions
export function compressData(data) {
  try {
    const jsonString = JSON.stringify(data);
    // Basic compression by removing unnecessary whitespace
    return jsonString.replace(/\s+/g, '');
  } catch (error) {
    console.error('Error compressing data:', error);
    return null;
  }
}

// Backup data to storage
export async function backupAnalyticsData(data) {
  try {
    // Clean up old data first
    const cleanedData = cleanupOldData(data);
    
    // Compress the data
    const compressedData = compressData(cleanedData);
    if (!compressedData) return false;
    
    // Check if we're within storage limits
    if (compressedData.length > MAX_BACKUP_SIZE) {
      console.warn('Backup data exceeds size limit, performing additional cleanup');
      // Additional aggressive cleanup if needed
      delete cleanedData.interactions; // Remove detailed interaction logs
      const recompressedData = compressData(cleanedData);
      if (!recompressedData || recompressedData.length > MAX_BACKUP_SIZE) {
        throw new Error('Data too large even after cleanup');
      }
      localStorage.setItem('dzaleka_analytics_backup', recompressedData);
    } else {
      localStorage.setItem('dzaleka_analytics_backup', compressedData);
    }
    
    return true;
  } catch (error) {
    console.error('Error backing up analytics data:', error);
    return false;
  }
}

// Restore data from backup
export async function restoreFromBackup() {
  try {
    const backup = localStorage.getItem('dzaleka_analytics_backup');
    if (!backup) return null;
    
    const backups = JSON.parse(backup);
    if (backups.length === 0) return null;
    
    // Get most recent backup
    const latestBackup = backups[backups.length - 1];
    return latestBackup.data;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return null;
  }
}

// Get analytics data with guaranteed total views
export async function getAnalyticsData() {
  try {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return { totalViews: 0 };
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      // Always use the separate total views counter
      parsedData.totalViews = getTotalViews();
      return parsedData;
    }
    
    // Try to restore from backup
    const backupData = await restoreFromBackup();
    if (backupData) {
      // Always use the separate total views counter
      backupData.totalViews = getTotalViews();
      await storeAnalyticsData(backupData);
      return backupData;
    }
    
    // If no data exists, initialize with empty structure
    const emptyData = {
      pageViews: {},
      sessions: {},
      visitors: {},
      referrers: {},
      devices: {},
      browsers: {},
      screenSizes: {},
      languages: {},
      timeOnPage: {},
      loadTimes: {},
      entryPages: {},
      exitPages: {},
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      totalViews: getTotalViews() // Always use the separate total views counter
    };
    await storeAnalyticsData(emptyData);
    return emptyData;
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return { totalViews: getTotalViews() }; // Always return current total views
  }
}

// Store analytics data while preserving total views
export async function storeAnalyticsData(data) {
  try {
    // Ensure total views is always current
    data.totalViews = getTotalViews();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Create backup after storing
    await backupAnalyticsData(data);
    return true;
  } catch (error) {
    console.error('Error storing analytics data:', error);
    return false;
  }
}

// Get a session ID
export function getSessionId() {
  let sessionId = sessionStorage.getItem('dzaleka_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    sessionStorage.setItem('dzaleka_session_id', sessionId);
  }
  return sessionId;
}

// Get a visitor ID
export function getVisitorId() {
  let visitorId = localStorage.getItem('dzaleka_visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    localStorage.setItem('dzaleka_visitor_id', visitorId);
  }
  return visitorId;
}

// Get device type
export function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Get browser name
export function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Other';
}

// Track page load performance
export function trackPagePerformance() {
  if (!window.performance || !window.performance.timing) return null;
  
  const timing = window.performance.timing;
  const now = Date.now();
  
  // Calculate metrics in milliseconds
  const metrics = {
    loadTime: now - timing.navigationStart,
    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
    serverResponse: timing.responseEnd - timing.requestStart,
    resourceLoad: now - timing.responseEnd,
    // Additional metrics
    dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
    tcpConnection: timing.connectEnd - timing.connectStart,
    domInteractive: timing.domInteractive - timing.navigationStart,
    domComplete: timing.domComplete - timing.navigationStart
  };
  
  // Ensure all values are positive and valid
  Object.keys(metrics).forEach(key => {
    metrics[key] = Math.max(0, metrics[key]);
  });
  
  return metrics;
}

// Track user interactions
export function trackInteraction(type, element) {
  try {
    const data = getAnalyticsData() || {
      sessions: {},
      pageViews: {},
      visitors: {},
      totalViews: 0
    };

    const sessionId = getSessionId();
    if (!sessionId) {
      console.warn('No session ID available');
      return;
    }

    const deviceId = `${getDeviceType()}_${getBrowserName()}_${window.innerWidth}x${window.innerHeight}`;
    const deviceSessionId = `${sessionId}_${deviceId}`;
    
    // Initialize sessions if it doesn't exist
    if (!data.sessions) {
      data.sessions = {};
    }
    
    // Initialize or update session data
    if (!data.sessions[deviceSessionId]) {
      data.sessions[deviceSessionId] = {
        id: deviceSessionId,
        interactions: [],
        startTime: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        device: getDeviceType(),
        browser: getBrowserName(),
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        pageViews: 0,
        pages: []
      };
    }
    
    // Ensure interactions array exists
    if (!data.sessions[deviceSessionId].interactions) {
      data.sessions[deviceSessionId].interactions = [];
    }
    
    // Add the interaction
    data.sessions[deviceSessionId].interactions.push({
      type,
      element,
      timestamp: new Date().toISOString()
    });
    
    // Update last active time
    data.sessions[deviceSessionId].lastActive = new Date().toISOString();
    
    // Store the updated data
    storeAnalyticsData(data);
    
  } catch (error) {
    console.error('Error tracking interaction:', error);
  }
}

// Track scroll depth
export function trackScrollDepth() {
  let maxScroll = 0;
  
  window.addEventListener('scroll', async () => {
    try {
      const percent = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
      );
      
      if (percent > maxScroll) {
        maxScroll = percent;
        const data = await getAnalyticsData();
        const sessionId = getSessionId();
        
        if (!data || !data.sessions) {
          console.warn('No analytics data or sessions available');
          return;
        }
        
        const deviceId = `${getDeviceType()}_${getBrowserName()}_${window.innerWidth}x${window.innerHeight}`;
        const deviceSessionId = `${sessionId}_${deviceId}`;
        
        // Initialize session if it doesn't exist
        if (!data.sessions[deviceSessionId]) {
          data.sessions[deviceSessionId] = {
            id: deviceSessionId,
            startTime: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            maxScroll: 0,
            device: getDeviceType(),
            browser: getBrowserName(),
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            pageViews: 0,
            pages: []
          };
        }
        
        data.sessions[deviceSessionId].maxScroll = maxScroll;
        await storeAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error tracking scroll depth:', error);
    }
  });
}

// Calculate average performance metrics
export function calculateAverageLoadTime(data) {
  const sessions = Object.values(data.sessions || {});
  const loadTimes = sessions
    .filter(session => session.performance?.loadTime)
    .map(session => session.performance.loadTime);
  
  return loadTimes.length > 0 
    ? Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length)
    : 0;
}

export function calculateAverageServerResponse(data) {
  const sessions = Object.values(data.sessions || {});
  const responseTimes = sessions
    .filter(session => session.performance?.serverResponse)
    .map(session => session.performance.serverResponse);
  
  return responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;
}

export function calculateAverageResourceLoad(data) {
  const sessions = Object.values(data.sessions || {});
  const loadTimes = sessions
    .filter(session => session.performance?.resourceLoad)
    .map(session => session.performance.resourceLoad);
  
  return loadTimes.length > 0
    ? Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length)
    : 0;
}

export function calculateAverageDnsLookup(data) {
  const sessions = Object.values(data.sessions || {});
  const times = sessions
    .filter(session => session.performance?.dnsLookup)
    .map(session => session.performance.dnsLookup);
  
  return times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;
}

export function calculateAverageTcpConnection(data) {
  const sessions = Object.values(data.sessions || {});
  const times = sessions
    .filter(session => session.performance?.tcpConnection)
    .map(session => session.performance.tcpConnection);
  
  return times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;
}

export function calculateAverageDomInteractive(data) {
  const sessions = Object.values(data.sessions || {});
  const times = sessions
    .filter(session => session.performance?.domInteractive)
    .map(session => session.performance.domInteractive);
  
  return times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;
}

export function calculateAverageDomComplete(data) {
  const sessions = Object.values(data.sessions || {});
  const times = sessions
    .filter(session => session.performance?.domComplete)
    .map(session => session.performance.domComplete);
  
  return times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;
}

// Track user engagement events
export function trackEngagement(data, type) {
  const sessionId = getSessionId();
  data.engagement = data.engagement || {
    clicks: 0,
    scrollDepth: {},
    formSubmissions: 0,
    downloads: 0,
    videoPlays: 0,
    searchQueries: [],
    buttonClicks: {},
    linkClicks: {},
    timeOnElements: {}
  };
  
  switch(type) {
    case 'click':
      data.engagement.clicks++;
      break;
    case 'form':
      data.engagement.formSubmissions++;
      break;
    case 'download':
      data.engagement.downloads++;
      break;
    case 'video':
      data.engagement.videoPlays++;
      break;
  }
  
  return data;
}

// Track JavaScript errors
export function trackErrors(data) {
  data.errors = data.errors || {
    jsErrors: [],
    apiErrors: [],
    networkErrors: [],
    browserInfo: {}
  };
  
  window.addEventListener('error', (event) => {
    data.errors.jsErrors.push({
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      timestamp: new Date().toISOString(),
      stack: event?.error?.stack
    });
    storeAnalyticsData(data);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    data.errors.jsErrors.push({
      type: 'Promise',
      message: event.reason,
      timestamp: new Date().toISOString()
    });
    storeAnalyticsData(data);
  });
}

// Track web vitals
export function trackWebVitals(data) {
  data.vitals = data.vitals || {
    fcp: [], // First Contentful Paint
    lcp: [], // Largest Contentful Paint
    fid: [], // First Input Delay
    cls: [], // Cumulative Layout Shift
    ttfb: [] // Time to First Byte
  };
  
  if ('PerformanceObserver' in window) {
    // Track FCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        data.vitals.fcp.push({
          value: entry.startTime,
          timestamp: new Date().toISOString()
        });
        storeAnalyticsData(data);
      });
    }).observe({ entryTypes: ['paint'] });
    
    // Track LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        data.vitals.lcp.push({
          value: entry.startTime,
          timestamp: new Date().toISOString()
        });
        storeAnalyticsData(data);
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }
}

// Track user journey/flow
export function trackUserJourney(data) {
  try {
    if (!data) {
      console.warn('No analytics data available');
      return data;
    }

    const sessionId = getSessionId();
    if (!sessionId) {
      console.warn('No session ID available');
      return data;
    }

    // Initialize journeys if it doesn't exist
    if (!data.journeys) {
      data.journeys = {};
    }
    
    // Initialize session journey if it doesn't exist
    if (!data.journeys[sessionId]) {
      data.journeys[sessionId] = {
        path: [],
        interactions: [],
        startTime: new Date().toISOString(),
        completedGoals: [],
        abandonedForms: [],
        searchBehavior: []
      };
    }
    
    // Track page navigation
    data.journeys[sessionId].path.push({
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      referrer: document.referrer
    });
    
    return data;
  } catch (error) {
    console.error('Error tracking user journey:', error);
    return data;
  }
}

// Helper function to escape special characters in CSS selectors
function escapeSelector(str) {
  if (!str) return '';
  return str.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

// Helper function to get unique element path
function getElementPath(element) {
  try {
    if (!element || !element.tagName) return '';
    
    const path = [];
    let currentElement = element;
    
    while (currentElement) {
      let selector = currentElement.tagName.toLowerCase();
      
      // Add id if exists
      if (currentElement.id) {
        // Escape special characters in ID
        selector += `#${escapeSelector(currentElement.id)}`;
      } else {
        // Add classes if no id
        const classes = Array.from(currentElement.classList)
          .map(className => escapeSelector(className))
          .join('.');
        
        if (classes) {
          selector += `.${classes}`;
        }
        
        // Add position among siblings if no unique identifier
        try {
          if (!currentElement.id && (!classes || document.querySelectorAll(selector).length > 1)) {
            const siblings = Array.from(currentElement.parentNode?.children || [])
              .filter(child => child.tagName === currentElement.tagName);
            const index = siblings.indexOf(currentElement) + 1;
            selector += `:nth-child(${index})`;
          }
        } catch (selectorError) {
          // Fallback to nth-child if selector is invalid
          const index = Array.from(currentElement.parentNode?.children || []).indexOf(currentElement) + 1;
          selector += `:nth-child(${index})`;
        }
      }
      
      path.unshift(selector);
      currentElement = currentElement.parentElement;
      
      // Limit path length to prevent extremely long selectors
      if (path.length >= 5) break;
    }
    
    // Validate the final selector before returning
    const finalPath = path.join(' > ');
    try {
      document.querySelectorAll(finalPath);
      return finalPath;
    } catch (error) {
      // If the selector is invalid, return a simplified version
      return path.map(p => p.split('.')[0]).join(' > '); // Only use tag names
    }
  } catch (error) {
    console.error('Error generating element path:', error);
    return element.tagName.toLowerCase(); // Fallback to just the tag name
  }
}

// Track content interaction with improved error handling and performance
export function trackContentInteraction(data) {
  try {
    if (!data) {
      console.warn('No analytics data available for content tracking');
      return;
    }

    // Initialize content tracking data structure
    data.content = data.content || {
      readingDepth: {},
      timeOnContent: {},
      highlights: [],
      shares: [],
      comments: [],
      interactions: {}
    };

    // Track reading depth with debouncing
    let readingDepthTimeout;
    const readingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        try {
          if (entry.isIntersecting) {
            clearTimeout(readingDepthTimeout);
            readingDepthTimeout = setTimeout(() => {
              const elementPath = getElementPath(entry.target);
              if (!elementPath) return;

              const key = `${elementPath}_${Date.now()}`; // Use timestamp to ensure uniqueness
              data.content.readingDepth[key] = {
                timestamp: new Date().toISOString(),
                viewTime: entry.time,
                intersectionRatio: entry.intersectionRatio,
                viewportHeight: window.innerHeight,
                elementType: entry.target.tagName.toLowerCase(),
                elementClasses: Array.from(entry.target.classList)
              };
              storeAnalyticsData(data);
            }, 1000); // Debounce for 1 second
          }
        } catch (error) {
          console.error('Error tracking reading depth:', error);
        }
      });
    }, { 
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px'
    });

    // Track content changes with throttling
    let lastContentUpdate = 0;
    const THROTTLE_DELAY = 2000; // 2 seconds
    
    const contentObserver = new MutationObserver((mutations) => {
      const now = Date.now();
      if (now - lastContentUpdate < THROTTLE_DELAY) return;
      
      lastContentUpdate = now;
      
      mutations.forEach(mutation => {
        try {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const elementPath = getElementPath(mutation.target);
            if (!elementPath) return;

            data.content.timeOnContent[elementPath] = {
              timestamp: new Date().toISOString(),
              type: mutation.type,
              changes: {
                addedNodes: mutation.addedNodes.length,
                removedNodes: mutation.removedNodes.length,
                characterData: mutation.type === 'characterData'
              }
            };
            storeAnalyticsData(data);
          }
        } catch (error) {
          console.error('Error tracking content changes:', error);
        }
      });
    });

    // Track user interactions with content
    const interactionHandler = (event) => {
      try {
        const target = event.target;
        const elementPath = getElementPath(target);
        if (!elementPath) return;

        // Track only relevant interactions
        if (target.closest('article, section, .content')) {
          data.content.interactions[elementPath] = data.content.interactions[elementPath] || [];
          data.content.interactions[elementPath].push({
            type: event.type,
            timestamp: new Date().toISOString(),
            details: {
              x: event.clientX,
              y: event.clientY,
              elementType: target.tagName.toLowerCase(),
              classes: Array.from(target.classList),
              text: target.textContent?.slice(0, 100) // Limit text length
            }
          });

          // Throttle storage updates
          clearTimeout(data.content._storeTimeout);
          data.content._storeTimeout = setTimeout(() => {
            storeAnalyticsData(data);
          }, 1000);
        }
      } catch (error) {
        console.error('Error tracking content interaction:', error);
      }
    };

    // Observe content sections with error handling
    document.querySelectorAll('article, section, .content').forEach(el => {
      try {
        readingObserver.observe(el);
        contentObserver.observe(el, {
          childList: true,
          subtree: true,
          characterData: true
        });

        // Add interaction listeners
        el.addEventListener('click', interactionHandler);
        el.addEventListener('mouseover', interactionHandler);
        el.addEventListener('scroll', interactionHandler, { passive: true });
      } catch (error) {
        console.error('Error setting up content observers:', error);
      }
    });

    // Cleanup function
    return () => {
      try {
        readingObserver.disconnect();
        contentObserver.disconnect();
        document.querySelectorAll('article, section, .content').forEach(el => {
          el.removeEventListener('click', interactionHandler);
          el.removeEventListener('mouseover', interactionHandler);
          el.removeEventListener('scroll', interactionHandler);
        });
      } catch (error) {
        console.error('Error cleaning up content tracking:', error);
      }
    };
  } catch (error) {
    console.error('Error initializing content tracking:', error);
  }
}

// Track page views with immediate total views update
export async function trackPageView() {
  try {
    let data = await getAnalyticsData();
    const path = window.location.pathname;
    const timestamp = new Date().toISOString();
    const sessionId = getSessionId();
    const deviceId = `${getDeviceType()}_${getBrowserName()}_${window.innerWidth}x${window.innerHeight}`;
    const deviceSessionId = `${sessionId}_${deviceId}`;
    
    // Ensure data structures exist
    data.sessions = data.sessions || {};
    data.pageViews = data.pageViews || {};
    data.visitors = data.visitors || {};
    
    // Update page views and total views
    data.pageViews[path] = (data.pageViews[path] || 0) + 1;
    data.totalViews = updateTotalViews(); // Update total views immediately
    
    // Update session data
    if (!data.sessions[deviceSessionId]) {
      data.sessions[deviceSessionId] = {
        startTime: timestamp,
        lastActive: timestamp,
        pageViews: 1,
        pages: [path],
        entryPage: path,
        device: getDeviceType(),
        browser: getBrowserName(),
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language || 'unknown',
        deviceId: deviceId,
        visitorId: getVisitorId()
      };
    } else {
      data.sessions[deviceSessionId].lastActive = timestamp;
      data.sessions[deviceSessionId].pageViews += 1;
      data.sessions[deviceSessionId].pages.push(path);
    }
    
    // Update visitor data
    const today = timestamp.split('T')[0];
    data.visitors[today] = data.visitors[today] || [];
    const visitorEntry = {
      id: getVisitorId(),
      deviceId: deviceId,
      timestamp: timestamp
    };
    if (!data.visitors[today].some(v => v.id === visitorEntry.id && v.deviceId === visitorEntry.deviceId)) {
      data.visitors[today].push(visitorEntry);
    }
    
    // Store updated data
    await storeAnalyticsData(data);
    
    return data;
  } catch (error) {
    console.error('Error tracking page view:', error);
    return {
      sessions: {},
      pageViews: {},
      visitors: {},
      totalViews: getTotalViews() // Always return current total views
    };
  }
}

// Update visitor counting
export function getTotalVisitors(data, date) {
  if (!data?.visitors?.[date]) return 0;
  // Count unique combinations of visitor ID and device ID
  const uniqueVisitors = new Set(
    data.visitors[date].map(v => `${v.id}_${v.deviceId}`)
  );
  return uniqueVisitors.size;
} 
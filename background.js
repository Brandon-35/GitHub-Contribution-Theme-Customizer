// GitHub Contribution Theme Customizer - Background Service Worker

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreenshot') {
    // Handle screenshot capture asynchronously
    (async () => {
      try {
        await captureAndDownload(request.tabId);
        sendResponse({ success: true });
      } catch (error) {
        console.error('Screenshot error:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Keep channel open for async response
  }
  return false; // Close channel if not handling this message
});

// Capture screenshot and download
async function captureAndDownload(tabId) {
  try {
    // Try to prepare the page (ignore if content script not ready)
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: 'prepareScreenshot'
      });
      // Wait a bit for preparation
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.log('Could not prepare screenshot, capturing anyway:', err.message);
    }
    
    // Capture the visible tab
    const dataUrl = await chrome.tabs.captureVisibleTab(null, {
      format: 'png',
      quality: 100
    });
    
    // Download the image
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `github-contributions-${timestamp}.png`;
    
    await chrome.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: true
    });
    
    console.log('Screenshot saved:', filename);
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    throw error;
  }
}

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('GitHub Contribution Theme Customizer installed!');
    
    // Set default settings
    chrome.storage.sync.set({
      theme_name: 'classic',
      colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
      mode: 'auto',
      animation: true,
      overlay: true,
      special_days: []
    });
    
    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'https://github.com' });
  } else if (details.reason === 'update') {
    console.log('GitHub Contribution Theme Customizer updated!');
  }
});

// Handle extension icon click (optional additional behavior)
chrome.action.onClicked.addListener((tab) => {
  // The popup will open automatically, but we can add additional logic here if needed
  console.log('Extension icon clicked on tab:', tab.id);
});

// Listen for tab updates to apply theme on GitHub pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('github.com')) {
    // Wait a bit for content script to be ready
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, {
        action: 'reapplyTheme'
      }).catch(error => {
        // Content script might not be ready yet, that's okay
        console.log('Content script not ready yet:', error.message);
      });
    }, 1000);
  }
});


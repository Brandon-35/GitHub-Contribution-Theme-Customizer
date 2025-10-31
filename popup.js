// Theme presets
const THEMES = {
  classic: {
    name: 'Classic',
    colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
  },
  pastel: {
    name: 'Pastel',
    colors: ['#fef6f6', '#ffd4e5', '#ffb3d9', '#ff8cc6', '#ff69b4']
  },
  midnight: {
    name: 'Midnight',
    colors: ['#1a1f2e', '#2d4059', '#ea5455', '#f07b3f', '#ffd460']
  },
  neon: {
    name: 'Neon',
    colors: ['#0d0d0d', '#00ff41', '#00d9ff', '#ff00ff', '#ff0080']
  },
  forest: {
    name: 'Forest',
    colors: ['#f0f4f0', '#a8d5ba', '#7fb69e', '#5a9b7d', '#2c5f4f']
  },
  ocean: {
    name: 'Ocean',
    colors: ['#e6f3ff', '#99ccff', '#4da6ff', '#0080ff', '#0059b3']
  }
};

// DOM Elements
const themeBtns = document.querySelectorAll('.theme-btn');
const colorInputs = [
  document.getElementById('color0'),
  document.getElementById('color1'),
  document.getElementById('color2'),
  document.getElementById('color3'),
  document.getElementById('color4')
];
const modeBtns = document.querySelectorAll('.mode-btn');
const toggleAnimation = document.getElementById('toggle-animation');
const toggleOverlay = document.getElementById('toggle-overlay');
const btnApply = document.getElementById('btn-apply');
const btnReset = document.getElementById('btn-reset');
const btnCapture = document.getElementById('btn-capture');
const statusMessage = document.getElementById('status-message');

// Current settings
let currentSettings = {
  theme_name: 'classic',
  colors: THEMES.classic.colors,
  mode: 'auto',
  animation: true,
  overlay: true,
  special_days: []
};

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  setupEventListeners();
  updateUI();
});

// Load saved settings
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get([
      'theme_name',
      'colors',
      'mode',
      'animation',
      'overlay',
      'special_days'
    ]);
    
    if (result.theme_name) {
      currentSettings = {
        theme_name: result.theme_name || 'classic',
        colors: result.colors || THEMES.classic.colors,
        mode: result.mode || 'auto',
        animation: result.animation !== undefined ? result.animation : true,
        overlay: result.overlay !== undefined ? result.overlay : true,
        special_days: result.special_days || []
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Theme buttons
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeName = btn.dataset.theme;
      selectTheme(themeName);
    });
  });

  // Color inputs
  colorInputs.forEach((input, index) => {
    input.addEventListener('change', () => {
      currentSettings.colors[index] = input.value;
      currentSettings.theme_name = 'custom';
      updateThemeSelection('custom');
    });
  });

  // Mode buttons
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      currentSettings.mode = mode;
      updateModeSelection(mode);
    });
  });

  // Toggle switches
  toggleAnimation.addEventListener('change', () => {
    currentSettings.animation = toggleAnimation.checked;
  });

  toggleOverlay.addEventListener('change', () => {
    currentSettings.overlay = toggleOverlay.checked;
  });

  // Action buttons
  btnApply.addEventListener('click', applyTheme);
  btnReset.addEventListener('click', resetToDefault);
  btnCapture.addEventListener('click', captureScreenshot);
}

// Select theme
function selectTheme(themeName) {
  if (THEMES[themeName]) {
    currentSettings.theme_name = themeName;
    currentSettings.colors = [...THEMES[themeName].colors];
    updateThemeSelection(themeName);
    updateColorInputs();
  }
}

// Update UI
function updateUI() {
  updateThemeSelection(currentSettings.theme_name);
  updateColorInputs();
  updateModeSelection(currentSettings.mode);
  toggleAnimation.checked = currentSettings.animation;
  toggleOverlay.checked = currentSettings.overlay;
}

// Update theme button selection
function updateThemeSelection(themeName) {
  themeBtns.forEach(btn => {
    if (btn.dataset.theme === themeName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Update color inputs
function updateColorInputs() {
  colorInputs.forEach((input, index) => {
    input.value = currentSettings.colors[index];
  });
}

// Update mode button selection
function updateModeSelection(mode) {
  modeBtns.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Apply theme
async function applyTheme() {
  try {
    // Save settings to storage
    await chrome.storage.sync.set(currentSettings);
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url && tab.url.includes('github.com')) {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'applyTheme',
        settings: currentSettings
      });
      
      showStatus('Theme applied successfully! 🎉', 'success');
    } else {
      showStatus('Please open a GitHub profile page', 'error');
    }
  } catch (error) {
    console.error('Error applying theme:', error);
    showStatus('Error applying theme. Try refreshing the page.', 'error');
  }
}

// Reset to default
async function resetToDefault() {
  currentSettings = {
    theme_name: 'classic',
    colors: THEMES.classic.colors,
    mode: 'auto',
    animation: true,
    overlay: true,
    special_days: []
  };
  
  await chrome.storage.sync.set(currentSettings);
  updateUI();
  await applyTheme();
  showStatus('Reset to default theme', 'success');
}

// Capture screenshot
async function captureScreenshot() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url || !tab.url.includes('github.com')) {
      showStatus('Please open a GitHub profile page', 'error');
      return;
    }

    // Send message to background script to capture
    chrome.runtime.sendMessage({
      action: 'captureScreenshot',
      tabId: tab.id
    }, (response) => {
      if (response && response.success) {
        showStatus('Screenshot captured! 📸', 'success');
      } else {
        showStatus('Error capturing screenshot', 'error');
      }
    });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    showStatus('Error capturing screenshot', 'error');
  }
}

// Show status message
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  
  setTimeout(() => {
    statusMessage.className = 'status-message';
  }, 3000);
}


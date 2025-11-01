// GitHub Contribution Theme Customizer - Content Script

let currentSettings = {
  theme_name: 'classic',
  colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  mode: 'auto',
  animation: true,
  overlay: true,
  special_days: []
};

// Initialize when page loads
(function init() {
  console.log('GitHub Contribution Theme Customizer loaded');
  
  // Load settings and apply theme
  loadSettingsAndApply();
  
  // Watch for GitHub's dynamic content changes
  observePageChanges();
  
  // Listen for messages from popup and background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'applyTheme') {
      currentSettings = request.settings;
      applyTheme();
      sendResponse({ success: true });
      return true;
    }
    
    if (request.action === 'prepareScreenshot') {
      // Prepare the page for screenshot and highlight the contribution area
      const contributionSection = document.querySelector('.border.py-2.graph-before-activity-overview, .js-calendar-graph');
      if (contributionSection) {
        // Scroll to view
        contributionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a temporary highlight border for better screenshot
        contributionSection.style.outline = '3px solid #667eea';
        contributionSection.style.outlineOffset = '4px';
        
        // Remove highlight after screenshot
        setTimeout(() => {
          contributionSection.style.outline = '';
          contributionSection.style.outlineOffset = '';
        }, 1500);
      }
      sendResponse({ success: true });
      return true;
    }
    
    if (request.action === 'reapplyTheme') {
      applyTheme();
      sendResponse({ success: true });
      return true;
    }
    
    // Return false if action not recognized
    return false;
  });
})();

// Load settings from storage
async function loadSettingsAndApply() {
  try {
    const result = await chrome.storage.sync.get([
      'theme_name',
      'colors',
      'mode',
      'animation',
      'overlay',
      'special_days'
    ]);
    
    if (result.colors) {
      currentSettings = {
        theme_name: result.theme_name || 'classic',
        colors: result.colors,
        mode: result.mode || 'auto',
        animation: result.animation !== undefined ? result.animation : true,
        overlay: result.overlay !== undefined ? result.overlay : true,
        special_days: result.special_days || []
      };
    }
    
    // Apply theme after a short delay to ensure DOM is ready
    setTimeout(applyTheme, 500);
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Main function to apply theme
function applyTheme() {
  const contributionGraph = findContributionGraph();
  
  if (!contributionGraph) {
    console.log('Contribution graph not found, will retry...');
    return;
  }
  
  console.log('Applying theme:', currentSettings.theme_name);
  
  // Apply colors to contribution cells
  applyColors(contributionGraph);
  
  // Apply animation effects
  if (currentSettings.animation) {
    enableAnimations(contributionGraph);
  } else {
    disableAnimations(contributionGraph);
  }
  
  // Apply analytics overlay
  if (currentSettings.overlay) {
    enableOverlay(contributionGraph);
  } else {
    disableOverlay();
  }
  
  // Apply special days highlighting
  if (currentSettings.special_days && currentSettings.special_days.length > 0) {
    applySpecialDays(contributionGraph);
  }
}

// Find contribution graph element
function findContributionGraph() {
  // GitHub uses different selectors, try multiple approaches
  const selectors = [
    '.ContributionCalendar-grid', // New GitHub structure (table)
    '.js-calendar-graph-table',   // Table variant
    '.js-calendar-graph',          // Old structure
    '.ContributionCalendar',       // Container
    'svg.js-calendar-graph-svg'    // SVG variant
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      console.log('Found contribution graph with selector:', selector);
      return element;
    }
  }
  
  return null;
}

// Apply colors to contribution cells
function applyColors(graph) {
  // Find all contribution day elements (both td and rect for compatibility)
  const cells = graph.querySelectorAll('td.ContributionCalendar-day, rect[data-level], rect.ContributionCalendar-day');
  
  console.log(`Found ${cells.length} contribution cells`);
  
  cells.forEach(cell => {
    let level = cell.getAttribute('data-level');
    
    // If data-level doesn't exist, try to infer from fill color or data-count
    if (level === null) {
      const dataCount = parseInt(cell.getAttribute('data-count') || '0');
      level = calculateLevel(dataCount);
    }
    
    level = parseInt(level) || 0;
    
    if (level >= 0 && level < currentSettings.colors.length) {
      const color = currentSettings.colors[level];
      
      // Check if it's a td or rect element and apply color accordingly
      if (cell.tagName.toLowerCase() === 'td') {
        cell.style.backgroundColor = color;
        cell.style.setProperty('background-color', color, 'important');
      } else {
        cell.style.fill = color;
      }
      
      cell.setAttribute('data-custom-color', color);
    }
  });
  
  // Update legend if exists
  updateLegend(graph);
}

// Calculate contribution level from count
function calculateLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

// Update legend colors
function updateLegend(graph) {
  // Find legend in the parent container
  const container = graph.closest('.border.py-2') || graph.parentElement;
  const legendCells = container.querySelectorAll('[id^="contribution-graph-legend-level-"]');
  
  if (legendCells.length > 0) {
    legendCells.forEach((cell, index) => {
      if (index < currentSettings.colors.length) {
        const color = currentSettings.colors[index];
        if (cell.tagName.toLowerCase() === 'div') {
          cell.style.backgroundColor = color;
          cell.style.setProperty('background-color', color, 'important');
        } else if (cell.tagName.toLowerCase() === 'rect') {
          cell.style.fill = color;
        }
      }
    });
  } else {
    // Fallback to old legend structure
    const legendItems = container.querySelectorAll('.ContributionCalendar-legend li, .legend li');
    legendItems.forEach((item, index) => {
      const elem = item.querySelector('rect, div, [style*="background"]');
      if (elem && index < currentSettings.colors.length) {
        if (elem.tagName.toLowerCase() === 'rect') {
          elem.style.fill = currentSettings.colors[index];
        } else {
          elem.style.backgroundColor = currentSettings.colors[index];
          elem.style.setProperty('background-color', currentSettings.colors[index], 'important');
        }
      }
    });
  }
}

// Enable animations
function enableAnimations(graph) {
  const cells = graph.querySelectorAll('td.ContributionCalendar-day, rect[data-level], rect.ContributionCalendar-day');
  
  cells.forEach(cell => {
    cell.classList.add('github-theme-animated');
  });
}

// Disable animations
function disableAnimations(graph) {
  const cells = graph.querySelectorAll('td.ContributionCalendar-day, rect[data-level], rect.ContributionCalendar-day');
  
  cells.forEach(cell => {
    cell.classList.remove('github-theme-animated');
  });
}

// Enable analytics overlay
function enableOverlay(graph) {
  const cells = graph.querySelectorAll('td.ContributionCalendar-day, rect[data-level], rect.ContributionCalendar-day');
  
  cells.forEach(cell => {
    enhanceTooltip(cell);
  });
  
  // Calculate and display streak information
  displayStreakInfo(cells);
}

// Disable overlay
function disableOverlay() {
  const overlay = document.getElementById('github-theme-overlay');
  if (overlay) {
    overlay.remove();
  }
}

// Enhance tooltip with additional information
function enhanceTooltip(cell) {
  cell.addEventListener('mouseenter', (e) => {
    const date = cell.getAttribute('data-date');
    const count = cell.getAttribute('data-count') || '0';
    const level = cell.getAttribute('data-level') || '0';
    
    // Create enhanced tooltip
    let tooltip = document.getElementById('github-theme-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'github-theme-tooltip';
      tooltip.className = 'github-theme-tooltip';
      document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
      <div class="tooltip-content">
        <div class="tooltip-date">${formatDate(date)}</div>
        <div class="tooltip-count">${count} contributions</div>
        <div class="tooltip-level">Level ${level}</div>
      </div>
    `;
    
    // Position tooltip
    const cellBounds = cell.getBoundingClientRect();
    tooltip.style.left = `${cellBounds.left + cellBounds.width / 2}px`;
    tooltip.style.top = `${cellBounds.top - 10}px`;
    tooltip.style.display = 'block';
  });
  
  cell.addEventListener('mouseleave', () => {
    const tooltip = document.getElementById('github-theme-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  });
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Display streak information
function displayStreakInfo(cells) {
  const contributions = Array.from(cells).map(cell => ({
    date: cell.getAttribute('data-date'),
    count: parseInt(cell.getAttribute('data-count') || '0')
  })).filter(c => c.date).sort((a, b) => new Date(a.date) - new Date(b.date));
  
  if (contributions.length === 0) return;
  
  // Calculate current streak
  const currentStreak = calculateCurrentStreak(contributions);
  const longestStreak = calculateLongestStreak(contributions);
  const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0);
  
  // Create or update overlay
  let overlay = document.getElementById('github-theme-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'github-theme-overlay';
    overlay.className = 'github-theme-overlay';
    
    const graphContainer = document.querySelector('.border.py-2.graph-before-activity-overview, .js-calendar-graph, .ContributionCalendar');
    if (graphContainer) {
      graphContainer.parentElement.insertBefore(overlay, graphContainer);
    }
  }
  
  overlay.innerHTML = `
    <div class="overlay-stats">
      <div class="stat-item">
        <span class="stat-label">🔥 Current Streak:</span>
        <span class="stat-value">${currentStreak} days</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">⭐ Longest Streak:</span>
        <span class="stat-value">${longestStreak} days</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">📊 Total:</span>
        <span class="stat-value">${totalContributions} contributions</span>
      </div>
    </div>
  `;
}

// Calculate current streak
function calculateCurrentStreak(contributions) {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = contributions.length - 1; i >= 0; i--) {
    const date = new Date(contributions[i].date);
    date.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak && contributions[i].count > 0) {
      streak++;
    } else if (contributions[i].count === 0) {
      continue;
    } else {
      break;
    }
  }
  
  return streak;
}

// Calculate longest streak
function calculateLongestStreak(contributions) {
  let longestStreak = 0;
  let currentStreak = 0;
  
  contributions.forEach(c => {
    if (c.count > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return longestStreak;
}

// Apply special days highlighting
function applySpecialDays(graph) {
  if (!currentSettings.special_days) return;
  
  currentSettings.special_days.forEach(specialDay => {
    const cell = graph.querySelector(`td[data-date="${specialDay.date}"], rect[data-date="${specialDay.date}"]`);
    if (cell) {
      if (cell.tagName.toLowerCase() === 'td') {
        cell.style.backgroundColor = specialDay.color;
        cell.style.setProperty('background-color', specialDay.color, 'important');
        cell.style.border = '2px solid #fff';
      } else {
        cell.style.fill = specialDay.color;
        cell.style.stroke = '#fff';
        cell.style.strokeWidth = '2px';
      }
      cell.setAttribute('data-special-label', specialDay.label);
    }
  });
}

// Observe page changes for SPA navigation
function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        const hasContributionGraph = Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === 1) {
            return node.querySelector && (
              node.querySelector('.js-calendar-graph') ||
              node.querySelector('.ContributionCalendar') ||
              node.classList.contains('js-calendar-graph') ||
              node.classList.contains('ContributionCalendar')
            );
          }
          return false;
        });
        
        if (hasContributionGraph) {
          setTimeout(applyTheme, 300);
        }
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}


// Check authentication
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

let currentAdCopy = '';

// Platform icons
const platformIcons = {
  'facebook': '📘',
  'instagram': '📸',
  'google': '🔍'
};

const platformNames = {
  'facebook': 'Facebook Ads',
  'instagram': 'Instagram Ads',
  'google': 'Google Ads'
};

// Load ad copies history
async function loadAdCopiesHistory() {
  try {
    const response = await fetch(`${API_BASE}/ai/adcopies`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (response.ok && data.success && data.adCopies.length > 0) {
      displayAdCopiesHistory(data.adCopies.slice(0, 5));
    } else if (response.status === 401) {
      localStorage.clear();
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error loading ad copies history:', error);
  }
}

// Display ad copies history
function displayAdCopiesHistory(adCopies) {
  const container = document.getElementById('adcopies-history');
  
  container.innerHTML = adCopies.map(ad => `
    <div style="padding: 1.5rem; border-bottom: 1px solid var(--border);">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
        <div>
          <span style="background: var(--bg-tertiary); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">
            ${platformIcons[ad.platform]} ${platformNames[ad.platform]}
          </span>
        </div>
        <div style="color: var(--text-muted); font-size: 0.875rem;">
          ${formatDate(ad.createdAt)}
        </div>
      </div>
      <div style="font-weight: 600; margin-bottom: 0.75rem; color: var(--primary-light);">
        ${ad.productName}
      </div>
      <div style="color: var(--text-secondary); line-height: 1.8; white-space: pre-wrap; font-size: 0.875rem;">
        ${ad.adCopy}
      </div>
    </div>
  `).join('');
}

// Copy ad copy to clipboard
function copyAdCopy() {
  navigator.clipboard.writeText(currentAdCopy).then(() => {
    showAlert('✅ Ad copy copied to clipboard!', 'success');
  }).catch(() => {
    showAlert('❌ Failed to copy to clipboard', 'error');
  });
}

// Handle form submission
document.getElementById('adgen-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const platform = document.querySelector('input[name="platform"]:checked').value;
  const productName = document.getElementById('product-name').value;
  const description = document.getElementById('description').value;
  
  const generateBtn = document.getElementById('generate-ad-btn');
  const resultDiv = document.getElementById('ad-result');
  const contentDiv = document.getElementById('ad-content');
  const platformTitle = document.getElementById('platform-title');
  
  // Show loading state
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0;"></div> Generating...';
  resultDiv.style.display = 'none';
  
  try {
    const response = await fetch(`${API_BASE}/ai/adcopy`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ platform, productName, description })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      currentAdCopy = data.adCopy;
      contentDiv.textContent = data.adCopy;
      platformTitle.textContent = `${platformIcons[platform]} ${data.platform}`;
      resultDiv.style.display = 'block';
      showAlert('✅ Ad copy generated successfully!', 'success');
      
      // Scroll to result
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Reload history
      setTimeout(() => loadAdCopiesHistory(), 500);
    } else {
      showAlert('❌ ' + (data.error || 'Failed to generate ad copy'), 'error');
    }
  } catch (error) {
    console.error('Error generating ad copy:', error);
    showAlert('❌ Connection error. Please try again.', 'error');
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '✨ Generate Ad Copy';
  }
});

// Initialize
loadAdCopiesHistory();
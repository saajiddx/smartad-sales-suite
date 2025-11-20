// Check authentication
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

// Load insights history
async function loadInsightsHistory() {
  try {
    const response = await fetch(`${API_BASE}/ai/insights`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (response.ok && data.success && data.insights.length > 0) {
      displayInsightsHistory(data.insights.slice(0, 5));
    } else if (response.status === 401) {
      localStorage.clear();
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error loading insights history:', error);
  }
}

// Display insights history
function displayInsightsHistory(insights) {
  const container = document.getElementById('insights-history');
  
  container.innerHTML = insights.map(insight => `
    <div style="padding: 1.5rem; border-bottom: 1px solid var(--border);">
      <div style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">
        ${formatDate(insight.createdAt)}
      </div>
      <div style="font-weight: 600; margin-bottom: 0.75rem; color: var(--primary-light);">
        Q: ${insight.question}
      </div>
      <div style="color: var(--text-secondary); line-height: 1.8; white-space: pre-wrap;">
        ${insight.insight}
      </div>
    </div>
  `).join('');
}

// Handle form submission
document.getElementById('insights-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const question = document.getElementById('question').value;
  const generateBtn = document.getElementById('generate-btn');
  const resultDiv = document.getElementById('insight-result');
  const contentDiv = document.getElementById('insight-content');
  
  // Show loading state
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0;"></div> Generating...';
  resultDiv.style.display = 'none';
  
  try {
    const response = await fetch(`${API_BASE}/ai/insights`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ question })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      contentDiv.textContent = data.insight;
      resultDiv.style.display = 'block';
      showAlert('✅ Insight generated successfully!', 'success');
      
      // Scroll to result
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Reload history
      setTimeout(() => loadInsightsHistory(), 500);
    } else {
      showAlert('❌ ' + (data.error || 'Failed to generate insight'), 'error');
    }
  } catch (error) {
    console.error('Error generating insight:', error);
    showAlert('❌ Connection error. Please try again.', 'error');
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '✨ Generate Insight';
  }
});

// Initialize
loadInsightsHistory();
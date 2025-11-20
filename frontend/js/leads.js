// Check authentication
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

// Load leads list
async function loadLeads() {
  try {
    const response = await fetch(`${API_BASE}/leads`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      displayLeads(data.leads.reverse());
    } else if (response.status === 401) {
      localStorage.clear();
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error loading leads:', error);
  }
}

// Display leads
function displayLeads(leads) {
  const tbody = document.getElementById('leads-list');
  
  if (leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No leads yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = leads.slice(0, 10).map(lead => `
    <tr>
      <td>${lead.name}</td>
      <td>${lead.email}</td>
      <td>${lead.phone || 'N/A'}</td>
      <td>${lead.source}</td>
      <td>
        <span class="badge badge-${lead.status === 'new' ? 'info' : lead.status === 'qualified' ? 'success' : lead.status === 'contacted' ? 'warning' : 'danger'}">
          ${lead.status}
        </span>
      </td>
    </tr>
  `).join('');
}

// Handle form submission
document.getElementById('leads-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    source: document.getElementById('source').value,
    status: document.getElementById('lead-status').value,
    notes: document.getElementById('notes').value
  };
  
  try {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      showAlert('✅ Lead added successfully!', 'success');
      document.getElementById('leads-form').reset();
      loadLeads();
    } else {
      showAlert('❌ ' + (data.error || 'Failed to add lead'), 'error');
    }
  } catch (error) {
    console.error('Error adding lead:', error);
    showAlert('❌ Connection error. Please try again.', 'error');
  }
});

// Initialize
loadLeads();
// Check authentication
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Load sales list
async function loadSales() {
  try {
    const response = await fetch(`${API_BASE}/sales`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      displaySales(data.sales.reverse());
    } else if (response.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error loading sales:', error);
  }
}

// Display sales
function displaySales(sales) {
  const tbody = document.getElementById('sales-list');
  
  if (sales.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No sales yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = sales.slice(0, 10).map(sale => `
    <tr>
      <td>${formatDate(sale.date)}</td>
      <td>${sale.customer}</td>
      <td>${sale.product}</td>
      <td>${formatCurrency(sale.amount)}</td>
      <td>
        <span class="badge badge-${sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'danger'}">
          ${sale.status}
        </span>
      </td>
    </tr>
  `).join('');
}

// Handle form submission
document.getElementById('sales-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    product: document.getElementById('product').value,
    amount: parseFloat(document.getElementById('amount').value),
    date: document.getElementById('date').value,
    customer: document.getElementById('customer').value,
    status: document.getElementById('status').value
  };
  
  try {
    const response = await fetch(`${API_BASE}/sales`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      showAlert('✅ Sale added successfully!', 'success');
      document.getElementById('sales-form').reset();
      document.getElementById('date').valueAsDate = new Date();
      loadSales();
    } else {
      showAlert('❌ ' + (data.error || 'Failed to add sale'), 'error');
    }
  } catch (error) {
    console.error('Error adding sale:', error);
    showAlert('❌ Connection error. Please try again.', 'error');
  }
});

// Initialize
loadSales();
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
      localStorage.clear();
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error loading sales:', error);
  }
}

// Format currency in BDT
function formatBDT(amount) {
  return '৳' + amount.toLocaleString('bn-BD', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Display sales
function displaySales(sales) {
  const tbody = document.getElementById('sales-list');
  
  if (sales.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">এখনও কোনো বিক্রয় নেই</td></tr>';
    return;
  }
  
  tbody.innerHTML = sales.slice(0, 10).map(sale => `
    <tr>
      <td>${formatDate(sale.date)}</td>
      <td>${sale.customer}</td>
      <td>${sale.product}</td>
      <td>৳${sale.amount.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>
        <span class="badge badge-${sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'danger'}">
          ${sale.status === 'completed' ? 'সম্পন্ন' : sale.status === 'pending' ? 'বাকি' : 'বাতিল'}
        </span>
      </td>
      <td>
        <button onclick="showCustomerDetails(${sale.id})" class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">
          বিস্তারিত
        </button>
      </td>
    </tr>
  `).join('');
}

// Show customer details modal
async function showCustomerDetails(saleId) {
  try {
    const response = await fetch(`${API_BASE}/sales/${saleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      const sale = data.sale;
      
      const detailsHTML = `
        <div style="line-height: 2;">
          <p><strong>পণ্যের নাম:</strong> ${sale.product}</p>
          <p><strong>মূল্য:</strong> ${formatBDT(sale.amount)}</p>
          <p><strong>ক্রেতার নাম:</strong> ${sale.customer}</p>
          <p><strong>ফোন নম্বর:</strong> ${sale.customerPhone || 'প্রদান করা হয়নি'}</p>
          <p><strong>ঠিকানা:</strong> ${sale.customerAddress || 'প্রদান করা হয়নি'}</p>
          <p><strong>তারিখ:</strong> ${formatDate(sale.date)}</p>
          <p><strong>অবস্থা:</strong> 
            <span class="badge badge-${sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'danger'}">
              ${sale.status === 'completed' ? 'সম্পন্ন' : sale.status === 'pending' ? 'বাকি' : 'বাতিল'}
            </span>
          </p>
        </div>
      `;
      
      document.getElementById('customer-details-content').innerHTML = detailsHTML;
      document.getElementById('customer-modal').style.display = 'flex';
    } else {
      showAlert('বিস্তারিত তথ্য লোড করতে ব্যর্থ', 'error');
    }
  } catch (error) {
    console.error('Error loading customer details:', error);
    showAlert('সংযোগ ত্রুটি', 'error');
  }
}

// Close customer details modal
function closeCustomerModal() {
  document.getElementById('customer-modal').style.display = 'none';
}

// Close modal when clicking outside
document.getElementById('customer-modal')?.addEventListener('click', function(e) {
  if (e.target === this) {
    closeCustomerModal();
  }
});

// Handle form submission
document.getElementById('sales-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    product: document.getElementById('product').value,
    amount: parseFloat(document.getElementById('amount').value),
    date: document.getElementById('date').value,
    customer: document.getElementById('customer').value,
    customerPhone: document.getElementById('customer-phone').value,
    customerAddress: document.getElementById('customer-address').value,
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
      showAlert('✅ বিক্রয় সফলভাবে যোগ হয়েছে!', 'success');
      document.getElementById('sales-form').reset();
      document.getElementById('date').valueAsDate = new Date();
      loadSales();
    } else {
      showAlert('❌ ' + (data.error || 'বিক্রয় যোগ করতে ব্যর্থ'), 'error');
    }
  } catch (error) {
    console.error('Error adding sale:', error);
    showAlert('❌ সংযোগ ত্রুটি। আবার চেষ্টা করুন।', 'error');
  }
});

// Initialize
loadSales();
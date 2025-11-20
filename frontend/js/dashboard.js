// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
  window.location.href = 'index.html';
}

if (user && user.name) {
  document.getElementById('user-name').textContent = `Welcome, ${user.name}!`;
}

let salesChart, productChart;

// Load dashboard data
async function loadDashboard() {
  try {
    // Load KPI stats
    const statsResponse = await fetch(`${API_BASE}/sales/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const statsData = await statsResponse.json();
    
    if (statsResponse.ok && statsData.success) {
      document.getElementById('total-revenue').textContent = formatCurrency(statsData.stats.totalSales);
      document.getElementById('total-sales').textContent = statsData.stats.totalCount;
      document.getElementById('monthly-revenue').textContent = formatCurrency(statsData.stats.monthlyRevenue);
    } else if (statsResponse.status === 401) {
      // Token expired
      localStorage.clear();
      window.location.href = 'index.html';
      return;
    }
    
    // Load leads stats
    const leadsStatsResponse = await fetch(`${API_BASE}/leads/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const leadsStatsData = await leadsStatsResponse.json();
    
    if (leadsStatsResponse.ok && leadsStatsData.success) {
      document.getElementById('active-leads').textContent = leadsStatsData.stats.totalLeads;
    }
    
    // Load sales for table
    const salesResponse = await fetch(`${API_BASE}/sales`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const salesData = await salesResponse.json();
    
    if (salesResponse.ok && salesData.success) {
      displayRecentSales(salesData.sales.slice(-5).reverse());
    }
    
    // Load leads for table
    const leadsResponse = await fetch(`${API_BASE}/leads`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const leadsData = await leadsResponse.json();
    
    if (leadsResponse.ok && leadsData.success) {
      displayRecentLeads(leadsData.leads.slice(-5).reverse());
    }
    
    // Load charts
    await loadCharts();
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showAlert('Failed to load dashboard data', 'error');
  }
}

// Display recent sales
function displayRecentSales(sales) {
  const tbody = document.getElementById('recent-sales');
  
  if (sales.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No sales yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = sales.map(sale => `
    <tr>
      <td>${formatDate(sale.date)}</td>
      <td>${sale.customer}</td>
      <td>${sale.product}</td>
      <td>${formatCurrency(sale.amount)}</td>
      <td>
        <span class="badge badge-${sale.status === 'completed' ? 'success' : 'warning'}">
          ${sale.status}
        </span>
      </td>
    </tr>
  `).join('');
}

// Display recent leads
function displayRecentLeads(leads) {
  const tbody = document.getElementById('recent-leads');
  
  if (leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No leads yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = leads.map(lead => `
    <tr>
      <td>${lead.name}</td>
      <td>${lead.email}</td>
      <td>${lead.source}</td>
      <td>
        <span class="badge badge-${lead.status === 'new' ? 'info' : lead.status === 'qualified' ? 'success' : 'warning'}">
          ${lead.status}
        </span>
      </td>
      <td>${formatDate(lead.createdAt)}</td>
    </tr>
  `).join('');
}

// Load charts
async function loadCharts() {
  try {
    // Sales trend chart
    const trendResponse = await fetch(`${API_BASE}/analytics/sales-trend`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const trendData = await trendResponse.json();
    
    if (trendResponse.ok && trendData.success) {
      const ctx1 = document.getElementById('sales-chart').getContext('2d');
      salesChart = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: trendData.trend.map(t => t.month),
          datasets: [{
            label: 'Revenue',
            data: trendData.trend.map(t => t.revenue),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#cbd5e1' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#cbd5e1' },
              grid: { color: '#334155' }
            },
            x: {
              ticks: { color: '#cbd5e1' },
              grid: { color: '#334155' }
            }
          }
        }
      });
    }
    
    // Product revenue chart
    const productResponse = await fetch(`${API_BASE}/analytics/revenue-by-product`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const productData = await productResponse.json();
    
    if (productResponse.ok && productData.success) {
      const ctx2 = document.getElementById('product-chart').getContext('2d');
      productChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: productData.data.map(p => p.product),
          datasets: [{
            label: 'Revenue',
            data: productData.data.map(p => p.revenue),
            backgroundColor: [
              '#6366f1',
              '#8b5cf6',
              '#ec4899',
              '#f59e0b',
              '#10b981'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#cbd5e1' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#cbd5e1' },
              grid: { color: '#334155' }
            },
            x: {
              ticks: { color: '#cbd5e1' },
              grid: { color: '#334155' }
            }
          }
        }
      });
    }
    
  } catch (error) {
    console.error('Error loading charts:', error);
  }
}

// Initialize dashboard
loadDashboard();
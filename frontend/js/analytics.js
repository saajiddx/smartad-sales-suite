// Check authentication
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

let charts = {};

// Load all analytics data
async function loadAnalytics() {
  try {
    // Sales Trend
    const trendResponse = await fetch(`${API_BASE}/analytics/sales-trend`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const trendData = await trendResponse.json();
    if (trendResponse.ok && trendData.success) {
      createSalesTrendChart(trendData.trend);
    }
    
    // Revenue by Product
    const productResponse = await fetch(`${API_BASE}/analytics/revenue-by-product`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const productData = await productResponse.json();
    if (productResponse.ok && productData.success) {
      createProductRevenueChart(productData.data);
    }
    
    // Lead Sources
    const sourcesResponse = await fetch(`${API_BASE}/analytics/lead-sources`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const sourcesData = await sourcesResponse.json();
    if (sourcesResponse.ok && sourcesData.success) {
      createLeadSourcesChart(sourcesData.data);
    }
    
    // Conversion Funnel
    const funnelResponse = await fetch(`${API_BASE}/analytics/conversion-funnel`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const funnelData = await funnelResponse.json();
    if (funnelResponse.ok && funnelData.success) {
      createConversionFunnelChart(funnelData.data);
    }
    
  } catch (error) {
    console.error('Error loading analytics:', error);
    showAlert('Failed to load analytics data', 'error');
  }
}

// Create Sales Trend Chart
function createSalesTrendChart(data) {
  const ctx = document.getElementById('sales-trend-chart').getContext('2d');
  charts.salesTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.month),
      datasets: [{
        label: 'Revenue',
        data: data.map(d => d.revenue),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      }, {
        label: 'Number of Sales',
        data: data.map(d => d.count),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: { color: '#cbd5e1' }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (context.datasetIndex === 0) {
                  label += formatCurrency(context.parsed.y);
                } else {
                  label += context.parsed.y;
                }
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          ticks: { 
            color: '#cbd5e1',
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          },
          grid: { color: '#334155' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          beginAtZero: true,
          ticks: { color: '#cbd5e1' },
          grid: { drawOnChartArea: false }
        },
        x: {
          ticks: { color: '#cbd5e1' },
          grid: { color: '#334155' }
        }
      }
    }
  });
}

// Create Product Revenue Chart
function createProductRevenueChart(data) {
  const ctx = document.getElementById('product-revenue-chart').getContext('2d');
  charts.productRevenue = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.product),
      datasets: [{
        label: 'Revenue',
        data: data.map(d => d.revenue),
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#f59e0b',
          '#10b981',
          '#3b82f6'
        ],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#cbd5e1' }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Revenue: ' + formatCurrency(context.parsed.y);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { 
            color: '#cbd5e1',
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          },
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

// Create Lead Sources Chart
function createLeadSourcesChart(data) {
  const ctx = document.getElementById('lead-sources-chart').getContext('2d');
  charts.leadSources = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.source),
      datasets: [{
        data: data.map(d => d.count),
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#f59e0b',
          '#10b981',
          '#3b82f6',
          '#ef4444'
        ],
        borderWidth: 2,
        borderColor: '#1e293b'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { 
            color: '#cbd5e1',
            padding: 15
          }
        }
      }
    }
  });
}

// Create Conversion Funnel Chart
function createConversionFunnelChart(data) {
  const ctx = document.getElementById('conversion-funnel-chart').getContext('2d');
  charts.conversionFunnel = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.stage),
      datasets: [{
        label: 'Count',
        data: data.map(d => d.count),
        backgroundColor: [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#10b981'
        ],
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: '#cbd5e1' },
          grid: { color: '#334155' }
        },
        y: {
          ticks: { color: '#cbd5e1' },
          grid: { color: '#334155' }
        }
      }
    }
  });
}

// Initialize
loadAnalytics();
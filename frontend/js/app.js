// API Base URL
const API_BASE = 'https://smartad-sales-suite.onrender.com/api';

// Check if user is authenticated
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Check authentication (redirect if not logged in)
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return null;
  }
  return getCurrentUser();
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Show alert
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;
  
  alertContainer.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
  
  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 5000);
}

// Format currency in BDT (Bangladeshi Taka)
function formatCurrency(amount) {
  return '৳' + amount.toLocaleString('bn-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Show loading spinner
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="spinner"></div>';
  }
}

// Hide loading
function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
  }
}

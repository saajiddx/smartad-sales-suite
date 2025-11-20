// Check authentication
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'index.html';
}

// Settings page loaded
console.log('Settings page loaded');
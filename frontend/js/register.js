// Handle registration
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const alertContainer = document.getElementById('alert-container');
  
  // Clear previous alerts
  alertContainer.innerHTML = '';
  
  // Validation
  if (password !== confirmPassword) {
    alertContainer.innerHTML = `
      <div class="alert alert-error">
        ❌ Passwords do not match
      </div>
    `;
    return;
  }
  
  if (password.length < 6) {
    alertContainer.innerHTML = `
      <div class="alert alert-error">
        ❌ Password must be at least 6 characters long
      </div>
    `;
    return;
  }
  
  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account...';
  
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      alertContainer.innerHTML = `
        <div class="alert alert-success">
          ✅ Account created successfully! Redirecting to dashboard...
        </div>
      `;
      
      // Store JWT token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      alertContainer.innerHTML = `
        <div class="alert alert-error">
          ❌ ${data.error || 'Registration failed. Please try again.'}
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  } catch (error) {
    console.error('Registration error:', error);
    alertContainer.innerHTML = `
      <div class="alert alert-error">
        ❌ Connection error. Please make sure the server is running.
      </div>
    `;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
});

// Real-time password match validation
document.getElementById('confirm-password')?.addEventListener('input', (e) => {
  const password = document.getElementById('password').value;
  const confirmPassword = e.target.value;
  
  if (confirmPassword && password !== confirmPassword) {
    e.target.style.borderColor = '#ef4444';
  } else {
    e.target.style.borderColor = '#334155';
  }
});
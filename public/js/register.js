document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 🎨 UI Feedback
  const errorContainer = document.getElementById('registerError');
  errorContainer.innerHTML = '';
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Processing...';

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.join('\n') || result.message || 'Registration failed');
    }

    // 🎉 Success Handling
    showToast('✅ Registration successful! Redirecting...');
    setTimeout(() => window.location.href = '/group.html', 1500);

  } catch (error) {
    console.error('Frontend Error:', error);
    
    // 🎨 Error Display
    errorContainer.innerHTML = `
      <div class="alert error">
        <strong>⚠️ Registration Failed</strong>
        <p>${error.message}</p>
      </div>
    `;
    
    // 📜 Auto-scroll to errors
    errorContainer.scrollIntoView({ behavior: 'smooth' });

  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';
  }
});

// 🍞 Toast Notification Helper
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast success';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

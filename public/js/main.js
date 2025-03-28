// Load registered users on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    
    const select = document.getElementById('userSelect');
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.display_name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load users:', error);
  }
});

// Register form handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        display_name: document.getElementById('displayName').value
      })
    });
    
    if (response.ok) {
      location.reload(); // Refresh to show new user in dropdown
    } else {
      const error = await response.json();
      document.getElementById('registerError').textContent = error.message;
    }
  } catch (error) {
    document.getElementById('registerError').textContent = 'Network error';
  }
});

// Number selection handler
document.getElementById('numberForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/group/pick-number', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: document.getElementById('userSelect').value,
        number: document.getElementById('groupNumber').value
      })
    });
    
    if (response.ok) {
      window.location.href = `/group/${document.getElementById('groupNumber').value}`;
    } else {
      document.getElementById('numberError').textContent = 'Failed to join group';
    }
  } catch (error) {
    document.getElementById('numberError').textContent = 'Network error';
  }
});

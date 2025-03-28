document.addEventListener('DOMContentLoaded', async () => {
  const userSelect = document.getElementById('userSelect');
  const errorDisplay = document.getElementById('groupError');
  const groupForm = document.getElementById('groupForm');
  const submitBtn = groupForm.querySelector('button[type="submit"]');

  // Load users
  try {
    const response = await fetch('/auth/api/users');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response');
    }
    
    const users = await response.json();
    userSelect.innerHTML = '<option value="">-- Select Your Name --</option>';
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.full_name;
      userSelect.appendChild(option);
    });
  } catch (error) {
    console.error('User load failed:', error);
    userSelect.innerHTML = '<option value="">Error loading users</option>';
    showError(error.message);
  }

  // Form submission
  groupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Joining...';

    try {
      const formData = {
        userId: userSelect.value,
        number: document.getElementById('groupNumber').value
      };

      const response = await fetch('/group/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Check response type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, got: ${text.substring(0, 50)}...`);
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to join group');
      }

      window.location.href = `/chat.html?group=${formData.number}`;
      
    } catch (error) {
      console.error('Join failed:', error);
      showError(error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join Group';
    }
  });

  function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
    errorDisplay.scrollIntoView({ behavior: 'smooth' });
  }
});

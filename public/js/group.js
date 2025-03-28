document.addEventListener('DOMContentLoaded', async () => {
  const userSelect = document.getElementById('userSelect');
  const groupForm = document.getElementById('groupForm');
  const errorDisplay = document.getElementById('groupError');

  // Load users
  try {
    const response = await fetch('/auth/api/users');
    if (!response.ok) throw new Error('Failed to load users');
    
    const users = await response.json();
    userSelect.innerHTML = '<option value="">-- Select Your Name --</option>';
    
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.full_name;
      userSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load users:', error);
    errorDisplay.textContent = 'Failed to load user list. Please refresh.';
  }

  // Form submission
  groupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';
    errorDisplay.textContent = '';

    try {
      const formData = {
        userId: userSelect.value,
        number: document.querySelector('input[name="groupNumber"]:checked')?.value
      };

      if (!formData.userId || !formData.number) {
        throw new Error('Please select both your name and a group');
      }

      const response = await fetch('/group/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to join group');
      }

      window.location.href = `/chat.html?group=${formData.number}`;
      
    } catch (error) {
      console.error('Join error:', error);
      errorDisplay.textContent = error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join Group';
    }
  });
});

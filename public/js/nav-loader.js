document.addEventListener('DOMContentLoaded', () => {
  fetch('/partials/nav.html')
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('afterbegin', html);
      // Highlight current page
      const currentPage = window.location.pathname.split('/').pop();
      document.getElementById(`nav-${currentPage.replace('.html', '')}`)?.classList.add('active');
    });
});

const toggle = document.getElementById('darkModeToggle');
const body = document.body;

// Apply saved mode on load
if (localStorage.getItem('darkMode') === 'enabled') {
  body.classList.add('dark-mode');

  toggle.checked = true;
}

// Handle toggle
toggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

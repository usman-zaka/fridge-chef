document.addEventListener("DOMContentLoaded", function () {
  fetch('/users/check-session')
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        const loginButton = document.querySelector('.login');
        if (loginButton) {
          loginButton.textContent = "Dashboard";
          loginButton.onclick = function () {
            window.location.href = "dashboard.html";
          };
        }
      }
    })
    .catch((error) => console.error("Error checking session:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.getElementById('logout');

  if (logoutLink) {
    logoutLink.addEventListener('click', function (event) {
      // This in line is needed to override the a tag's default link behaviour
      event.preventDefault();

      fetch('/users/logout', {
        method: 'GET',
        credentials: 'same-origin'
      })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          } else {
            console.error("Logout failed");
          }
        })
        .catch((error) => console.error("Error logging out:", error));
    });
  }
});

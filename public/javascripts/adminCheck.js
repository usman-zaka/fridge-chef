// function that checks if the user is an admin, if yes it loads the extra nav bar html
document.addEventListener("DOMContentLoaded", function () {
    fetch('/admin/session-info')
        .then(res => res.json())
        .then(user => {
            if (user.is_admin) {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.textContent = 'Admin Panel';
                document.getElementsByClassName('nav_links')[0].appendChild(adminLink);
            }
        });
});

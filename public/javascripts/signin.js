document.getElementById('signinForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    fetch('/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin'
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message.trim() === "Sign in successful") {
                localStorage.setItem("username", data.username);
                localStorage.setItem("email", data.email);
                window.location.href = "dashboard.html";
            } else {
                errorMessage.textContent = data.message;
                errorMessage.classList.add('show');
            }
        })

        .catch((error) => {
            console.error('Sign-in error:', error);
            errorMessage.textContent = "Something went wrong.";
            errorMessage.classList.add('show');
        });
});
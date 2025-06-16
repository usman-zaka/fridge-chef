document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    fetch('/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
    })
        .then((response) => response.text())
        .then((data) => {
            if (data.trim() === "Account created successfully") {
                errorMessage.textContent = "Account created! Redirecting to login...";
                errorMessage.style.color = "green";
                errorMessage.classList.add('show');
                setTimeout(() => window.location.href = "signin.html", 2000);
            } else {
                errorMessage.textContent = data;
                errorMessage.style.color = "red";
                errorMessage.classList.add('show');
            }
        })
        .catch((error) => {
            console.error('Signup error:', error);
            errorMessage.textContent = "Something went wrong.";
            errorMessage.classList.add('show');
        });
});

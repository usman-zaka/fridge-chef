const username = localStorage.getItem("username");
const greeting = document.getElementById("dashboard-greeting");

if (username) {
    greeting.textContent = `Welcome to FridgeChef, ${username}!`;
} else {
    window.location.href = "signin.html";
}

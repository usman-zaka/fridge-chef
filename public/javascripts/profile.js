const username = localStorage.getItem("username");
const email = localStorage.getItem("email");
const messageBox = document.getElementById("profile-message");

if (!username || !email) {
    window.location.href = "signin.html";
}

document.getElementById("profile-username").textContent = username;
document.getElementById("profile-email").textContent = email;

fetch(`/users/get-pic?email=${email}`)
    .then((res) => res.json())
    .then((data) => {
        if (data.profile_pic) {
            document.getElementById("profile-pic").src = data.profile_pic;
        }
    })
    .catch((err) => {
        console.log("Could not load profile picture");
    });



document.getElementById("updateForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value.trim();

    fetch("/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword })
    })
        .then((res) => res.text())
        .then((msg) => {
            messageBox.textContent = msg;
            messageBox.style.color = "green";
        })
        .catch((err) => {
            messageBox.textContent = "Something went wrong.";
            messageBox.style.color = "red";
        });
});

document.getElementById("deleteAccount").addEventListener("click", function () {
    if (!confirm("Are you sure you want to permanently delete your account?")) return;

    fetch("/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
        .then((res) => res.text())
        .then((msg) => {
            alert(msg);
            localStorage.clear();
            window.location.href = "signup.html";
        })
        .catch((err) => {
            alert("Error deleting account.");
        });
});
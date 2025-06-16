// funtion to delete user
const messageBox = document.getElementById("deleteMessage");

document.getElementById("deleteAccount").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("deleteEmail").value.trim();

    fetch(`/admin/delete-user/${encodeURIComponent(email)}`, {
        method: "DELETE"
    })
        .then((res) => res.text())
        .then((msg) => {
            console.log("deleted");
            messageBox.textContent = msg;
            messageBox.style.color = "green";
        })
        .catch((err) => {
            console.log("error");
            messageBox.textContent = "Something went wrong.";
            messageBox.style.color = "red";
        });
});

// js for changing psasword
const passMessageBox = document.getElementById("passMessage");

document.getElementById("changeP").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("changePass").value.trim();
    const newPassword = document.getElementById("newPass").value.trim();

    fetch("/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword })
    })
        .then((res) => res.text())
        .then((msg) => {
            passMessageBox.textContent = msg;
            passMessageBox.style.color = "green";
        })
        .catch((err) => {
            console.error(err);
            passMessageBox.textContent = "Something went wrong.";
            passMessageBox.style.color = "red";
        });
});

// get form and picture message
const pictureForm = document.getElementById("pictureForm");
const picMessage = document.getElementById("pic-message");


pictureForm.addEventListener("submit", function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // check if user chooses a file
  const fileUpload = document.getElementById("profilePicInput");
  if (!fileUpload.files[0]) {
    picMessage.textContent = "Please choose a file";
    picMessage.style.color = "red";
    return;
  }

  // form object to hold file
  const formObj = new FormData();
  formObj.append("profile_pic", fileUpload.files[0]);


  // send file
  fetch(`/users/upload-pic?email=${email}`, {
    method: "POST",
    body: formObj
  })
    .then((res) => res.text())
    .then((responseMessage) => {
      picMessage.textContent = responseMessage;
      picMessage.style.color = "green";
    })
    .catch((err) => {
      picMessage.textContent = "Upload unsuccessful.";
      picMessage.style.color = "red";
    });
});

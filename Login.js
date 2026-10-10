if (!localStorage.getItem("username")) {
  localStorage.setItem("username", "admin");
  localStorage.setItem("password", "1234");
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");

  if (username === storedUsername && password === storedPassword) {
    alert("Login successful!");
    window.location.href = "Index Page.html";
  } else {
    alert("Invalid username or password");
  }
}

function openForgotPassword() {
  document.getElementById("forgotPasswordModal").style.display = "block";
}

function closeForgotPassword() {
  document.getElementById("forgotPasswordModal").style.display = "none";
}

function resetPassword() {
  const username = document.getElementById("resetUsername").value;
  const newPassword = document.getElementById("newPassword").value;

  const storedUsername = localStorage.getItem("username");

  if (username === storedUsername) {
    localStorage.setItem("password", newPassword);
    alert("Password reset successfully!");
    closeForgotPassword();
  } else {
    alert("Username not found");
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("forgotPasswordModal");
  if (event.target == modal) {
    closeForgotPassword();
  }
};

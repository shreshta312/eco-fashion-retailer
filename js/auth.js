// =============================
// Authentication Functionality
// Frontend-only demo using localStorage
// =============================

function getUsers() {
  return JSON.parse(localStorage.getItem("ecoUsers")) || [];
}

function saveUsers(users) {
  localStorage.setItem("ecoUsers", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("ecoCurrentUser"));
}

function saveCurrentUser(user) {
  localStorage.setItem("ecoCurrentUser", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("ecoCurrentUser");
  showToast("Logged out successfully.");
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 800);
}

function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = getUsers();

  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    alert("User already exists. Please login.");
    window.location.href = "login.html";
    return;
  }

  const newUser = {
    id: "USER" + Date.now(),
    name,
    email,
    password,
    greenPoints: 0,
    joinedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  saveCurrentUser({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    greenPoints: newUser.greenPoints
  });

  showToast("Registration successful.");

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 900);
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const users = getUsers();

  const matchedUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!matchedUser) {
    alert("Invalid email or password.");
    return;
  }

  saveCurrentUser({
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    greenPoints: matchedUser.greenPoints || 0
  });

  showToast("Login successful.");

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 900);
}

function updateAuthIcon() {
  const currentUser = getCurrentUser();
  const userLinks = document.querySelectorAll('.header-icons a[href="login.html"], .header-icons a[href="pages/login.html"]');

  userLinks.forEach((link) => {
    if (currentUser) {
      link.innerHTML = `<i class="fas fa-user-check"></i>`;
      link.title = currentUser.name;
    } else {
      link.innerHTML = `<i class="fas fa-user"></i>`;
      link.title = "Login";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateAuthIcon();

  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});
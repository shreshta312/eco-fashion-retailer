// =============================
// Main UI Functionality
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-btn");
  const searchButton = document.getElementById("search-btn");
  const navbar = document.getElementById("navbar");
  const searchForm = document.getElementById("search-form");

  if (menuButton && navbar) {
    menuButton.addEventListener("click", () => {
      navbar.classList.toggle("active");

      if (searchForm) {
        searchForm.classList.remove("active");
      }
    });
  }

  if (searchButton && searchForm) {
    searchButton.addEventListener("click", () => {
      searchForm.classList.toggle("active");

      if (navbar) {
        navbar.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", () => {
    if (navbar) {
      navbar.classList.remove("active");
    }

    if (searchForm) {
      searchForm.classList.remove("active");
    }
  });
});

// =============================
// Small Toast Message
// =============================

function showToast(message) {
  const existingToast = document.querySelector(".success-message");

  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "success-message";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}
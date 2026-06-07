// =============================
// Product Search Functionality
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (!searchForm || !searchInput || !searchResults) return;

  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.trim().toLowerCase();

    if (searchText === "") {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
      return;
    }

    if (!window.productData || !Array.isArray(window.productData)) {
      searchResults.innerHTML = "<p>Product data not available.</p>";
      searchResults.style.display = "block";
      return;
    }

    const matchedProducts = window.productData.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText) ||
        product.material.toLowerCase().includes(searchText) ||
        product.certification.toLowerCase().includes(searchText) ||
        product.badges.some((badge) => badge.toLowerCase().includes(searchText))
      );
    });

    showSearchResults(matchedProducts);
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchText = searchInput.value.trim().toLowerCase();

    if (searchText === "") return;

    const matchedProduct = window.productData?.find((product) =>
      product.name.toLowerCase().includes(searchText)
    );

    if (matchedProduct && typeof showProductImpact === "function") {
      showProductImpact(matchedProduct.id);
      searchResults.style.display = "none";
      searchInput.value = "";
    }
  });
});

function showSearchResults(matchedProducts) {
  const searchResults = document.getElementById("search-results");

  if (!searchResults) return;

  if (matchedProducts.length === 0) {
    searchResults.innerHTML = `
      <div class="search-result-item">
        <p>No matching sustainable products found.</p>
      </div>
    `;
    searchResults.style.display = "block";
    return;
  }

  searchResults.innerHTML = matchedProducts
    .map(
      (product) => `
        <div class="search-result-item" onclick="handleSearchResultClick(${product.id})">
          <h4>${product.name}</h4>
          <p>${product.category} • ${product.material} • Eco Score ${product.ecoScore}/100</p>
        </div>
      `
    )
    .join("");

  searchResults.style.display = "block";
}

function handleSearchResultClick(productId) {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (searchInput) {
    searchInput.value = "";
  }

  if (searchResults) {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
  }

  if (typeof showProductImpact === "function") {
    showProductImpact(productId);
  }
}
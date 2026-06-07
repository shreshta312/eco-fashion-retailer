// =============================
// Product Rendering
// =============================

function getImagePath(imagePath) {
  const isInsidePagesFolder = window.location.pathname.includes("/pages/");

  if (isInsidePagesFolder) {
    return `../${imagePath}`;
  }

  return imagePath;
}

function createProductCard(product) {
  const badgesHTML = product.badges
    .map((badge) => `<span class="eco-badge">${badge}</span>`)
    .join("");

  return `
    <div class="product-card">
      <img src="${getImagePath(product.image)}" alt="${product.name}" />

      <h3>${product.name}</h3>

      <p class="product-price">₹${product.price}</p>

      <span class="eco-score">Eco Score: ${product.ecoScore}/100</span>

      <div class="product-meta">
        <p><strong>Material:</strong> ${product.material}</p>
        <p><strong>Certified:</strong> ${product.certification}</p>
        <p><strong>Green Points:</strong> +${product.rewardPoints}</p>
      </div>

      <div class="badge-list">
        ${badgesHTML}
      </div>

      <div class="product-actions">
        <button class="view-impact-btn" onclick="showProductImpact(${product.id})">
          View Impact
        </button>

        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function renderFeaturedProducts() {
  const featuredProductsContainer = document.getElementById("featured-products");

  if (!featuredProductsContainer) return;

  if (!window.productData || !Array.isArray(window.productData)) {
    featuredProductsContainer.innerHTML = "<p>Product data not available.</p>";
    return;
  }

  const featuredProducts = window.productData.slice(0, 8);

  featuredProductsContainer.innerHTML = featuredProducts
    .map((product) => createProductCard(product))
    .join("");
}

function renderCategoryProducts(categoryName) {
  const categoryProductsContainer = document.getElementById("category-products");

  if (!categoryProductsContainer) return;

  if (!window.productData || !Array.isArray(window.productData)) {
    categoryProductsContainer.innerHTML = "<p>Product data not available.</p>";
    return;
  }

  const filteredProducts = window.productData.filter(
    (product) => product.category === categoryName
  );

  if (filteredProducts.length === 0) {
    categoryProductsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  categoryProductsContainer.innerHTML = filteredProducts
    .map((product) => createProductCard(product))
    .join("");
}

// =============================
// Product Impact Modal
// =============================

function showProductImpact(productId) {
  if (!window.productData || !Array.isArray(window.productData)) return;

  const product = window.productData.find(
    (item) => item.id === Number(productId)
  );

  if (!product) return;

  const modal = document.createElement("div");
  modal.className = "impact-modal-overlay";

  modal.innerHTML = `
    <div class="impact-modal">
      <button class="modal-close-btn" onclick="closeProductImpactModal()">
        <i class="fas fa-times"></i>
      </button>

      <h2>${product.name}</h2>
      <p class="modal-description">${product.description}</p>

      <div class="impact-details">
        <div>
          <h3>${product.ecoScore}/100</h3>
          <p>Eco Score</p>
        </div>

        <div>
          <h3>${product.waterSaved} L</h3>
          <p>Water Saved</p>
        </div>

        <div>
          <h3>${product.co2Saved} kg</h3>
          <p>CO₂ Reduced</p>
        </div>

        <div>
          <h3>+${product.rewardPoints}</h3>
          <p>Green Points</p>
        </div>
      </div>

      <div class="modal-info">
        <p><strong>Material:</strong> ${product.material}</p>
        <p><strong>Certification:</strong> ${product.certification}</p>
        <p><strong>Why it matters:</strong> This product supports conscious fashion by using lower-impact materials and sustainable production practices.</p>
      </div>

      <button class="modal-cart-btn" onclick="addToCart(${product.id}); closeProductImpactModal();">
        Add to Cart
      </button>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeProductImpactModal() {
  const modal = document.querySelector(".impact-modal-overlay");

  if (modal) {
    modal.remove();
  }
}

// =============================
// Initialize
// =============================

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedProducts();
});
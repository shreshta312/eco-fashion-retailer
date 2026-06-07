// =============================
// Cart Functionality
// =============================

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getImagePathForCart(imagePath) {
  const isInsidePagesFolder = window.location.pathname.includes("/pages/");

  if (isInsidePagesFolder) {
    return `../${imagePath}`;
  }

  return imagePath;
}

function formatPrice(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");

  if (!cartCount) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = totalItems;
}

function addToCart(productId) {
  if (!window.productData || !Array.isArray(window.productData)) {
    console.error("Product data is not loaded.");
    return;
  }

  const product = window.productData.find(
    (item) => item.id === Number(productId)
  );

  if (!product) {
    console.error("Product not found.");
    return;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      material: product.material,
      certification: product.certification,
      ecoScore: product.ecoScore,
      waterSaved: product.waterSaved,
      co2Saved: product.co2Saved,
      rewardPoints: product.rewardPoints,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();

  if (typeof showToast === "function") {
    showToast(`${product.name} added to cart`);
  }
}

function removeFromCart(productId) {
  let cart = getCart();

  cart = cart.filter((item) => item.id !== Number(productId));

  saveCart(cart);
  updateCartCount();

  if (typeof renderCartPage === "function") {
    renderCartPage();
  }
}

function updateCartQuantity(productId, newQuantity) {
  const cart = getCart();
  const item = cart.find((product) => product.id === Number(productId));

  if (!item) return;

  const quantity = Number(newQuantity);

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = quantity;

  saveCart(cart);
  updateCartCount();

  if (typeof renderCartPage === "function") {
    renderCartPage();
  }
}

function clearCart() {
  const cart = getCart();

  if (cart.length === 0) return;

  const confirmClear = confirm("Are you sure you want to clear your cart?");

  if (!confirmClear) return;

  localStorage.removeItem("cart");
  updateCartCount();

  if (typeof renderCartPage === "function") {
    renderCartPage();
  }
}

function calculateCartSummary() {
  const cart = getCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = cart.length > 0 ? 50 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const waterSaved = cart.reduce(
    (sum, item) => sum + item.waterSaved * item.quantity,
    0
  );

  const co2Saved = cart.reduce(
    (sum, item) => sum + item.co2Saved * item.quantity,
    0
  );

  const rewardPoints = cart.reduce(
    (sum, item) => sum + item.rewardPoints * item.quantity,
    0
  );

  return {
    subtotal,
    shipping,
    tax,
    total,
    waterSaved,
    co2Saved,
    rewardPoints
  };
}

// =============================
// Cart Page Rendering
// =============================

function renderCartPage() {
  const cartItemsContainer = document.getElementById("cart-items-container");

  if (!cartItemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>Explore our sustainable fashion products and add items to your cart.</p>
        <a href="../index.html#products" class="continue-shopping-btn">
          Continue Shopping
        </a>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${getImagePathForCart(item.image)}" alt="${item.name}">
            </div>

            <div class="cart-item-details">
              <h3>${item.name}</h3>
              <p class="cart-item-price">${formatPrice(item.price)}</p>

              <p class="cart-item-meta">
                <strong>Material:</strong> ${item.material}
              </p>

              <p class="cart-item-meta">
                <strong>Certified:</strong> ${item.certification}
              </p>

              <div class="cart-item-impact">
                <span class="cart-impact-badge">Eco Score ${item.ecoScore}/100</span>
                <span class="cart-impact-badge">${item.waterSaved} L water saved</span>
                <span class="cart-impact-badge">${item.co2Saved} kg CO₂ reduced</span>
                <span class="cart-impact-badge">+${item.rewardPoints} points</span>
              </div>
            </div>

            <div class="cart-item-actions">
              <p class="item-total">${formatPrice(item.price * item.quantity)}</p>

              <div class="quantity-control">
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">
                  -
                </button>

                <span>${item.quantity}</span>

                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">
                  +
                </button>
              </div>

              <button class="remove-btn" onclick="removeFromCart(${item.id})">
                Remove
              </button>
            </div>
          </div>
        `
      )
      .join("");
  }

  updateCartSummaryUI();
}

function updateCartSummaryUI() {
  const summary = calculateCartSummary();

  const subtotalElement = document.getElementById("cart-subtotal");
  const shippingElement = document.getElementById("cart-shipping");
  const taxElement = document.getElementById("cart-tax");
  const totalElement = document.getElementById("cart-total");

  const waterSavedElement = document.getElementById("cart-water-saved");
  const co2SavedElement = document.getElementById("cart-co2-saved");
  const rewardPointsElement = document.getElementById("cart-reward-points");

  const checkoutButton = document.getElementById("checkout-btn");

  if (subtotalElement) subtotalElement.textContent = formatPrice(summary.subtotal);
  if (shippingElement) shippingElement.textContent = formatPrice(summary.shipping);
  if (taxElement) taxElement.textContent = formatPrice(summary.tax);
  if (totalElement) totalElement.textContent = formatPrice(summary.total);

  if (waterSavedElement) {
    waterSavedElement.textContent = `${summary.waterSaved.toFixed(0)} L`;
  }

  if (co2SavedElement) {
    co2SavedElement.textContent = `${summary.co2Saved.toFixed(1)} kg`;
  }

  if (rewardPointsElement) {
    rewardPointsElement.textContent = summary.rewardPoints;
  }

  const cart = getCart();

  if (checkoutButton) {
    if (cart.length === 0) {
      checkoutButton.classList.add("disabled");
    } else {
      checkoutButton.classList.remove("disabled");
    }
  }
}

// =============================
// Initialize
// =============================

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartPage();
});
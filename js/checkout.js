// =============================
// Checkout Functionality
// =============================

function renderCheckoutSummary() {
  const checkoutItems = document.getElementById("checkout-items");

  if (!checkoutItems) return;

  const cart = getCart();

  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  checkoutItems.innerHTML = cart
    .map(
      (item) => `
        <div class="checkout-item">
          <div>
            <h3>${item.name}</h3>
            <p>Qty: ${item.quantity} • Eco Score ${item.ecoScore}/100</p>
          </div>

          <span class="checkout-item-price">
            ${formatPrice(item.price * item.quantity)}
          </span>
        </div>
      `
    )
    .join("");

  const summary = calculateCartSummary();

  document.getElementById("checkout-subtotal").textContent = formatPrice(summary.subtotal);
  document.getElementById("checkout-shipping").textContent = formatPrice(summary.shipping);
  document.getElementById("checkout-tax").textContent = formatPrice(summary.tax);
  document.getElementById("checkout-total").textContent = formatPrice(summary.total);

  document.getElementById("checkout-water-saved").textContent =
    `${summary.waterSaved.toFixed(0)} L`;

  document.getElementById("checkout-co2-saved").textContent =
    `${summary.co2Saved.toFixed(1)} kg`;

  document.getElementById("checkout-reward-points").textContent =
    summary.rewardPoints;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    window.location.href = "cart.html";
    return;
  }

  const summary = calculateCartSummary();

  const order = {
    orderId: "ECO" + Date.now(),
    orderDate: new Date().toISOString(),

    customer: {
      fullName: document.getElementById("fullName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      pincode: document.getElementById("pincode").value.trim()
    },

    paymentMethod: document.getElementById("paymentMethod").value,

    items: cart,

    subtotal: summary.subtotal,
    shipping: summary.shipping,
    tax: summary.tax,
    total: summary.total,

    ecoImpact: {
      waterSaved: summary.waterSaved,
      co2Saved: summary.co2Saved,
      rewardPoints: summary.rewardPoints
    },

    status: "Pending Payment"
  };

  localStorage.setItem("currentOrder", JSON.stringify(order));

  window.location.href = "payment.html";
}

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutSummary();

  const checkoutForm = document.getElementById("checkout-form");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }
});
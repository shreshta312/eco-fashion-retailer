// =============================
// Order Confirmation Functionality
// =============================

function getConfirmedOrder() {
  return JSON.parse(localStorage.getItem("currentOrder"));
}

function renderOrderConfirmation() {
  const order = getConfirmedOrder();

  if (!order) {
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("order-id").textContent = order.orderId;
  document.getElementById("order-date").textContent = formatDate(order.orderDate);
  document.getElementById("payment-status").textContent = order.paymentStatus || "Paid";
  document.getElementById("order-status").textContent = order.status || "Confirmed";

  document.getElementById("customer-name").textContent = order.customer.fullName;
  document.getElementById("customer-phone").textContent = `Phone: ${order.customer.phone}`;
  document.getElementById("customer-address").textContent =
    `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;

  document.getElementById("confirm-water-saved").textContent =
    `${order.ecoImpact.waterSaved.toFixed(0)} L`;

  document.getElementById("confirm-co2-saved").textContent =
    `${order.ecoImpact.co2Saved.toFixed(1)} kg`;

  document.getElementById("confirm-reward-points").textContent =
    order.ecoImpact.rewardPoints;

  const confirmedItems = document.getElementById("confirmed-items");

  confirmedItems.innerHTML = order.items
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

  document.getElementById("confirm-subtotal").textContent =
    formatPrice(order.subtotal);

  document.getElementById("confirm-shipping").textContent =
    formatPrice(order.shipping);

  document.getElementById("confirm-tax").textContent =
    formatPrice(order.tax);

  document.getElementById("confirm-total").textContent =
    formatPrice(order.total);
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderOrderConfirmation();
});
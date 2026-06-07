// =============================
// Invoice Functionality
// =============================

function getInvoiceOrder() {
  return JSON.parse(localStorage.getItem("currentOrder"));
}

function renderInvoice() {
  const order = getInvoiceOrder();

  if (!order) {
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("invoice-id").textContent =
    "INV-" + order.orderId;

  document.getElementById("invoice-order-id").textContent =
    order.orderId;

  document.getElementById("invoice-date").textContent =
    formatInvoiceDate(order.orderDate);

  document.getElementById("invoice-payment-status").textContent =
    order.paymentStatus || "Paid";

  document.getElementById("invoice-customer-name").textContent =
    order.customer.fullName;

  document.getElementById("invoice-customer-phone").textContent =
    `Phone: ${order.customer.phone}`;

  document.getElementById("invoice-customer-address").textContent =
    `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;

  const invoiceItems = document.getElementById("invoice-items");

  invoiceItems.innerHTML = order.items
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.ecoScore}/100</td>
          <td>${formatPrice(item.price)}</td>
          <td>${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
    )
    .join("");

  document.getElementById("invoice-water-saved").textContent =
    `${order.ecoImpact.waterSaved.toFixed(0)} L`;

  document.getElementById("invoice-co2-saved").textContent =
    `${order.ecoImpact.co2Saved.toFixed(1)} kg`;

  document.getElementById("invoice-reward-points").textContent =
    order.ecoImpact.rewardPoints;

  document.getElementById("invoice-subtotal").textContent =
    formatPrice(order.subtotal);

  document.getElementById("invoice-shipping").textContent =
    formatPrice(order.shipping);

  document.getElementById("invoice-tax").textContent =
    formatPrice(order.tax);

  document.getElementById("invoice-total").textContent =
    formatPrice(order.total);
}

function formatInvoiceDate(dateString) {
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
  renderInvoice();
});
// =============================
// Payment Functionality
// =============================

function getCurrentOrder() {
  return JSON.parse(localStorage.getItem("currentOrder"));
}

function saveCurrentOrder(order) {
  localStorage.setItem("currentOrder", JSON.stringify(order));
}

function renderPaymentPage() {
  const order = getCurrentOrder();

  if (!order || !order.items || order.items.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  document.getElementById("selected-payment-method").textContent =
    order.paymentMethod;

  const paymentItems = document.getElementById("payment-items");

  paymentItems.innerHTML = order.items
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

  document.getElementById("payment-subtotal").textContent =
    formatPrice(order.subtotal);

  document.getElementById("payment-shipping").textContent =
    formatPrice(order.shipping);

  document.getElementById("payment-tax").textContent =
    formatPrice(order.tax);

  document.getElementById("payment-total").textContent =
    formatPrice(order.total);

  document.getElementById("payment-water-saved").textContent =
    `${order.ecoImpact.waterSaved.toFixed(0)} L`;

  document.getElementById("payment-co2-saved").textContent =
    `${order.ecoImpact.co2Saved.toFixed(1)} kg`;

  document.getElementById("payment-reward-points").textContent =
    order.ecoImpact.rewardPoints;

  showPaymentFields(order.paymentMethod);
}

function showPaymentFields(paymentMethod) {
  const upiFields = document.getElementById("upi-fields");
  const cardFields = document.getElementById("card-fields");
  const netbankingFields = document.getElementById("netbanking-fields");
  const codFields = document.getElementById("cod-fields");

  upiFields.style.display = "none";
  cardFields.style.display = "none";
  netbankingFields.style.display = "none";
  codFields.style.display = "none";

  document.getElementById("upiId").required = false;
  document.getElementById("cardNumber").required = false;
  document.getElementById("expiryDate").required = false;
  document.getElementById("cvv").required = false;
  document.getElementById("cardName").required = false;
  document.getElementById("bankName").required = false;

  if (paymentMethod === "UPI") {
    upiFields.style.display = "block";
    document.getElementById("upiId").required = true;
  } else if (paymentMethod === "Card") {
    cardFields.style.display = "block";
    document.getElementById("cardNumber").required = true;
    document.getElementById("expiryDate").required = true;
    document.getElementById("cvv").required = true;
    document.getElementById("cardName").required = true;
  } else if (paymentMethod === "Net Banking") {
    netbankingFields.style.display = "block";
    document.getElementById("bankName").required = true;
  } else if (paymentMethod === "Cash on Delivery") {
    codFields.style.display = "block";
  }
}

function handlePaymentSubmit(event) {
  event.preventDefault();

  const order = getCurrentOrder();

  if (!order) {
    window.location.href = "cart.html";
    return;
  }

  order.status = "Confirmed";
  order.paymentStatus =
    order.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid";
  order.paymentDate = new Date().toISOString();

  if (order.paymentMethod === "UPI") {
    order.paymentDetails = {
      method: "UPI",
      upiId: document.getElementById("upiId").value.trim()
    };
  } else if (order.paymentMethod === "Card") {
    order.paymentDetails = {
      method: "Card",
      cardNumber: maskCardNumber(document.getElementById("cardNumber").value),
      cardName: document.getElementById("cardName").value.trim()
    };
  } else if (order.paymentMethod === "Net Banking") {
    order.paymentDetails = {
      method: "Net Banking",
      bankName: document.getElementById("bankName").value
    };
  } else {
    order.paymentDetails = {
      method: "Cash on Delivery"
    };
  }

  saveCurrentOrder(order);

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart");
  updateCartCount();

  window.location.href = "order_conf.html";
}

function maskCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/\s/g, "");

  if (cleanNumber.length < 4) {
    return "****";
  }

  return `**** **** **** ${cleanNumber.slice(-4)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderPaymentPage();

  const paymentForm = document.getElementById("payment-form");

  if (paymentForm) {
    paymentForm.addEventListener("submit", handlePaymentSubmit);
  }
});
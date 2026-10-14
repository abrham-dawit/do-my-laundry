// Do My Laundry — orders live in localStorage in this demo version.
const KEY = "do-my-laundry-orders-v1";
const STATUSES = ["Requested", "Picked up", "Washing", "Out for delivery", "Done"];

function loadOrders() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch (e) { return []; }
}
function saveOrders(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

let orders = loadOrders();

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function selectedServices() {
  return [...document.querySelectorAll(".svc:checked")].map(c => ({
    name: c.value, price: Number(c.dataset.price), flat: c.value.includes("rush"),
  }));
}

function estimate() {
  const bags = Math.max(1, Number(document.getElementById("fBags").value) || 1);
  return selectedServices().reduce((sum, s) => sum + (s.flat ? s.price : s.price * bags), 0);
}

function updateEstimate() {
  document.getElementById("estimate").textContent = "$" + estimate();
}
document.querySelectorAll(".svc, #fBags").forEach(el => {
  el.addEventListener("change", updateEstimate);
  el.addEventListener("input", updateEstimate);
});
updateEstimate();

document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const services = selectedServices();
  if (!services.length) {
    document.getElementById("formMsg").textContent = "Pick at least one service first.";
    return;
  }
  const bags = Math.max(1, Number(document.getElementById("fBags").value) || 1);
  const order = {
    id: "DML-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
    name: document.getElementById("fName").value.trim(),
    address: document.getElementById("fAddress").value.trim(),
    date: document.getElementById("fDate").value,
    time: document.getElementById("fTime").value,
    bags,
    services: services.map(s => s.name),
    total: estimate(),
    notes: document.getElementById("fNotes").value.trim(),
    status: 0,
    ts: Date.now(),
  };
  orders.unshift(order);
  saveOrders(orders);
  e.target.reset();
  document.getElementById("fBags").value = 1;
  document.querySelector('.svc[value^="Wash"]').checked = true;
  updateEstimate();
  document.getElementById("formMsg").textContent = `Pickup requested! Your order number is ${order.id} — track it below.`;
  render();
  document.getElementById("orders").scrollIntoView({ behavior: "smooth" });
});

function render() {
  const list = document.getElementById("orderList");
  document.getElementById("noOrders").style.display = orders.length ? "none" : "block";
  document.getElementById("orderCount").textContent = orders.length ? `— ${orders.length} order${orders.length === 1 ? "" : "s"}` : "";

  list.innerHTML = orders.map(o => `
    <article class="order-card">
      <div class="order-top">
        <h4>${esc(o.name)} — ${o.bags} bag${o.bags === 1 ? "" : "s"}</h4>
        <span class="order-id">${o.id} · est. $${o.total}</span>
      </div>
      <p class="order-detail">
        Pickup: <strong>${esc(o.date)}</strong>, ${esc(o.time)} · ${esc(o.address)}<br>
        Services: ${o.services.map(esc).join(", ")}
        ${o.notes ? `<br>Notes: ${esc(o.notes)}` : ""}
      </p>
      <div class="status-track">
        ${STATUSES.map((s, i) => `<div class="step ${i <= o.status ? "done" : ""}">${s}</div>`).join("")}
      </div>
      <div class="order-actions">
        ${o.status < STATUSES.length - 1
          ? `<button class="btn-small" data-advance="${o.id}">Simulate next step → ${STATUSES[o.status + 1]}</button>`
          : `<span class="order-id">✅ Completed</span>`}
        <button class="btn-small btn-cancel" data-cancel="${o.id}">Cancel order</button>
      </div>
    </article>`).join("");

  list.querySelectorAll("[data-advance]").forEach(btn => {
    btn.addEventListener("click", () => {
      const o = orders.find(x => x.id === btn.dataset.advance);
      if (o && o.status < STATUSES.length - 1) { o.status++; saveOrders(orders); render(); }
    });
  });
  list.querySelectorAll("[data-cancel]").forEach(btn => {
    btn.addEventListener("click", () => {
      orders = orders.filter(x => x.id !== btn.dataset.cancel);
      saveOrders(orders);
      render();
    });
  });
}

render();

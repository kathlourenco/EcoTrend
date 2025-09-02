(() => {
  const LS_KEY = "ecotrend.cart";
  const BRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const parsePrice = (txt) =>
    Number(
      String(txt || "0")
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
    ) || 0;
  const slug = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
    renderCart();
  }
  function totalCart(cart = loadCart()) {
    return cart.reduce((s, it) => s + it.price * it.qty, 0);
  }

  function readCardData(card) {
    const name =
      card.dataset.name ||
      card.querySelector("h3")?.innerText?.trim() ||
      "Produto";
    const priceText =
      card.dataset.price ||
      card.querySelector(".product-price")?.innerText ||
      "R$ 0,00";
    const price = Number(card.dataset.price) || parsePrice(priceText);
    const id = card.dataset.id || slug(name);
    const img = card.querySelector("img")?.getAttribute("src") || "";
    return { id, name, price, img };
  }

  function addToCart(item) {
    const cart = loadCart();
    const i = cart.findIndex((x) => x.id === item.id);
    if (i > -1) cart[i].qty += item.qty || 1;
    else
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img || "",
        qty: item.qty || 1,
      });
    saveCart(cart);
    openCart();
  }
  function removeAt(index) {
    const cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
  }
  function setQty(index, qty) {
    const cart = loadCart();
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, qty | 0);
    saveCart(cart);
  }
  function clearCart() {
    localStorage.setItem(LS_KEY, JSON.stringify([]));
    renderCart();
  }

  function renderCart() {
    const wrap = $("#cartSidebar");
    if (!wrap) return;
    const list = $("#cartItems", wrap);
    const totalEl = $("#cartTotal", wrap);

    const cart = loadCart();
    if (!list || !totalEl) return;

    if (cart.length === 0) {
      list.innerHTML = `<p style="margin:8px 0;color:#666">Seu carrinho está vazio.</p>`;
      totalEl.textContent = "0,00";
      return;
    }

    list.innerHTML = cart
      .map(
        (it, i) => `
    <div class="cart-line" data-i="${i}">
      <img src="${it.img || "/src/imgs/bolsa.png"}" alt="${it.name}">
      <div class="cart-line-details">
        <div class="cart-line-title">${it.name}</div>
        <div class="cart-line-price">${BRL.format(it.price)}</div>
        <div class="qty">
          <button class="btn-dec" aria-label="Diminuir">-</button>
          <input class="inp-qty" type="number" min="1" value="${it.qty}">
          <button class="btn-inc" aria-label="Aumentar">+</button>
        </div>
      </div>
      <div class="cart-line-subtotal">
        <div class="subtotal-price">${BRL.format(it.price * it.qty)}</div>
        <button class="btn-rm">Remover</button>
      </div>
    </div>
  `
      )
      .join("");

    totalEl.textContent = BRL.format(totalCart(cart))
      .replace("R$ ", "")
      .replace("R$", "");
  }

  function openCart() {
    const s = $("#cartSidebar");
    if (s) s.style.right = "0px";
  }
  function closeCart() {
    const s = $("#cartSidebar");
    if (s) s.style.right = "-300%";
  }
  function toggleCart() {
    const s = $("#cartSidebar");
    if (!s) return;
    s.style.display = getComputedStyle(s).right === "0px" ? "-300%" : "0px";
  }

  window.closeCart = closeCart;

  document.addEventListener("DOMContentLoaded", () => {
    $("#carrinho")?.addEventListener("click", toggleCart);

    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest(".bx-cart-add");
      if (!btn) return;
      const card = btn.closest(".product-card");
      if (!card) return;
      const p = readCardData(card);
      if (!p.price || !p.name)
        return console.warn("Card sem dados suficientes", card);
      addToCart(p);
    });

    const sidebar = $("#cartSidebar");
    if (sidebar) {
      sidebar.addEventListener("click", (e) => {
        const line = e.target.closest(".cart-line");
        if (!line) return;
        const i = Number(line.dataset.i);

        if (e.target.classList.contains("btn-rm")) {
          removeAt(i);
        } else if (e.target.classList.contains("btn-inc")) {
          const qtyInp = line.querySelector(".inp-qty");
          setQty(i, Number(qtyInp.value) + 1);
        } else if (e.target.classList.contains("btn-dec")) {
          const qtyInp = line.querySelector(".inp-qty");
          setQty(i, Math.max(1, Number(qtyInp.value) - 1));
        }
      });

      sidebar.addEventListener("change", (e) => {
        if (!e.target.classList.contains("inp-qty")) return;
        const line = e.target.closest(".cart-line");
        const i = Number(line.dataset.i);
        setQty(i, Number(e.target.value));
      });
    }

    renderCart();

    window.addEventListener("storage", (ev) => {
      if (ev.key === LS_KEY) renderCart();
    });
  });
})();

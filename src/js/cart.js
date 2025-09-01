// Carrinho EcoTrend — LocalStorage
(() => {
  const LS_KEY = "ecotrend.cart";
  const BRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // --------- Helpers ---------
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

  // Lê dados do card (funciona para cards estáticos e renderizados pela API)
  function readCardData(card) {
    // Preferir data-attributes se presentes (opcional você adicionar)
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

  // --------- Ações do carrinho ---------
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

  // --------- Renderização do sidebar ---------
  function renderCart() {
    const wrap = $("#cartSidebar"); // já existe no seu HTML
    if (!wrap) return; // página sem sidebar
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
        <div class="cart-line" data-i="${i}" style="display:grid;grid-template-columns:48px 1fr auto;gap:10px;align-items:center;margin:8px 0;">
          <img src="${it.img || "../imgs/bolsa.png"}" alt="${
          it.name
        }" style="width:48px;height:48px;object-fit:cover;border-radius:8px;background:#eee">
          <div>
            <div style="font-weight:600">${it.name}</div>
            <div style="font-size:.9rem;color:#555">${BRL.format(
              it.price
            )}</div>
            <div class="qty" style="margin-top:6px;display:flex;gap:6px;align-items:center">
              <button class="btn-dec" aria-label="Diminuir" style="padding:2px 8px">-</button>
              <input class="inp-qty" type="number" min="1" value="${
                it.qty
              }" style="width:60px;padding:4px 6px">
              <button class="btn-inc" aria-label="Aumentar" style="padding:2px 8px">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700">${BRL.format(it.price * it.qty)}</div>
            <button class="btn-rm" style="margin-top:6px">Remover</button>
          </div>
        </div>
      `
      )
      .join("");

    totalEl.textContent = BRL.format(totalCart(cart))
      .replace("R$ ", "")
      .replace("R$", "");
  }

  // --------- Abrir/fechar sidebar ---------
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

  // Expor closeCart() porque seu HTML chama esse handler no botão
  window.closeCart = closeCart;

  // --------- Eventos globais ---------
  document.addEventListener("DOMContentLoaded", () => {
    // 1) Clique no ícone de carrinho do header
    $("#carrinho")?.addEventListener("click", toggleCart);

    // 2) Delegação: clicar no ícone "bx-cart-add" de QUALQUER product-card
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

    // 3) Controles de quantidade/remover dentro do sidebar (delegação)
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

    // 4) Render inicial
    renderCart();

    // 5) Sincronizar entre abas
    window.addEventListener("storage", (ev) => {
      if (ev.key === LS_KEY) renderCart();
    });
  });
})();

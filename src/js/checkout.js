document.addEventListener("DOMContentLoaded", () => {
    const LS_KEY = "ecotrend.cart";
    const BRL = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const cart = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    const checkoutCartContainer = document.getElementById("checkoutCart");
    const checkoutTotalElement = document.getElementById("checkoutTotal");

    let total = 0;

    if (cart.length === 0) {
        checkoutCartContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        checkoutCartContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal; 

            return `
                <div class="checkout-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="checkout-item-details">
                        <h4>${item.name} (x${item.qty})</h4>
                        <span>${BRL.format(itemTotal)}</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    checkoutTotalElement.textContent = BRL.format(total).replace("R$", "").trim();

    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (cart.length > 0) {
            alert("Pedido confirmado! Obrigado por comprar na EcoTrend 🌱");
            localStorage.removeItem(LS_KEY);
            window.location.href = "../../index.html"; 
        } else {
            alert("Seu carrinho está vazio!");
        }
    });
});
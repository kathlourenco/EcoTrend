
const cartBtn = document.querySelectorAll('.bx-cart-add');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const topCart = document.getElementById('carrinho');
let total = 0;

topCart.addEventListener('click', () => {
    if(cartSidebar.style.right === '0px'){
        cartSidebar.style.right = '-350px';
    } else {
        cartSidebar.style.right = '0';
    }
});

function closeCart() {
    cartSidebar.style.right = '-350px';
}

cartBtn.forEach(btn => {
    btn.addEventListener('click', e => {
        const card = e.target.closest('.product-card');
        const name = card.querySelector('h3').innerText;
        const price = parseFloat(card.querySelector('.product-price').innerText.replace('R$ ', '').replace(',', '.'));
        const imgSrc = card.querySelector("img").getAttribute("src");

        total += price;
        cartTotal.innerText = total.toFixed(2);

        const item = document.createElement('div');
        item.classList.add('cart-item');
        item.innerHTML = `
            <img src="${imgSrc}" alt="${name}">
            <div class="cart-item-details">
                <h4>${name}</h4>
                <span>R$ ${price.toFixed(2)}</span>
            </div>
            <button class="remove-btn">&times;</button>
        `;
        cartItems.appendChild(item);

        if (!document.getElementById("btnLimpar")) {
            const btnLimpar = document.createElement('button');
            btnLimpar.id = "btnLimpar";
            btnLimpar.innerText = "Limpar Carrinho";
            btnLimpar.style.display = "block";
            btnLimpar.style.margin = "20px auto";
            btnLimpar.style.padding = "12px 20px";
            btnLimpar.style.background = "red";
            btnLimpar.style.color = "white";
            btnLimpar.style.border = "none";
            btnLimpar.style.borderRadius = "8px";
            btnLimpar.style.cursor = "pointer";
            btnLimpar.style.fontWeight = "bold";

        cartSidebar.style.right = '0'; 
    });
});

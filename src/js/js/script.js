const cartBtn = document.querySelectorAll('.bx-cart-add');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const topCart = document.getElementById('carrinho');
let total = 0;
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

topCart.addEventListener('click', () => {
    if (cartSidebar.style.right === '0px') {
        cartSidebar.style.right = '-350px';
    } else {
        cartSidebar.style.right = '0';
    }
});

function closeCart() {
    cartSidebar.style.right = '-350px';
}

function atualizarCarrinho() {
    cartItems.innerHTML = "";
    total = 0;

    carrinho.forEach((produto, index) => {
        total += produto.price;

        const item = document.createElement('div');
        item.classList.add('cart-item');
        item.innerHTML = `
            <img src="${produto.imgSrc}" alt="${produto.name}">
            <div class="cart-item-details">
                <h4>${produto.name}</h4>
                <span>R$ ${produto.price.toFixed(2)}</span>
            </div>
            <button class="remove-btn">&times;</button>
        `;


        item.querySelector('.remove-btn').addEventListener('click', () => {
            carrinho.splice(index, 1);
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            atualizarCarrinho();
        });

        cartItems.appendChild(item);
    });

    cartTotal.innerText = total.toFixed(2);
}


cartBtn.forEach(btn => {
    btn.addEventListener('click', e => {
        const card = e.target.closest('.product-card');
        const name = card.querySelector('h3').innerText;
        const price = parseFloat(card.querySelector('.product-price').innerText.replace('R$ ', '').replace(',', '.'));
        const imgSrc = card.querySelector('img').src;

        carrinho.push({ name, price, imgSrc });
        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        atualizarCarrinho();
        cartSidebar.style.right = '0';

        if (!document.getElementById("btnLimpar")) {
            const btnLimpar = document.createElement('button');
            btnLimpar.id = "btnLimpar"; // ID para evitar duplicação
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

            btnLimpar.addEventListener('click', () => {
                carrinho = [];
                localStorage.removeItem("carrinho");
                atualizarCarrinho();
            });

            cartSidebar.appendChild(btnLimpar);
        }
    });
});

atualizarCarrinho();

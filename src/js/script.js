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
        const price = parseFloat(card.querySelector('.product-price').innerText.replace('R$ ','').replace(',','.'));
        const imgSrc = card.querySelector('img').src;

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

        item.querySelector('.remove-btn').addEventListener('click', () => {
            total -= price;
            cartTotal.innerText = total.toFixed(2);
            item.remove();
        });

        cartSidebar.style.right = '0'; 
    });
});

let  cart = JSON.parse(localStorage.getItem("cart")) || [] ;
function initialezApp() {
    fetch("./maine.json")
    .then((response) => response.json())
    .then((products) => {
        let allProducts = products;
        // console.log(allProducts);
        rinderCategores(allProducts);
        renderProducts(allProducts);
    })
    .catch((error) => {
        console.log("Error Fitching Products:", error);
    });
}
function rinderCategores(products){
    const categores =[...new Set(products.map((product) => product.category))];
    console.log(categores);
    const navpar = document.getElementById("navbar");
    // Add Menu Button
    const menuBtn = document.getElementById("menu-button");
    menuBtn.addEventListener("click",()=>{
        navpar.classList.toggle("hidden");
    });
    
    navpar.innerHTML ="";
    //Update Active Claas
    function updateActiveCategory(activeItem){
        const itemActive = document.querySelectorAll(".nav-item");
        itemActive.forEach((item) =>{
            item.classList.remove("active");
            activeItem.classList.add("active");
        });
    };
    //Add All Products
    const allProductsItem = document.createElement("li");
    allProductsItem.className = "nav-item active";
    allProductsItem.textContent = "All Productes";
    allProductsItem.addEventListener("click", ()=>{
        updateActiveCategory(allProductsItem);
        renderProducts(products)
    });
    navpar.appendChild(allProductsItem);
    //Add Category Items
    categores.forEach((category) =>{
        const navItem = document.createElement("li");
        navItem.className = "nav-item";
        navItem.textContent = category;
        navItem.addEventListener("click", () =>{
            updateActiveCategory(navItem);
            const filterdCategory = products.filter((product) => product.category === category);
            renderProducts(filterdCategory)
        });
        navpar.appendChild(navItem);
    });
    //search Bay Title
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", ()=>{
        let searchValue = searchInput.value.trim().toLowerCase();
        const filterdtitle = products.filter((product) => product.title.toLowerCase().includes(searchValue)
        );
        renderProducts(filterdtitle)        
    });
};

//Display Products
function renderProducts(products) {
    const productsLeistElement = document.getElementById("product-list");
    productsLeistElement.innerHTML= "";
    products.forEach((product) => {
        let productCard = document.createElement("div");
        // in cart amount
        const cartItem = cart.find((item) => item.id === product.id.toString());
        const inCartAmount = cartItem ? cartItem.quantity : 0;
        productCard.className = "product-card";
        productCard.innerHTML = `
        <span class="id">#${product.id}</span>
        <img src="/img/${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p class="description">${product.description}</p>
        <div class="info-container">
            <p class="price"> $${product.price}</p>
            <p class="in-cart-amount">${inCartAmount > 0 ? `<span>[ ${inCartAmount} In Cart ]</span>`: ""}</p>
        </div>
        <button 
        data-id="${product.id}"
        data-title="${product.title}"
        data-price="${product.price}">
        Add To Cart
        </button>
        `;
        productsLeistElement.appendChild(productCard);
    });
    const addToCartButtons = document.querySelectorAll("button[data-id]");
    addToCartButtons.forEach((addBtn) =>{
        addBtn.addEventListener("click", addToCart)
    })
    updateCart();
    inCartAmount()
};
// add to cart 
function addToCart(event) {
    const button = event.target;
    const id = button.getAttribute("data-id");
    const title = button.getAttribute("data-title");
    const price =parseFloat(button.getAttribute("data-price")) 
    // console.log(id, title, price);
    const existingItem = cart.find((item) => item.id === id);
    if(existingItem){
        existingItem.quantity++;
    }else(
        cart.push({id , title, price, quantity :1})
    )
    localStorage.setItem("cart",JSON.stringify(cart));
    updateCart()
    
}

//Update Cart  
function updateCart() {
    const cartItem = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItem.innerHTML = "";
    cart.forEach((item) =>{
        const product = document.createElement("li");
        product.innerHTML=`
        <div>
        <h4>${item.title}</h4>
        <span>${item.price} x ${item.quantity}</span>
        </div>
        <button class="remove-btn" remove-btn="${item.id}">Delete</button>
        `;
        cartItem.appendChild(product);
    });
    cartTotal.innerHTML = cart.reduce((sum, item) => sum + item.price * item.quantity,0).toFixed(2);
    const removeButtons = document.querySelectorAll("button");
    removeButtons.forEach((btn) =>{
        btn.addEventListener("click", removeFromCart);
    });
    inCartAmount()
};
//Remove From Cart
function removeFromCart(event) {
    const button = event.target;
    const id = button.getAttribute("remove-btn");
    cart = cart.filter((item) => item.id !== id )
    localStorage.setItem("cart",JSON.stringify(cart));
    updateCart();
    inCartAmount()
}
// In Cart Amount 
function inCartAmount() {
    const productsCards = document.querySelectorAll(".product-card");
    productsCards.forEach((card) =>{
        const id = card.querySelector("button").getAttribute("data-id");
        const inCartAmount = card.querySelector(".in-cart-amount");
        const cartItem = cart.find((item) => item.id === id);
        if(cartItem) {
            inCartAmount.innerHTML = `<span>[${cartItem.quantity} In Cart ]</span>`
        } else{
            inCartAmount.innerHTML = "";
        }
    })
};
// Cart Icon
const cartContainer = document.getElementById("cart-container");
const cartBtn = document.getElementById("cart-icon");
cartBtn.addEventListener("click", ()=>{
    cartContainer.classList.toggle("hidden");
});
// Close Cart by Close Btn
const closeBtn = document.getElementById("close-cart");
closeBtn.addEventListener("click", ()=>{
    cartContainer.classList.add("hidden");
});
// كله تمام والحمد لله مجهود ممتاز 
document.addEventListener("DOMContentLoaded", initialezApp);

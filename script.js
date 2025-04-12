let  cart = JSON.parse(localStorage.getItem("cart")) || [] ;
const emptyProduct = document.getElementById("empty-product");
function initializeApp() {
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
    // console.log(categores);
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
        renderProducts(products);
        navpar.classList.toggle("hidden");
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
            renderProducts(filterdCategory);
            navpar.classList.toggle("hidden");
            searchInput.value="";
        });
        navpar.appendChild(navItem);
    });
    //search Bay Title
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", ()=>{
        let searchValue = searchInput.value.trim().toLowerCase();
        const filterdtitle = products.filter((product) => product.title.toLowerCase().includes(searchValue));
        renderProducts(filterdtitle)
    });
};
//Display Products
function renderProducts(products) {
    const productsListElement = document.getElementById("product-list");
    productsListElement.innerHTML= "";
    emptyProduct.innerHTML= "";
    if(products.length === 0){
        emptyProduct.innerHTML=`No Product found`; 
    }else{
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
            productsListElement.appendChild(productCard);
        });
    };
    const addToCartButtons = document.querySelectorAll("button[data-id]");
    addToCartButtons.forEach((addBtn) =>{
        addBtn.addEventListener("click", addToCart)
    });
    updateCart();
    inCartAmount();
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
    }else{
        cart.push({id , title, price, quantity :1})
    }
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
    inCartAmount();
};
//Remove From Cart
function removeFromCart(event) {
    const button = event.target;
    const id = button.getAttribute("remove-btn");
    cart = cart.filter((item) => item.id !== id );
    localStorage.setItem("cart",JSON.stringify(cart));
    updateCart();
    inCartAmount();
};
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
        };
    });
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
// Function to update footer content based on window width
function updateFooterContent(){
    //footer 
    let footer = document.getElementById("footer");
    if(window.innerWidth <= 566 ){
        footer.innerHTML =`  
        <div>
            <div class="contact text-[#404553] w-full flex justify-center gap-[10px]  ">
                <a class="inline-block p-2 bg-[#ffca28] rounded-full" href=""><i class="fab fa-whatsapp inline-block w-5 h-5 text-center  hover:text-[#ffb300]"></i></a>
                <a class="inline-block p-2 bg-[#ffca28] rounded-full"><i class="fa-brands fa-linkedin inline-block w-5 h-5 text-center  hover:text-[#ffb300]"></i></a>
                <a class="inline-block p-2 bg-[#ffca28] rounded-full" href=""><i class="fa-brands fa-github inline-block w-5 h-5 text-center  hover:text-[#ffb300]"></i></a>
            </div>  
            <p class="block text-center">&copy; 2025 Abdulrahman Ahmed</p>
        </div>`
    }else{
        footer.innerHTML =`  
        <div class="flex items-center justify-between">        
            <p>&copy; 2025 Abdulrahman Ahmed</p>
            <div class="contact text-[#404553] flex justify-between w-[150px]">
                <a class="inline-block p-2 bg-[#ffca28] rounded-full" href="https://wa.me/201007437698"><i class="fab fa-whatsapp inline-block w-5 h-5 text-center  hover:text-[#ffb300]"></i></a>
                <a class="inline-block p-2 bg-[#ffca28] rounded-full" href="https://www.linkedin.com/in/abdelrahman-ahmed-60b468262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"><i class="fa-brands fa-linkedin inline-block w-5 h-5 text-center  hover:text-[#ffb300]"></i></a>
                <a class="inline-block p-2 bg-[#ffca28] rounded-full" href="https://abd-alrhmen.github.io/portfolio/"><i class="fa-brands fa-github inline-block w-5 h-5 text-center  hover:text-[#ffb300]"></i></a>
            </div>
        </div>`
    };
};
updateFooterContent();
window.addEventListener("resize", updateFooterContent);

// كله تمام والحمد لله مجهود ممتاز 
document.addEventListener("DOMContentLoaded", initializeApp, updateFooterContent);

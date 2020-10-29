// ============================= Load items ========================================
'use strict'

function loadItems(){
    return fetch('data/data.json')
    .then(response => response.json()) 
    .then(json => json.items); 
}

// Update the list with the given items
function displayItems(items){
    const container = document.querySelector('.viewCon');
    container.innerHTML = items.map(item => createHTMLString(item)).join('');
    
    const carts = document.querySelectorAll('.addCartBtn');
    for(let i=0; i<carts.length; i++){
        carts[i].addEventListener('click', () => {
            saveCartNumbers(items[i]);
            totalCost(items[i]);
        })
    }
}

// Create HTML div item from the given data item
function createHTMLString(item){
    return `
    <div>
        <img src="${item.image}" alt="${item.type}" class="item_thumbnail" />
        <span class="item_description">${item.gender}, ${item.size}</span>
        <button class="addCartBtn">ADD CART</button>  
    </div>
    `; 
}

let cartNumSpan = document.querySelector('.cart .cartNumSpan');

// give cart number to each item 
function saveCartNumbers(item){
    let itemNumbers = localStorage.getItem('cartNumbers');

    if(itemNumbers){
        itemNumbers = parseInt(itemNumbers);
        localStorage.setItem('cartNumbers', itemNumbers + 1);
        cartNumSpan.textContent = itemNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        cartNumSpan.textContent = 1;
    }

    setItems(item);
}

function setItems(item){
    let cartItems = localStorage.getItem('itemsInCart');
    cartItems = JSON.parse(cartItems);
    
    if(cartItems != null){
        // if clicked another item,
        if(cartItems[item.id] == undefined){
            cartItems = {...cartItems, [item.id]:item}
        }
        cartItems[item.id].inCart += 1;
    } else{
        //if nothing in cartItems,
        item.inCart = 1;
        cartItems = {[item.id]:item};
    }
    
    localStorage.setItem('itemsInCart', JSON.stringify(cartItems));
}

function totalCost(item){
    let cartCost = localStorage.getItem('totalCost');

    if(cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + item.price);
    } else {
        localStorage.setItem('totalCost', item.price);
    }
    
}

function onButtonClick(event, items){
    const dataset = event.target.dataset;
    const key = dataset.key;
    const value = dataset.value;

    if(key == null || value == null){
        return;
    }

    const filtered = items.filter(item => item[key] === value);
    displayItems(filtered);
}

function setEventListeners(items) {
    const logo = document.querySelector('.logoCon');
    const btns = document.querySelector('.btnCon');
    logo.addEventListener('click', () => displayItems(items));
    btns.addEventListener('click', event => onButtonClick(event, items));
}

function onloadCartNumbers(){
    let itemNumbers = localStorage.getItem('cartNumbers');
    if(itemNumbers){
        cartNumSpan.textContent = itemNumbers;
    }
}

function displayCart(){
    let cartItems = localStorage.getItem('itemsInCart');
    cartItems = JSON.parse(cartItems);
    let items = document.querySelector('.items');
    let cartCost = localStorage.getItem('totalCost');

    if(cartItems && items){
        items.innerHTML = '';

        Object.values(cartItems).map(cartItem => {
            items.innerHTML += `
                <div class="products">
                    <div class="product">
                        <i class="fas fa-window-close"></i>
                        <img src=${cartItem.image}>
                        <span>${cartItem.color} ${cartItem.type}</span>
                    </div>
                    <div class="price">$${cartItem.price}</div>
                    <div class="quantity">
                        <span class="up"><i class="fas fa-sort-up"></i></span>
                        <span class="value">${cartItem.inCart}</span>
                        <span class="down"><i class="fas fa-sort-down"></i></span>
                    </div>
                    <div class="total">$${cartItem.price * cartItem.inCart}</div>
                </div>
            `
        })
        items.innerHTML += `
            <div class="basketCon">
                <h4 class="basketTitle">Basket Total</h4>
                <h4 class="basketTotal">$${cartCost}</h4>
            </div>
            `
    }
}

function removeItemInCart(){
    const removeBtns = document.querySelectorAll('.products .product i');
    const productsInCart = document.querySelectorAll('.products');
    let cartCost = localStorage.getItem('totalCost');
    const totalInCart = document.querySelectorAll('.products .total');
    const basketTotal = document.querySelector('.basketTotal');
    let cartItems = localStorage.getItem('itemsInCart');
    cartItems = JSON.parse(cartItems);
    // convert object to array
    let cartItemsAry = Object.keys(cartItems).map(key => [key, cartItems[key]]);
    let cartNumbers = localStorage.getItem('cartNumbers');
    cartNumbers = parseInt(cartNumbers);
    const quantity = document.querySelectorAll('.quantity .value');

    for(let i=0; removeBtns.length; i++){
        removeBtns[i].addEventListener('click', () => {
            productsInCart[i].remove();
            cartCost = parseInt(cartCost);
            cartCost = cartCost - totalInCart[i].textContent.split("$")[1];
            basketTotal.textContent = cartCost; 
        
            const removedId = cartItemsAry[i][0];
            delete cartItems[removedId];
        
            cartNumbers = cartNumbers - parseInt(quantity[i].textContent)
            cartNumSpan.textContent = cartNumbers;
        
            const removedCart = {
                totalCost: cartCost,
                itemInCart: cartItems,
                cartNumbers: cartNumSpan.textContent
            }
                modifyLocalStorage(removedCart);
        })
    }
}

function modifyLocalStorage(removedCart){
    let cartItems = localStorage.getItem('itemsInCart');
    cartItems = JSON.stringify(removedCart.itemInCart);

    localStorage.setItem('totalCost', removedCart.totalCost);
    localStorage.setItem('itemsInCart', cartItems);
    localStorage.setItem('cartNumbers', removedCart.cartNumbers);
}

function clearAllCart(){
    localStorage.clear();
    location.reload();
}
  
// function getQuantity(){
//     let quantity = document.querySelectorAll('.quantity .value');
//     const products = document.querySelectorAll('.products');
//     const total = document.querySelectorAll('.total');

//         for(let i=0; products.length; i++){
//             if(products[i].clicked == true){
//             products[i].addEventListener('click', e => {
//                 const up = e.target;
    
//                 if(up.classList[1] == 'fa-sort-up'){
//                     const parent = up.parentElement;
//                     const grandParent = parent.parentElement;
//                     const grandGrandParent = grandParent.parentElement;
//                     const item = grandGrandParent;
//                     // convert nodelist to array
//                     const productsArr = Array.prototype.slice.call(products);
//                     const itemIndex = productsArr.indexOf(item);
    
//                     let itemsInCart = localStorage.getItem('itemsInCart');
//                     itemsInCart = JSON.parse(itemsInCart);
//                     // convert object to array
//                     let itemsInCartArr = Object.keys(itemsInCart).map(key => [key, itemsInCart[key]]);
//                     const selectedItem = itemsInCartArr[itemIndex];
//                     let selectedInCart = selectedItem[1].inCart;
//                     selectedInCart++;
    
//                     selectedItem[1].inCart = selectedInCart;
//                     localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));
//                     quantity[itemIndex].textContent = selectedItem[1].inCart;
    
//                     const totalPrice = selectedItem[1].inCart * selectedItem[1].price;
//                     total.textContent = totalPrice;
//                     // to display total cost per item
//                     location.reload();
//                }
               
//             });
//         }
//     }
    
    
// }

// *************** Call functions *******************

loadItems()
.then(items => {
    displayItems(items);
    setEventListeners(items);
})
.catch(console.log)

onloadCartNumbers();

displayCart();

// getQuantity();

removeItemInCart();








// ============================= Cart ========================================



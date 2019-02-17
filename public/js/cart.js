function init(){
    activePage();
    emptyCart();
}

function activePage(){
    const activePath = window.location.pathname;

    switch(activePath){
        case "/menu":
            document.getElementById('menu').classList.add('active');
            break;
        case "/aboutus":
            document.getElementById('menu').classList.add('active');
            break;
        case "/cart":
            document.getElementById('cart').classList.add('active');
            break;            
    }
}

function emptyCart(){
    document.getElementById('empty-cart').addEventListener("click",clearCart);
}
    
function clearCart(){
    document.getElementById('cart-list').innerHTML="<h3>Cart is Empty! &nbsp; Select items from menu to add.</h3>";
}

function removeItem(event,name){
    console.log(cart);
    if(cart.indexOf(name) === -1){
        cart.pop(name);
    }
    if(cart.length === 0){
        clearCart();
    }
    event.target.parentNode.parentNode.innerHTML = "";
    console.log(cart);
}

init();
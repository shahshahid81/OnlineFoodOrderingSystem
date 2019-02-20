function init(){
    activePage();
    setListeners();
    updateTotal();
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

function setListeners(){
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

var grandTotal = 0;

// function updateQuantity(box,price,type){
//     // document.getElementById('quantity').value = quantity;
//     // document.getElementById('total-price').innerText = quantity * parseInt(price);
//     // console.log(event);
//     // console.log(event.target.nextElementSibling);

//     console.log(box.value);
//     if(type === "inc"){
//         box.value = parseInt(quantity);
//         box.value  *=  parseInt(price);

//     } else {

//     }
    
//     updateTotal();
// }

function increment(event){
    // console.log(event);
    // console.log(event.target);
    // console.log(event.currentTarget);
    var el = event.currentTarget;
    // console.log(el.nextElementSibling);
    // console.log(el.previousElementSibling);
    // console.log(event.target.nextElementSibling);
    var box = el.previousElementSibling;
    // console.log(box.value);
    var quantity = parseInt(box.value);
    if(quantity < 10){
        quantity++;
        box.value++;
        box.innerText = "" + box.value;
        // console.log($(event.currentTarget).closest('div.row.cart-item').find('span.total-price'));
        // console.log($(event.currentTarget).closest('div.row.cart-item').find('span.total-price'));
        price = $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').attr('data-price');
        priceValue = parseInt(price) * quantity;
        $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').text(priceValue);
    }
    // console.log(quantity);
    // updateQuantity(box,price,'inc');
    updateTotal();
}

function decrement(event){
    // // console.log(event);
    // // console.log(event.target);
    // var quantity = parseInt(event.target.nextElementSibling.value);
    // if(quantity > 1 ){
    //     quantity--;
    // } else {
    //     quantity = 1;
    // }
    // updateQuantity(event,price,'dec');

    // console.log(event);
    // console.log(event.target);
    console.log(event.currentTarget);
    var el = event.currentTarget;
    // console.log(el.nextElementSibling);
    console.log(el.nextElementSibling);
    // console.log(event.target.nextElementSibling);
    var box = el.nextElementSibling;
    console.log(box.value);
    var quantity = parseInt(box.value);
    if(quantity > 1){
        quantity--;
        box.value--;
        box.innerText = "" + box.value;
        price = $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').attr('data-price');
        priceValue = parseInt(price) * quantity;
        $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').text(priceValue);
    }
    console.log(quantity);
    // updateQuantity(box,price,'inc');
    updateTotal();
}

function updateTotal(){
    grandTotal = 0;
    var price = document.querySelectorAll('.total-price');
    var priceArr = Array.prototype.slice.call(price);
    priceArr.forEach(function(current){
        grandTotal+=parseInt(current.innerText);
    });
    document.getElementById('grand-total').innerText = grandTotal;
}

// function checkout(){
//     window.history.replaceState("","","/order?");
// }

init();
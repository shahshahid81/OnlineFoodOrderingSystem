$(function(){

});

function pageInit(){
    activePage(); 
    setAJAXListeners();
    activeCategory();
}

function activePage(){
    const activePath = window.location.pathname;

    switch(activePath){
        case "/menu":
            // document.getElementById('menu').classList.add('active');
            $('#menu').addClass('active');
            break;
        case "/aboutus":
            // document.getElementById('menu').classList.add('active');
            $('#about-us').addClass('active');
            break;
        case "/signup":
            // document.getElementById('signup').classList.add('active');
            $('#signup').addClass('active');
            break;
        case "/signin":
            // document.getElementById('signin').classList.add('active');
            $('#signin').addClass('active');
            break;
        case "/cart":
            // document.getElementById('cart').classList.add('active');
            $('#cart').addClass('active');            
            break;  
        case "/order":
            $('#order').addClass('active');
            break;
        case "/profile":
            $('#profile').addClass('active');
            break;
    }
}

function activeCategory(){
    const activeCategory = window.location.search.replace("?item=","");
    const category = document.querySelectorAll('ul.category-choice > li > a');
    const categoryArr = Array.prototype.slice.call(category);
    
    categoryArr.forEach(function(current){
        current.classList.remove('category-active');
    });

    console.log(activeCategory);
    if(activeCategory === ""){
        document.getElementById('Chicken').classList.add('category-active');
    } else {
        switch(activeCategory){
            case "Seafood" : 
                document.getElementById('Seafood').classList.add('category-active');
                break;
            case "Appetizers" : 
                document.getElementById('Appetizers').classList.add('category-active');
                break;
            case "Rice" : 
                document.getElementById('Rice').classList.add('category-active');
                break;
            case "Bread" : 
                document.getElementById('Bread').classList.add('category-active');
                break;
            case "Vegetable" : 
                document.getElementById('Vegetable').classList.add('category-active');
                break;
            case "Beverage" : 
                document.getElementById('Beverage').classList.add('category-active');
                break;
            case "Dessert" : 
                document.getElementById('Dessert').classList.add('category-active');
                break;
            case "Chicken" : 
            default:
                document.getElementById('Chicken').classList.add('category-active');
                break;
        }
    }
}

function setAJAXListeners(){
    var el = document.querySelectorAll('ul.category-choice > li > a');
    var elArr = Array.prototype.slice.call(el);
    elArr.forEach(function(current){
        current.addEventListener("click",function(event){
            event.preventDefault();
            document.getElementById('food-items').innerHTML = '<div class="loader"></div>';
            var xhttp = new XMLHttpRequest();
            var query = "/menu?item="+capitalize(current.innerText);
            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById('food-items').innerHTML = xhttp.responseText;
                    window.history.replaceState("","",query);
                    activeCategory();
                }
            };
            xhttp.open("get",query);
            xhttp.setRequestHeader('visited','true');
            xhttp.send();
        });
    });
}

var cart = [];

function addToCart(event,name){
    event.preventDefault();
    cartToggle(name);
}

function orderOnline(name){
    cartToggle(name);
    window.history.replaceState("","","/cart?items="+JSON.stringify(cart));
}

function capitalize(str){
    return str.charAt(0)+str.slice(1).toLowerCase();
}

function cartToggle(name){
    if(cart.indexOf(name) === -1){
        cart.push(name);
        event.target.innerText = "Remove from Cart";
    } else {
        cart.pop(name);
        event.target.innerText = "Add to Cart";
    }
}

// pageInit();




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

// init();


function pageInit(){
    activePage(); 
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
        case "/signin":
            document.getElementById('signin').classList.add('active');
    }
}

// pageInit();



function pageInit(){

    activePage(); 
    validateSignUp();

}

function activePage(){
    const activePath = window.location.pathname;

    switch(activePath){
        case "/menu":
            document.getElementById('menu').classList.add('active');
            break;
        case "/aboutus":
            document.getElementById('aboutus').classList.add('active');
            break;
        case "/signup":
            document.getElementById('signup').classList.add('active');
            break;
    }
}

function validateSignUp(){

    const signUpButton = document.querySelector('.btn.sign-up-button');
    signUpButton.addEventListener("click",function(event){
        const phoneNumber = document.getElementById('phone-number');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');

        if(phoneNumber.value.length < 10 ){
            alert("Enter Phone Number with 10 digits");
            event.preventDefault();
        }
        if(password.value !== confirmPassword.value){
            alert("Entered Password does not match");
            event.preventDefault();
        }
    });
}

// pageInit();


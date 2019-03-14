// ------------------------------------------------------
// ------------------    Common     ---------------------
// ------------------------------------------------------

function pageInit(){
    activePage();
    if(window.location.pathname === "/menu"){
        activeCategory();
        setAJAXListeners();
    }    
}

function activePage(){
    const activePath = window.location.pathname;

    switch(activePath){
        case "/menu":
            document.getElementById('menu').classList.add('active');
            break;
        case "/aboutus":
            document.getElementById('about-us').classList.add('active');
            break;
        case "/contactus" : 
            document.getElementById('contact-us').classList.add('active');
            break;
        case "/signin" : 
            document.getElementById('signin').classList.add('active');
            break;
        case "/signup" : 
            document.getElementById('signup').classList.add('active');
            break;
        case "/profile" : 
            document.getElementById('profile').classList.add('active');
            break;    
        case "/order" : 
            document.getElementById('order').classList.add('active');
            break;    
        case "/cart" : 
            document.getElementById('cart').classList.add('active');
            break;    
    }
}

function activeCategory(){
    const activeCategory = window.location.search.replace("?item=","");

    $('ul.category-choice > li > a').each(function(){
        $(this).removeClass('category-active');
    });

    if(activeCategory === ""){
        $('#Chicken').addClass('category-active');
    } else {
        switch(activeCategory){
            case "Seafood" : 
                $('#Seafood').addClass('category-active');
                break;
            case "Appetizers" : 
                $('#Appetizers').addClass('category-active');
                break;
            case "Rice" : 
                $('#Rice').addClass('category-active');
                break;
            case "Bread" : 
                $('#Bread').addClass('category-active');
                break;
            case "Vegetable" : 
                $('#Vegetable').addClass('category-active');
                break;
            case "Beverage" : 
                $('#Beverage').addClass('category-active');
                break;
            case "Dessert" : 
                $('#Dessert').addClass('category-active');
                break;
            case "Chicken" : 
            default:
                $('#Chicken').addClass('category-active');
                break;
        }
    }
}

pageInit();

// ------------------------------------------------------
// ------------------    Sign Up    ---------------------
// ------------------------------------------------------

function validateSignUp(){

    const phoneNumber = $('#phone-number');
    const password = $('#password');
    const confirmPassword = $('#confirm-password');

    if( phoneNumber.val().length !== 10 ){
        alert("Enter Phone Number with 10 digits");
        event.preventDefault();
    }

    if(password.val() !== confirmPassword.val()){
        alert("Entered Password does not match");
        event.preventDefault();
    }

}

// ------------------------------------------------------
// ------------------      Menu     ---------------------
// ------------------------------------------------------

function setAJAXListeners(){

    $('ul.category-choice > li > a').each(function(){
        $(this).on("click",function(event){
            event.preventDefault();
            $('#food-items').html('<div class="loader"></div>');

            var query = "/menu?item="+capitalize($(this).text());

            var itemRequest = new XMLHttpRequest();
            itemRequest.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    $('#food-items').html(itemRequest.responseText);
                    window.history.replaceState("","",query);
                    activeCategory();
                }
            };
            
            itemRequest.open("get",query);
            itemRequest.setRequestHeader('visited','true');
            itemRequest.send();
        });
    });
    
}

function toggleCart(event,name){ 

    event.preventDefault();
    var cartRequest = new XMLHttpRequest();
    cartRequest.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){

            if($(event.target).text().trim() === 'Remove from Cart'){
                $(event.target).text('Add to Cart');
            } else if($(event.target).text().trim() === 'Add to Cart'){
                $(event.target).text('Remove from Cart');
            }

        } else if(this.readyState == 4 && this.status == 401){
            window.location.replace('/signin');
        }
    }

    var query = '/cart?items='+name;
    cartRequest.open('post',query);
    if($(event.target).text().trim() === 'Remove from Cart'){
        cartRequest.setRequestHeader('removeItem','true');
    }
    cartRequest.send();

}

function capitalize(str){
    return str.charAt(0)+str.slice(1).toLowerCase();
}

// ------------------------------------------------------
// ------------------      Cart     ---------------------
// ------------------------------------------------------

function clearCart(){

    var clearRequest = new XMLHttpRequest();
    clearRequest.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            $('#cart-list').html("<h3>Cart is Empty! &nbsp; Select items from menu to add.</h3>");
            updateTotal();
        }
    }
    clearRequest.open('post','/cart?items=[]');
    clearRequest.setRequestHeader('clearCart','true');
    clearRequest.send();
}

function removeItem(name){

    var removeRequest = new XMLHttpRequest();
    
    var mouseEventTarget = $(event.currentTarget);

    removeRequest.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            mouseEventTarget.closest("div.row.cart-item").html("");            
            updateTotal();
        }
    }

    removeRequest.open('post','/cart?items='+name);
    removeRequest.setRequestHeader('removeItem','true');
    removeRequest.send();

}

function checkout() {
    event.preventDefault();
    var cart = {};
    cart.items = [];
    $('div.row.cart-item').each(function(element){
        var name = $(this).find('h3.food-name').text();
        var quantity = $(this).find('input.quantity-box').val();
        var item = {
            name,
            quantity
        }
        cart.items.push(item);
    });
    cart.total = $('#grand-total').text();

    var redirect = function(url, method) {
        var form = document.createElement('form');
        document.body.appendChild(form);
        form.method = method;
        form.action = url;
        form.submit();
    };
    
    redirect('/order?items='+JSON.stringify(cart), 'post');        
}

function increment(){
    
    var quantityTextbox =$(event.currentTarget).prev();
    var quantity = parseInt(quantityTextbox.val());
    if(quantity < 10){
        quantity++;
        quantityTextbox.val(parseInt(quantityTextbox.val())+1);
        quantityTextbox.text(quantityTextbox.val());
        price = $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').attr('data-price');
        priceValue = parseInt(price) * quantity;
        $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').text(priceValue);
    }
    updateTotal();
}

function decrement(){
    var quantityTextbox =$(event.currentTarget).next();
    var quantity = parseInt(quantityTextbox.val());
    if(quantity > 1){
        quantity--;
        quantityTextbox.val(parseInt(quantityTextbox.val())-1);
        quantityTextbox.text(quantityTextbox.val());
        price = $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').attr('data-price');
        priceValue = parseInt(price) * quantity;
        $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').text(priceValue);
    }
    updateTotal();
}

function updateTotal(){
    var grandTotal = 0;

    $('.total-price').each(function(){
        grandTotal += parseInt($(this).text());
    });

    if(grandTotal === 0){
        $('#cart-list').html("<h3>Cart is Empty! &nbsp; Select items from menu to add.</h3>");
    }
    $('#grand-total').text(grandTotal);
}

function validateQuantity(){

    const quantityTextbox = $(event.target);
    if(!(quantityTextbox.val() > 10 && quantityTextbox.val() < 1)){
        alert('Quantity must be in the range of 1 to 10.');
        quantityTextbox.val(1);
        updateTotal();
    }
    
}

// ------------------------------------------------------
// -----------------      Profile   ---------------------
// ------------------------------------------------------

function validateUpdate(){
const phoneNumber = $('#phone-number');
const password = $('#new-password');
const confirmPassword = $('#confirm-password');

if(phoneNumber.val().length != 10 ){
    alert("Enter Phone Number with 10 digits");
    event.preventDefault();
}

if(password.val() !== confirmPassword.val()){
    alert("Entered Password does not match");
    event.preventDefault();
}

}

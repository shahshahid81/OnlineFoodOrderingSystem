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
    $('#empty-cart').on('click',clearCart);
}

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

function removeItem(event,name){

    var removeRequest = new XMLHttpRequest();
    
    removeRequest.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            $(event.target).closest("div.row.cart-item").html("");            
            updateTotal();
        }
    }

    removeRequest.open('post','/cart?items='+name);
    removeRequest.setRequestHeader('removeItem','true');
    removeRequest.send();

}

var grandTotal = 0;

function increment(event){
    
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

function decrement(event){
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

function validateQuantity(event){

    const quantityTextbox = $(event.target);
    if(!(quantityTextbox.val() > 10 && quantityTextbox.val() < 1)){
        alert('Quantity must be in the range of 1 to 10.');
        quantityTextbox.val(1);
        updateTotal();
    }
    
}

function updateTotal(){
    grandTotal = 0;

    $('.total-price').each(function(){
        grandTotal += parseInt($(this).text());
    });

    if(grandTotal === 0){
        $('#cart-list').html("<h3>Cart is Empty! &nbsp; Select items from menu to add.</h3>");
    }
    $('#grand-total').text(grandTotal);
}

init();
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
    // document.getElementById('empty-cart').addEventListener("click",clearCart);
    $('#empty-cart').on('click',clearCart);
}
    
// function clearCart(){
//     // document.getElementById('cart-list').innerHTML="<h3>Cart is Empty! &nbsp; Select items from menu to add.</h3>";
//     $('#cart-list').html("<h3>Cart is Empty! &nbsp; Select items from menu to add.</h3>");
//     updateTotal();
// }


function clearCart(){
    var clearRequest = new XMLHttpRequest();
    clearRequest.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            $('#cart-list').html("<h3>Cart is Empty! &nbsp; Select items from menu to add.</h3>");
            updateTotal();
        }
    }
    clearRequest.open('post','/cart?items=[]');
    clearRequest.send();
}

// function removeItem(event,name){
//     if(cart.indexOf(name) === -1){
//         cart.pop(name);
//     }
//     if(cart.length === 0){
//         clearCart();
//     }
//     // event.target.parentNode.parentNode.innerHTML = "";
//     $(event.target).closest("div.row.cart-item").html("");
//     updateTotal();
// }

function removeItem(event,name){

    var clearRequest = new XMLHttpRequest();
    
    clearRequest.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4){
            $(event.target).closest("div.row.cart-item").html("");            
            updateTotal();
        }
    }

    clearRequest.open('post','/cart?items='+name);
    clearRequest.setRequestHeader('removeItem','true');
    clearRequest.send();

}

var grandTotal = 0;

function increment(event){
    // var box = el.previousElementSibling;
    var box =$(event.currentTarget).prev();
    var quantity = parseInt(box.val());
    if(quantity < 10){
        quantity++;
        // box.value++;
        // box.innerText = "" + box.value;
        box.val(parseInt(box.val())+1);
        box.text(box.val());
        price = $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').attr('data-price');
        priceValue = parseInt(price) * quantity;
        $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').text(priceValue);
    }
    updateTotal();
}

function decrement(event){
    // var box = el.nextElementSibling;
    // console.log($(event.currentTarget).next());
    var box =$(event.currentTarget).next();
    var quantity = parseInt(box.val());
    if(quantity > 1){
        quantity--;
        // box.value--;
        box.val(parseInt(box.val())-1);
        // box.innerText = "" + box.value;
        box.text(box.val());
        price = $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').attr('data-price');
        priceValue = parseInt(price) * quantity;
        $(event.currentTarget).closest('div.row.cart-item').find('span.total-price').text(priceValue);
    }
    updateTotal();
}

function validateQuantity(event){
    // console.log(event.target);
    const quantityTextbox = $(event.target);
    if(!(quantityTextbox.val() > 10 && quantityTextbox.val() < 1)){
        alert('Quantity must be in the range of 1 to 10.');
        quantityTextbox.val(1);
        updateTotal();
    }
}

function updateTotal(){
    grandTotal = 0;

    // var price = document.querySelectorAll('.total-price');
    // var priceArr = Array.prototype.slice.call(price);
    // priceArr.forEach(function(current){
    //     grandTotal+=parseInt(current.innerText);
    // });

    $('.total-price').each(function(){
        grandTotal += parseInt($(this).text());
    });

    if(grandTotal === 0){
        $('#cart-list').html("<h3>Cart is Empty! &nbsp; Select items from menu to add.</h3>");
    }
    // document.getElementById('grand-total').innerText = grandTotal;
    $('#grand-total').text(grandTotal);
}

// function checkout(){
//     window.history.replaceState("","","/order?");
// }

init();
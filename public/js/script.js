// ------------------------------------------------------
// ------------------    Common     ---------------------
// ------------------------------------------------------

function pageInit(){
    activePage();
    if(window.location.pathname === "/menu"){
        setCategory();
        activeCategory();
        setAJAXListeners();
    } else if(window.location.pathname === "/cart"){
        updateTotal();
    } else if(window.location.pathname === "/admin/food"){
        $('#food-table').DataTable({
            "lengthMenu": [ 10,15,20 ]
        });
    } else if(window.location.pathname === "/admin/user"){
        $('#user-table').DataTable({
            "lengthMenu": [ 10,15,20 ]
        });
    } else if(window.location.pathname === "/admin/order"){
        $('#order-table').DataTable({
            "lengthMenu": [ 20,25,30 ]
        });
    } else if(window.location.pathname === "/order"){
        $('#order-table').DataTable({
            "lengthMenu": [ 10,15,20 ]
        });
    } else if(window.location.pathname === "/admin"){
        $('#message-table').DataTable({
            "lengthMenu": [ 10,15,20 ]
        });
    }
}

function activePage(){
    const activePath = window.location.pathname;

    switch(activePath){
        case "/menu":
            $('#menu').addClass('active');
            break;
        case "/aboutus":
            $('#about-us').addClass('active');
            break;
        case "/contactus" : 
            $('#contact-us').addClass('active');
            break;
        case "/signin" : 
            $('#signin').addClass('active');
            break;
        case "/signup" : 
            $('#signup').addClass('active');
            break;
        case "/profile" : 
            $('#user').addClass('active');
            $('#profile').addClass('active');            
            break;
        case "/order" : 
            $('#user').addClass('active');
            $('#order').addClass('active');            
            break;
        case "/cart" : 
            $('#user').addClass('active');
            $('#cart').addClass('active');            
            break;    
    }
}

function activeCategory(category='chicken'){

    $('ul.category-choice > li > a').each(function(){
        $(this).removeClass('category-active');
    });

    $("#"+category.toLowerCase()).addClass('category-active');
    
}

pageInit();

// ------------------------------------------------------
// ------------------    Sign Up    ---------------------
// ------------------------------------------------------

function validateSignUp(){

    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else {

        const name = $("#name");        
        const phoneNumber = $('#phone-number');
        const email = $('#email');
        const password = $('#password');
        const confirmPassword = $('#confirm-password');
    
        if(!/^[a-zA-Z ]*$/.test(name.val())){
            alert('Enter Name with alphabets only');
            event.preventDefault();
        } else if(phoneNumber.val().length !== 10 || !/^[0-9]*$/.test(phoneNumber.val()) ){
            alert("Enter Phone Number with 10 digits");
            event.preventDefault();
        } else if(password.val() !== confirmPassword.val()){
            alert("Entered Password does not match");
            event.preventDefault();
        } else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email.val())){
            alert('Enter proper email address');
            event.preventDefault();
        }

    }

}

// ------------------------------------------------------
// ----------------      Contact Us  --------------------
// ------------------------------------------------------

function validateContactUs(){

    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else {
        
        const name = $('#name');
        const phoneNumber = $('#phone-number');
        const message =$("#message");
        const email = $('#email');
        if(!/^[a-zA-Z ]*$/.test(name.val())){
            alert('Enter Name with alphabets only');
            event.preventDefault();
        } else if( phoneNumber.val().length !== 10 || !/^[0-9]*$/.test(phoneNumber.val()) ){
            alert("Enter Phone Number with 10 digits");
            event.preventDefault();
        } else if( message.val().length === 0 ){
            alert("Message is Empty.Enter a Message.");
            event.preventDefault();
        } else if(message.val().length > 100) {
            alert("Message should be upto 100 characters only");
            event.preventDefault();
        } else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email.val())){
            alert('Enter proper email address');
            event.preventDefault();
        }

    }

}

// ------------------------------------------------------
// ------------------      Menu     ---------------------
// ------------------------------------------------------

function setAJAXListeners(){

    $('ul.category-choice > li > a').each(function(){
        $(this).on("click",function(){
            event.preventDefault();
            var category = $(this).text(); 
            setCategory(category);
            activeCategory(category);
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

function setCategory(category="Chicken"){
    var categoryArr = ['Chicken','Seafood','Appetizers','Rice','Bread','Vegetable','Beverage','Dessert'];
    categoryArr.forEach(function(current){
        $("#"+current).hide();
    });
    $("#"+category).show();
}

// ------------------------------------------------------
// ------------------      Cart     ---------------------
// ------------------------------------------------------

function clearCart(){

    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else{
        
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

}

function removeItem(name){

    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else{
        
        var removeRequest = new XMLHttpRequest();
        
        var mouseEventTarget = $(event.currentTarget);
    
        removeRequest.onreadystatechange = function(){
            if(this.status == 200 && this.readyState == 4){
                mouseEventTarget.closest("tr.item").html("");            
                updateTotal();
            }
        }
    
        removeRequest.open('post','/cart?items='+name);
        removeRequest.setRequestHeader('removeItem','true');
        removeRequest.send();

    }

}

function checkout() {

    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else {
        event.preventDefault();
        if(updateTotal() < 300){
            alert('Minimum order amount should be 300.');
            return;
        } else {
            var cart = {};
            cart.items = [];
            $('tr.item').each(function(element){
                var name = $(this).find('h4.food-name').text();
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
    }

}

function increment(){
    
    var quantityTextbox =$(event.currentTarget).parent().prev();
    var quantity = parseInt(quantityTextbox.val());
    if(quantity < 10){
        quantity++;
        quantityTextbox.val(parseInt(quantityTextbox.val())+1);
        quantityTextbox.text(quantityTextbox.val());
        price = $(event.currentTarget).closest('tr.item').find('span.total-price').attr('data-price');
        priceValue = parseInt(price) * quantity;
        $(event.currentTarget).closest('tr.item').find('span.total-price').text(priceValue);
    }
    updateTotal();
}

function decrement(){
    var quantityTextbox =$(event.currentTarget).parent().next();
    var quantity = parseInt(quantityTextbox.val());
    if(quantity > 1){
        quantity--;
        quantityTextbox.val(parseInt(quantityTextbox.val())-1);
        quantityTextbox.text(quantityTextbox.val());
        price = $(event.currentTarget).closest('tr.item').find('span.total-price').attr('data-price');
        priceValue = parseInt(price) * quantity;
        $(event.currentTarget).closest('tr.item').find('span.total-price').text(priceValue);
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
    return grandTotal;
}

function validateQuantity(){

    const quantityTextbox = $(event.target);
    if(!(quantityTextbox.val() < 10 && quantityTextbox.val() > 1)){
        alert('Quantity must be in the range of 1 to 10.');
        quantityTextbox.val(1);
        updateTotal();
    }
    
}

// ------------------------------------------------------
// -----------------      Profile   ---------------------
// ------------------------------------------------------

function validateUpdate(){

    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else{
        
        const email = $('#email');
        const name = $('#name');
        const phoneNumber = $('#phone-number');
        
        if(!/^[a-zA-Z ]*$/.test(name.val())){
            alert('Enter Name with alphabets only');
            event.preventDefault();
        } else if(phoneNumber.val().length != 10  || !/^[0-9]*$/.test(phoneNumber.val()) ){
            alert("Enter Phone Number with 10 digits");
            event.preventDefault();
        } else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email.val())){
            alert('Enter proper email address');
            event.preventDefault();
        }   
    }
}

function validateChangePassword() {
    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else{

        const password = $('#new-password');
        const confirmPassword = $('#confirm-password');
        if(password.val() !== confirmPassword.val()){
            alert("Entered Password does not match");
            event.preventDefault();
        }
        
    }
}

// ------------------------------------------------------
// ------------------     Order   -----------------------
// ------------------------------------------------------

function validateOrder(){

    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else {

        const name = $("#name");        
        const phoneNumber = $('#phone-number');
        const email = $('#email');
        const apartment = $('#apartment'); 
        const street = $('#street');
        const city = $('#city');
        const pincode = $('#pincode');

        if(!/^[a-zA-Z ]*$/.test(name.val())){
            alert('Enter Name with alphabets only');
            event.preventDefault();
        } else if(phoneNumber.val().length !== 10 || !/^[0-9]*$/.test(phoneNumber.val()) ){
            alert("Enter Phone Number with 10 digits");
            event.preventDefault();
        } else if(pincode.val().length !== 6 || !/^[0-9]*$/.test(pincode.val()) ){
            alert("Enter Pin Code with 6 digits");
            event.preventDefault();
        } else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email.val())){
            alert('Enter proper email address');
            event.preventDefault();
        } else if ( apartment.val().length === 0 || street.val().length === 0 || city.val().length === 0 ){
            alert('Address cannot be empty');
            event.preventDefault();
        }
    }
}

// ------------------------------------------------------
// -------------     User Management---------------------
// ------------------------------------------------------

function validateAction(){
    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();
    }
}

// ------------------------------------------------------
// -------------   Order Management  --------------------
// ------------------------------------------------------

function editOrder(){
    
    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else{
        var statusElement = $(event.currentTarget).parent().prev();
        var buttonElement = $(event.currentTarget).parent();
        var statusElementString = "<select id='category' class='category' name='category' class='form-control input-lg'><option value= 'Pending' > Pending </option><option value= 'Accepted' > Accepted </option><option value= 'Rejected' > Rejected </option><option value= 'Dispatched' > Dispatched </option><option value= 'Delivered' > Delivered </option></select>";
        var buttonElementString = "<button class='icon' onclick='changeStatus()'><i class='fa fa-check'></i></button>";
        statusElement.html(statusElementString);
        buttonElement.html(buttonElementString);
    }
    
}

function changeStatus(){
    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else{
        
        var statusElement = $(event.currentTarget).parent().prev();
        var buttonElement = $(event.currentTarget).parent();
        var orderID = $(event.currentTarget).closest('tr').find('.order-id').text();
        $.ajax({
            url : '/admin/order/'+orderID,
            method : 'POST',
            data : {category : $('.category').val()},
            success : function(status){
                var buttonElementString = "<button class='icon' onclick='editOrder()'><i class='fa fa-pencil'></i></button>";
                var statusElementString = status;
                statusElement.html(statusElementString);
                buttonElement.html(buttonElementString);
            }
        });

    }
}

// ------------------------------------------------------
// -------------   Food Management   --------------------
// ------------------------------------------------------

function validateFoodItem(){
    
    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else {
        
        const name = $("#name");
        const price = $('#price');
        const image = $('#image');
        const description = $('#description');

        if(!/^[a-zA-Z ]*$/.test(name.val())){
            alert('Enter Name with alphabets only');
            event.preventDefault();
        } else if(price.val().length ==0 || !/^[0-9]*$/.test(price.val()) ){
            alert("Enter at least one digit in price");
            event.preventDefault();
        } else if( image.val() === '' ){
            alert("Enter Image File");
            event.preventDefault();
        } else if(description.val().length > 95 || description.val().length === 0){
            alert('Description must be within 95 characters.');
            event.preventDefault();
        } 
    }

}

function validateModifiedFoodItem(){
    
    var choice = confirm('Do you want to proceed?');
    if(choice === false){
        event.preventDefault();        
    } else {
        
        const name = $("#name");
        const price = $('#price');
        const description = $('#description');

        if(!/^[a-zA-Z ]*$/.test(name.val())){
            alert('Enter Name with alphabets only');
            event.preventDefault();
        } else if(price.val().length ==0 || !/^[0-9]*$/.test(price.val()) ){
            alert("Enter at least one digit in price");
            event.preventDefault();
        } else if(description.val().length > 95 || description.val().length === 0){
            alert('Description must be within 95 characters.');
            event.preventDefault();
        } 
    }

}

// ------------------------------------------------------
// -------------      Dashboard      --------------------
// ------------------------------------------------------

$('#myModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); 
    var message = button.data('message');
    var modal = $(this);
    modal.find('.message').text(message);
});
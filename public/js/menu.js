function pageInit(){
    activePage(); 
    setAJAXListeners();
    activeCategory();
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
    // var el = document.querySelectorAll('ul.category-choice > li > a');
    // var elArr = Array.prototype.slice.call(el);
    // elArr.forEach(function(current){
    //     current.addEventListener("click",function(event){
    //         event.preventDefault();
    //         document.getElementById('food-items').innerHTML = '<div class="loader"></div>';
    //         var xhttp = new XMLHttpRequest();
    //         var query = "/menu?item="+capitalize(current.innerText);
    //         xhttp.onreadystatechange = function(){
    //             if (this.readyState == 4 && this.status == 200) {
    //                 document.getElementById('food-items').innerHTML = xhttp.responseText;
    //                 window.history.replaceState("","",query);
    //                 activeCategory();
    //             }
    //         };
    //         xhttp.open("get",query);
    //         xhttp.setRequestHeader('visited','true');
    //         xhttp.send();
    //     });
    // });

    $('ul.category-choice > li > a').each(function(){
        $(this).on("click",function(event){
            event.preventDefault();
            $('#food-items').html('<div class="loader"></div>');
            var query = "/menu?item="+capitalize($(this).text());

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    $('#food-items').html(xhttp.responseText);
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
        // event.target.innerText = "Remove from Cart";
        $(event.target).text("Remove from Cart");
    } else {
        cart.pop(name);
        // event.target.innerText = "Add to Cart";
        $(event.target).text("Add to Cart");
    }
}

pageInit();

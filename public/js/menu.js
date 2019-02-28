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
    
    // const category = document.querySelectorAll('ul.category-choice > li > a');
    // const categoryArr = Array.prototype.slice.call(category);
    
    // categoryArr.forEach(function(current){
    //     current.classList.remove('category-active');
    // });

    $('ul.category-choice > li > a').each(function(){
        $(this).removeClass('category-active');
    });

    console.log(activeCategory);

    if(activeCategory === ""){
        // document.getElementById('Chicken').classList.add('category-active');
        $('#Chicken').addClass('category-active');
    } else {
        switch(activeCategory){
            case "Seafood" : 
                // document.getElementById('Seafood').classList.add('category-active');
                $('#Seafood').addClass('category-active');
                break;
            case "Appetizers" : 
                // document.getElementById('Appetizers').classList.add('category-active');
                $('#Appetizers').addClass('category-active');
                break;
            case "Rice" : 
                // document.getElementById('Rice').classList.add('category-active');
                $('#Rice').addClass('category-active');
                break;
            case "Bread" : 
                // document.getElementById('Bread').classList.add('category-active');
                $('#Bread').addClass('category-active');
                break;
            case "Vegetable" : 
                // document.getElementById('Vegetable').classList.add('category-active');
                $('#Vegetable').addClass('category-active');
                break;
            case "Beverage" : 
                // document.getElementById('Beverage').classList.add('category-active');
                $('#Beverage').addClass('category-active');
                break;
            case "Dessert" : 
                // document.getElementById('Dessert').classList.add('category-active');
                $('#Dessert').addClass('category-active');
                break;
            case "Chicken" : 
            default:
                // document.getElementById('Chicken').classList.add('category-active');
                $('#Chicken').addClass('category-active');
                break;
        }
    }
}

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

pageInit();

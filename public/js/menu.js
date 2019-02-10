function pageInit(){
    activePage(); 
    setAJAXListeners();
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

function setAJAXListeners(){
    var el = document.querySelectorAll('ul.category-choice > li > a');
    var elArr = Array.prototype.slice.call(el);
    elArr.forEach(function(current){
        current.addEventListener("click",function(event){
            event.preventDefault();
            document.getElementById('food-items').innerHTML = '<div class="loader"></div>';
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById('food-items').innerHTML = xhttp.responseText;
                    pageInit();
                }
            };
            var query = "/menu?item="+capitalize(current.innerText);
            xhttp.open("get",query);
            xhttp.send();
        });
    });
}

function capitalize(str){
    return str.charAt(0)+str.slice(1).toLowerCase();
}

pageInit();


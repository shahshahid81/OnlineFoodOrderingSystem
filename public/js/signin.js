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

pageInit();
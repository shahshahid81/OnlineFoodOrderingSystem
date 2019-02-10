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

pageInit();


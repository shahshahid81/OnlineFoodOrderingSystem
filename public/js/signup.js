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
    
    const signUpButton = $('.btn.sign-up-button');
    signUpButton.on("click",function(event){
        const phoneNumber = $('#phone-number');
        const password = $('#password');
        const confirmPassword = $('#confirm-password');

        if(phoneNumber.val().length < 10 ){
            alert("Enter Phone Number with 10 digits");
            event.preventDefault();
        }
        if(password.val() !== confirmPassword.val()){
            alert("Entered Password does not match");
            event.preventDefault();
        }
    });
}

pageInit();


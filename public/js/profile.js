function validateUpdate(){
    
    const updateButton = $('.btn.update-button');
    updateButton.on("click",function(event){
        const email = $('#email');
        const name = $('#name');
        const phoneNumber = $('#phone-number');
        const password = $('#new-password');
        const confirmPassword = $('#confirm-password');

        // if(name.text().length === 0){
        //     alert('Name field cannot be empty');
        //     event.preventDefault();
        // }


        // if(email.text().length === 0){
        //     alert('Email field cannot be empty');
        //     event.preventDefault();
        // }

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
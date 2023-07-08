//This code is an asynchronous function "forgotpassword". it is a event handler for a form submission event i.e
// when a user submits a form to request a password reset
const forgotpassword = async(event) => {// event triggered by form submission
    event.preventDefault();//prevents default form submission
    const form = new FormData(event.target);//FormData object is created using the event.target property which
//refers to the form element that triggered event.FormData object is used to extract the email value from the form.
    
    const userDetails = {//extracted email value is assigned to userDetails object with property name of email.
        email: form.get('email')
    };

    console.log('user details', userDetails);
    
    axios.post('http:localhost:3000/password/forgotpassword', userDetails)
        .then(response => {
            console.log(response.status);

            if (response.status === 200) {
                document.body.innerHTML += '<div style="color:red;">Mail successfully sent</div>';
            } else {
                throw new Error('Something went wrong!!!');
            }
        })
        .catch(err => {
            console.log(err);
            document.body.innerHTML += `<div style="color:red;">${err}</div>`;
        });
};


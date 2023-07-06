async function signup(e){   // async keyword allows the use of await keyword inside the function body
    // function receives event object 'e' as parameter
    try{
        e.preventDefault(); // prevents the default form submission behaviour, which allows
        // to handle the form submission manually using javascript
        console.log(e.target.email.value); // logs the value of email input field from the form

        const signupDetails = {  // object signupDetails is created which contains value entered by user
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(signupDetails);

        const response = await axios.post("http:localhost:3000/user/signup", signupDetails);
        // send POST request to "ht..." endpoint with signupDetails object as the request body. await 
        // keyword is used to wait for the response to be received before proceeding
        if(response.status === 201){// indicate successful signup. window.location assumes that the user is in web environment
            alert("SignUp successful now Login");
            window.location.href = "../Login/login.html"; // change the page on successful login
        }else{
            throw new Error('Failed to login')
        }
    }catch(err){
        // error message is appeneded to the body of the HTML document in 'div' element in red text color
        document.body.innerHTML += `<div style = "color: red">${err}</div>`
    }
}

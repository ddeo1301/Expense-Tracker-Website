function login(e) { // handles form submission event e
    e.preventDefault(); // prevent default form submission allowing us to manually submit the form using javascript
    console.log(e.target.name);

    const loginDetails = { // object loginDetails is created which contains the value entered by forms 'email' and 'password'
        email: e.target.email.value,
        password: e.target.password.value
    }

    console.log(loginDetails);
    axios.post('http://localhost:3000/user/login', loginDetails).then(response => {
        // send POST request to "htt..." endpoint with loginDetails as request body. This function returns 
        // promise so that we can use .then() and .catch() to handle response
        alert(response.data.message); // callback function is executed with response object as its parameters
        // calls "ale..." to display a message from server response
        localStorage.setItem('token', response.data.token);
        window.location.href = "../ExpenseTracker/expense.html"
    }).catch(err => {
        console.log(JSON.stringify(err)); // converts error objects to JSON string
        document.body.innerHTML += `<div style="color : red;"> ${err.message}</div>`;
    })
}
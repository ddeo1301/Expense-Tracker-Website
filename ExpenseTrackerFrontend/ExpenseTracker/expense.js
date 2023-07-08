//this code contains various functions and event handlers related to adding, listing, deleting expenses, and 
//handling user interface elements. It also includes functions for handling pagination, 
//showing a premium user message, and downloading expense data.

 // this function is triggered when a form is submitted to add a new expense. It prevents the default form 
 // submission, collects the expense details from the form, sends a POST request to the server to add the
 // expense, and updates the UI.
function addNewExpense(e){
    e.preventDefault();// prevent the page from reloading

    const expenseDetails = {// creates the object using the value from form fields
        expenseamount: e.target.ExpenseAmount.value,
        description: e.target.description.value,//value are extracted
        category: e.target.category.value,
    }
    console.log(expenseDetails);

    const token = localStorage.getItem('token');// retrieves token stored in loclstorage with key "token"
    
    //makes HTTP request using axios. expenseDetails object is sent as request payload.Authorization 
    //header is set with the retrieved token using the headers configuration object.
    axios.post('http:localhost:3000/expense/addexpense',expenseDetails, {headers: {"Authorization" : token}})
        .then((response) => {
          //when we make an HTTP request and receive a response, response object typically contains various 
          //properties, including data. The data property often holds the actual payload or content of response. 
          addNewExpensetoUI(response.data.expense);// successful and contain newly added expense imformation
    }).catch(err => showError(err))
}

// this function hides a button with the ID 'rzp-button1' and updates the content of an element with the ID 
//'message' to display a message indicating that the user is a premium user.
function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"; // 
    document.getElementById('message').innerHTML = "You are a premium user "
}

// decodes a JSON Web Token (JWT) to extract the payload data.
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

//The DOMContentLoaded event listener is triggered when the DOM content has finished loading. It retrieves the
// page size and token from the localStorage, parses the token to check if the user is a premium user, and 
//then makes a GET request to retrieve the expenses and update the UI.
window.addEventListener('DOMContentLoaded', async ()=> {
    try{
        const pageSize = localStorage.getItem('pageSize') 
        const token = localStorage.getItem('token')//retrieves token from browser localstorage using localStorage.getItem
        const page = 1
        const decodeToken = parseJwt(token);//decode the token using parseJwt

        console.log(decodeToken);
        const ispremiumuser = decodeToken.ispremiumuser;

        if(ispremiumuser){//checks if the ispremiumuser property in decoded token is true
           showPremiumuserMessage();
           showLeaderboard()
        }
      

        const res = await axios.get(// send HTTP GET request to the URL using axios library. page and pageSize
            `http:localhost:3000/expense/getexpenses?page=${page}&pageSize=${pageSize}`,//query parameter are 
            {headers: {'Authorization': token}}//included in URL, and token is passed in request header as
        );//áuthorisation field
    
        listExpense(res.data.allExpense)//if request is successful then calls listExpense function with allExpense
        //data from the response
        showPagination(res.data)//function with entire rsponse data to handle pagination
        
    }catch(err){
        console.log("error in express.js in windows.add in frontend", err)
    }
});


//The pageSize function is triggered when the user selects a page size option. It updates the localStorage 
//with the selected page size, retrieves the expenses based on the new page size, and updates the UI.
async function pageSize(val){
    try{
        const token = localStorage.getItem('token')
        localStorage.setItem('pageSize',`${val}`)
        const page = 1
       
        const res = await axios.get(
            `http:localhost:3000/expense/getexpenses?page=${page}&pageSize=${val}`, 
            {headers: {'Authorization': token}}
        );

        console.log(res)
        listExpense(res.data.allExpense)
        showPagination(res.data)
    }
    catch(err){
        console.log(err)
    }
}

//The listExpense function takes an array of expense data and updates the UI by adding each expense to the list.
async function listExpense(data) {
    try {
      const parentElement = document.getElementById('list-group');
     
      parentElement.innerHTML = ''; // Clear existing list of expenses
      console.log(data);
  
      for (i in data) {//iterates over elements of data
        addNewExpensetoUI(data[i]);
      }
    } catch (err) {
      console.log("error in listExpense in frontend", err);
    }
  }

//The showPagination function updates the pagination UI based on the current page and available pages.
async function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage}){
    try{
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = ''
        if(hasPreviousPage){
            const btn2 = document.createElement('button')
            btn2.innerHTML = previousPage
            btn2.addEventListener('click', ()=>getProducts(previousPage))
            pagination.appendChild(btn2)
        }
        const btn1 = document.createElement('button')
        btn1.innerHTML = currentPage
        btn1.addEventListener('click',()=>getProducts(currentPage))
        pagination.appendChild(btn1)

        if (hasNextPage){
            const btn3 = document.createElement('button')
            btn3.innerHTML = nextPage
            btn3.addEventListener('click',()=>getProducts(nextPage))
            pagination.appendChild(btn3)

        }
        if (currentPage!==1){
            const btn4 = document.createElement('button')
            btn4.innerHTML = 'main-page'
            btn4.addEventListener('click',()=>getProducts(1))
            pagination.appendChild(btn4)

        }

    }
    catch(err){
        console.log(err)
    }
}

//getProducts function retrieves the expenses based on the selected page and page size, and updates the UI.
async function getProducts(page){
    try{
        const token = localStorage.getItem('token')
        const pageSize = localStorage.getItem('pageSize')
        const response = await axios.get(
            `http:localhost:3000/expense/getexpenses?page=${page}&pageSize=${pageSize}`,
            {headers: {'Authorization': token}}
        )

        listExpense(response.data.allExpense)
        showPagination(response.data)
    }
    catch(err){
        console.log(err)
    }
}

//addNewExpensetoUI function adds a new expense to the UI by creating an HTML element and appending it to list.
function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('list-group');
    //creates unique ID for expense element using the id property of the expense object and concatenating it 
    const expenseElemId = `expense-${expense.id}`;//
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

//deleteExpense function is triggered when the user clicks on the "Delete Expense" button. It sends a DELETE 
//request to the server to delete the expense and updates the UI.
function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token')
    axios.delete(
        `http:localhost:3000/expense/deleteexpense/${expenseid}`, 
         {headers: {"Authorization": token}}
    )
    .then((response) => {
            removeExpensefromUI(expenseid);   
    }).catch((err => {
        showError(err);
    }))
}

// showError function displays an error message on the webpage.
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

//showLeaderboard function creates a button that, when clicked, retrieves and displays the leaderboard data.
function showLeaderboard(){
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = 'Show Leaderboard';
    inputElement.style.backgroundColor = 'gold';
    inputElement.style.color = 'black';
    inputElement.style.borderRadius = '15px';
    inputElement.style.padding = '8px';
    inputElement.style.marginLeft = '100px';

    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get(
            'http:localhost:3000/premium/showLeaderBoard',
             { headers: {"Authorization" : token} }
        )
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
           leaderboardElem.innerHTML += `<li>Name -> ${userDetails.name} -> Total Expense -> ${userDetails.totalExpenses || 0} </li>`
        })
    }

    document.getElementById("message").appendChild(inputElement);
}

//removes an expense from the UI by finding the corresponding HTML element and removing it.
function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

//triggered when the user clicks on a download button. It sends a GET request to the server to download the 
//expense data as a CSV file.
async function download() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http:localhost:3000/expense/download', { headers: { "Authorization": token } }
      );

      console.log("enter in try block")
  
      if (response.status === 200) {
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = 'MyExpense.csv';
        a.click();
        alert('You successfully downloaded the file');
      }else {
        console.log("error in expense.js download");
        throw new Error(response.data.message);
      } 
    } catch (err) {
         console.log("error in expense.js download catch");
         showError(err);
    }
  } 

// code sets up an event listener for a button click. When the button is clicked, it sends a GET request to
//the server to initiate a premium membership purchase using the Razorpay payment gateway. On successful 
//payment, it updates the UI and token, and shows the leaderboard.
document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http:localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);

    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
      "name": "Expense Tracker App",
     "order_id": response.data.order.id,// For one time payment

      "prefill": {
         "name": "S Divyanshu Deo",
         "email": "divyanshudeo348@gmail.com",
         "contact": "8250984133"
      },
     "theme": {
        "color": "#3399cc"
      },

     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http:localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)

         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}
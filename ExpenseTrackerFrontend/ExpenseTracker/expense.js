let currentPage = 1;
let rowsPerPage = localStorage.getItem('rowsPerPage') ? localStorage.getItem('rowsPerPage') : 5;

function addNewExpense(e){
    e.preventDefault();

    const expenseDetails = {
        expenseamount: e.target.ExpenseAmount.value,
        description: e.target.description.value,
        category: e.target.category.value,
    }
    console.log(expenseDetails);

    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/expense/addexpense',expenseDetails, {headers: {"Authorization" : token}})
        .then((response) => {
          addNewExpensetoUI(response.data.expense);
    }).catch(err => showError(err))
}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', ()=> {
    const token  = localStorage.getItem('token');
    const decodeToken = parseJwt(token);

    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser;

    if(ispremiumuser){
        showPremiumuserMessage();
        showLeaderboard()
    }

    axios.get('http://localhost:3000/expense/getexpenses', { headers: {"Authorization" : token} })
    .then(response => {
            response.data.expenses.forEach(expense => {
                addNewExpensetoUI(expense);
            })
    }).catch(err => {
        showError(err)
    })
});

async function getExpenses(){
    try{
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);
        // const ispremiumuser = decodedToken.ispremiumuser;

        // if(ispremiumuser){
        //     showPremiumuserMessage();
        //     showLeaderboard();
        // };

        const response = await axios.get(`http://localhost:3000/expense/getexpenses?page=${currentPage}&rows=${rowsPerPage}`, { headers: {'Authorization': token}})
       document.getElementById('listOfExpenses').innerHTML = "";
       const { expenses, totalCount } = response.data;
       pagination(totalCount);

       if (expenses.length > 0) {
           for (let i = 0; i < expenses.length; i++) {
            addNewExpensetoUI(response.data.expenses[i]);
           }
       } else {
           document.getElementById('err').textContent = "Currently there are no Expenses!"
       }
    } catch (error) {
       console.log(error);
    }
}


function addNewExpensetoUI(expense){
    console.log("hello");
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

function deleteExpense(e, expenseid) {
    console.log("hi")
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`, {headers: {"Authorization": token}})
    .then((response) => {
            removeExpensefromUI(expenseid);   
    }).catch((err => {
        showError(err);
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function showLeaderboard(){
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = 'Show Leaderboard';

    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
          // leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.total_cost || 0} </li>`
           leaderboardElem.innerHTML += `<li>Name -> ${userDetails.name} -> Total Expense -> ${userDetails.totalExpenses || 0} </li>`
        })
    }

    document.getElementById("message").appendChild(inputElement);
}


function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

async function download() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/expense/download', { headers: { "Authorization": token } });

      console.log("enetr in try block")
  
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
  
  

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
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
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
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

async function pagination(totalCount) {
    try {
      maxPages = Math.ceil(totalCount / rowsPerPage);

      document.getElementById('prev-btn').style.display = currentPage > 1 ? "block" : "none";
      document.getElementById('next-btn').style.display = maxPages > currentPage ? "block" : "none";
      document.getElementById('rows-per-page').value = rowsPerPage;

      const start = (currentPage - 1) * rowsPerPage + 1;
      const temp=start + Number(rowsPerPage) - 1;
      const end = temp<totalCount ? temp : totalCount;

      document.getElementById('page-details').textContent = `Showing ${start}-${end} of ${totalCount}`;
    } catch (error) {
      console.error(error);
    }
}

  async function showChangedRows() {
    try {
      rowsPerPage = event.target.value;
      localStorage.setItem('rowsPerPage',rowsPerPage);
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  async function showPreviousPage() {
    try {
      currentPage--;
      await getExpenses();
    } catch (error) {
      console.error(error);
    }
  }

  async function showNextPage() {
    try {
      currentPage++;
      await getExpenses();
    } catch (error) {
      console.error(error);
    }
  }
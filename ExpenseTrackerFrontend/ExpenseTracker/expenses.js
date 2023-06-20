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

window.addEventListener('DOMContentLoaded', async()=> {
    try{
        const pageSize = localStorage.getItem('pageSize');
        const page = 1
        const token  = localStorage.getItem('token');
        const decodeToken = parseJwt(token);

        console.log(decodeToken);
        const ispremiumuser = decodeToken.ispremiumuser;

        if(ispremiumuser){
          showPremiumuserMessage();
          showLeaderboard()
        }

        const res = await axios.get(`http://localhost:3000/expense/getexpenses?page=${page}&pageSize=${pageSize}`, {headers: {'Authorization': token}});
        //listExpense(res.data.expenses);
        res.data.expenses.forEach(expense => {
            addNewExpensetoUI(expense);
        })
        //showPagination(res.data);
    }catch(err){
        showError(err)
    }
});

// async function pageSize(val){
//     try{
//        const token = localStorage.getItem('token');
//        localStorage.setItem('pageSize', `${val}`);
//        const page = 1;

//        const res = await axios.get(`http://localhost:3000/expense/getexpenses?page=${page}&pageSize=${val}`, {headers: {'Authorization': token}});
//        console.log(res)

//        listExpense(res.data.expenses);
//     //    res.data.expenses.forEach(expense => {
//     //     addNewExpensetoUI(expense);
//     //    })
//        showPagination(res.data);
//     }catch(err){
        
//         console.log("error in pageSize in expense.js in frontend", err);
//     }
// }



// async function listExpense(expense) {
//     try {
//         console.log(expense);
//         const paginationElement = document.getElementById('pagination');
//         console.log(paginationElement)
//         //const paginationElement = document.getElementById('listOfExpenses');
//         if (paginationElement) {
//             paginationElement.innerHTML = "";
//             for (let i = 0; i < expense.length; i++) {
//                 addNewExpensetoUI(expense[i]);
//             }
//         }
//     } catch (err) {
//         console.log("error in listExpense in expense.js in frontend", err);
//     }
// }


// async function showOnScreen(data){
//     try{
//         document.getElementById('ExpenseAmount').value = "";
//         document.getElementById('description').value = "";
//         document.getElementById('category').value = "";
        
        
//         var li = document.createElement('li')
//         li.className = 'list-group-item'
//         li.textContent = `${data.category} ==> ${data.description} ==> price : ${data.amount}rs`
        
//         const btn = document.createElement('button')
//         btn.className = 'btn btn-dark float-right Delete'
//         btn.appendChild(document.createTextNode('Delete'))
        
//         btn.onclick = async () => {
//             const token = localStorage.getItem('token')
//             ul.removeChild(li)
//             const remove = await axios.delete(`http://localhost:3000/expense/deleteexpense/${data.id}`,{headers: {'Authorization': token}})
//             //console.log(remove)
//             alert(remove.data.message)
//         }
//         li.appendChild(btn)
//         ul.appendChild(li)
//     }catch(err){
//         console.log(err);
//     }
    
//     }


function addNewExpensetoUI(expense){
    console.log("hello");
    console.log(expense);
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
  
//   async function showPagination({currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage}){
//     try{
//         const pagination = document.getElementById('pagination');
//         pagination.innerHTML = '';

//         if(hasPreviousPage){
//             const btn2 = document.createElement('button')
//             btn2.innerHTML = previousPage
//             btn2.addEventListener('click', () => getProducts(previousPage))
//             pagination.appendChild(btn2)
//         }

//         const btn1 = document.createElement('button')
//         btn1.innerHTML = currentPage
//         btn1.addEventListener('click',() => getProducts(currentPage))
//         pagination.appendChild(btn1)

//         if (hasNextPage){
//             const btn3 = document.createElement('button')
//             btn3.innerHTML = nextPage
//             btn3.addEventListener('click', () => getProducts(nextPage))
//             pagination.appendChild(btn3)

//         }

//         if (currentPage !== 1){
//             const btn4 = document.createElement('button')
//             btn4.innerHTML = 'main-page'
//             btn4.addEventListener('click', () => getProducts(1))
//             pagination.appendChild(btn4)

//         }
//     }
//     catch(err){
//         console.log(err)
//     }
// }

// async function getProducts(page){
//     try{
//         const token = localStorage.getItem('token')
//         const pageSize = localStorage.getItem('pageSize')
//         const response = await axios.get(`http://localhost:3000/expense/getexpenses?page=${page}&pageSize=${pageSize}`, {headers: {'Authorization': token}});
//         //console.log(response)
//         listExpense(response.data.expenses);
//         // res.data.expenses.forEach(expense => {
//         //     addNewExpensetoUI(expense);
//         // })
//         showPagination(response.data)
//     }
//     catch(err){
//         console.log(err)
//     }
// }
 

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


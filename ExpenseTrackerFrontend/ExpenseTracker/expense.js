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

window.addEventListener('DOMContentLoaded', async ()=> {
    try{
        const pageSize = localStorage.getItem('pageSize') 
        const token = localStorage.getItem('token')
        const page = 1
        const decodeToken = parseJwt(token);

        console.log(decodeToken);
        const ispremiumuser = decodeToken.ispremiumuser;

        if(ispremiumuser){
           showPremiumuserMessage();
           showLeaderboard()
        }
    
         const res = await axios.get(`http://localhost:3000/expense/getexpenses?page=${page}&pageSize=${pageSize}`, {headers: {'Authorization': token}});
    
        listExpense(res.data.allExpense)
        showPagination(res.data)
        
    }catch(err){
        console.log("error in express.js in windows.add in frontend", err)
    }
    
    // axios.get('http://localhost:3000/expense/getexpenses', { headers: {"Authorization" : token} })
    // .then(response => {
    //         response.data.expenses.forEach(expense => {
    //             addNewExpensetoUI(expense);
    //         })
    // }).catch(err => {
    //     showError(err)
    // })
});

async function pageSize(val){
    try{
        const token = localStorage.getItem('token')
        localStorage.setItem('pageSize',`${val}`)
        const page = 1
        //window.location.reload()
        const res = await axios.get(`http://localhost:3000/expense/getexpenses?page=${page}&pageSize=${val}`, {headers: {'Authorization': token}});
        console.log(res)
        listExpense(res.data.allExpense)
        showPagination(res.data)
    }
    catch(err){
        console.log(err)
    }
}

async function listExpense(data) {
    try {
      const parentElement = document.getElementById('list-group');
      //const parentElement = document.getElementById('pagination');
      parentElement.innerHTML = ''; // Clear existing list of expenses
      console.log(data);
  
      for (i in data) {
        // console.log(i);
        // console.log(data)
        // console.log(data[i] )
        addNewExpensetoUI(data[i]);
      }
    } catch (err) {
      console.log("error in listExpense in frontend", err);
    }
  }

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

// async function getExpenses(){
//     try{
//         const token = localStorage.getItem('token');
//         const decodedToken = parseJwt(token);
//         // const ispremiumuser = decodedToken.ispremiumuser;

//         // if(ispremiumuser){
//         //     showPremiumuserMessage();
//         //     showLeaderboard();
//         // };

//         const response = await axios.get(`http://localhost:3000/expense/getexpenses?page=${currentPage}&rows=${rowsPerPage}`, { headers: {'Authorization': token}})
//        document.getElementById('listOfExpenses').innerHTML = "";
//        const { expenses, totalCount } = response.data;
//        pagination(totalCount);

//        if (expenses.length > 0) {
//            for (let i = 0; i < expenses.length; i++) {
//             addNewExpensetoUI(response.data.expenses[i]);
//            }
//        } else {
//            document.getElementById('err').textContent = "Currently there are no Expenses!"
//        }
//     } catch (error) {
//        console.log(error);
//     }
// }

async function getProducts(page){
    try{
        const token = localStorage.getItem('token')
        const pageSize = localStorage.getItem('pageSize')
        const response = await axios.get(`http://localhost:3000/expense/getexpenses?page=${page}&pageSize=${pageSize}`,{headers: {'Authorization': token}})
        //console.log(response)
        listExpense(response.data.allExpense)
        showPagination(response.data)
    }
    catch(err){
        console.log(err)
    }
}

function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('list-group');
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
    inputElement.style.backgroundColor = 'gold';
    inputElement.style.color = 'black';
    inputElement.style.borderRadius = '15px';
    inputElement.style.padding = '8px';
    inputElement.style.marginLeft = '100px';

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
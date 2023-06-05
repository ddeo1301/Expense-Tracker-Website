function saveExpense(event) {
    event.preventDefault();
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;

    const obj = {amount, description, category};
    axios.post("http://localhost:3000/expense/add-expense",obj)
    // axios.post("http://localhost:3000/add-expense",obj)
     .then((response) => {
        console.log(response);
        showNewExpenseOnScreen(response.data.newExpense);
})
    .catch((err) => {
        document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong";
        console.log(err);
     });
}

 document.addEventListener("DOMContentLoaded", () => {
  axios.get("http://localhost:3000/expense/get-expenses")
//axios.get("http://localhost:3000/get-expenses")
    .then((response) => {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
        showNewExpenseOnScreen(response.data.allExpenses[i]);
   }
})
.catch((err) => {
       console.log(err);
    });
});

function showNewExpenseOnScreen(expense) {
   const parentNode = document.getElementById("listOfExpense");
   const childHTML = `   <div <li id=${expense.id}>${expense.amount}-${expense.category}-${expense.description}
       <button class="btn btn-primary" onclick=deleteExpense('${expense.id}') > Delete Expense</button>
       <button class="btn btn-primary" onclick=editExpense('${expense.amount}','${expense.description}','${expense.category}','${expense.id}')> Edit Expense</button>
       </li>`;
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

//Edit Expense
function editExpense(amount, description, category, expenseid) {
   document.getElementById("amount").value = amount;
   document.getElementById("description").value = description;
   document.getElementById("category").value = category;
   deleteExpense(expenseid);
}

// delete Expense
function deleteExpense(expenseid) {
   axios.delete(`http://localhost:3000/expense/delete-expense/${expenseid}`)
  //axios.delete(`http://localhost:3000/delete-expense/${expenseid}`)
   .then((response) => {
   removeExpenseFromScreen(expenseid);
 })
 .catch((err) => console.log(err));
}

function removeExpenseFromScreen(expenseid) {

   const parentNode = document.getElementById("listOfExpense");
   const childNodeToBeDeleted = document.getElementById(expenseid);
   if (childNodeToBeDeleted) {
    parentNode.removeChild(childNodeToBeDeleted);
  }
}
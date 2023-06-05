const Expense = require('../models/expenses');

const addexpense = (req, res) => {
    const { expenseamount, description, category } = req.body;

    if(expenseamount == undefined || expenseamount.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    
    Expense.create({ expenseamount, description, category}).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(500).json({success : false, error: err})
    })
}

const getexpenses = (req, res)=> {
    
    Expense.findAll().then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

const deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    if(expenseid == undefined || expenseid.length === 0){
        return res.status(400).json({success: false })
    }
    Expense.destroy({where: { id: expenseid }}).then(() => {
        return res.status(200).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: true, message: "Failed"})
    })
}

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}

// const Expense = require('../models/expenses');

// exports.addExpense = async (req, res, next) => {
//   try {
//     const amount = req.body.amount;
//     const description = req.body.description;
//     const category = req.body.category;
    
//     console.log(amount);

//     const data = await Expense.create({
//       amount: amount,
//       description: description,
//       category: category
//     });

//     res.status(201).json({ newExpense: data });
//   } catch (err) {
//     res.status(500).json({
//       error: err
//     });
//   }
// };

// exports.getExpenses = async (req, res, next) => {
//   try {
//     const expenses = await Expense.findAll();
//     console.log(expenses);
//     res.status(200).json({ allExpenses: expenses });
//   } catch (error) {
//     console.log('Get expenses is failing', JSON.stringify(error));
//     res.status(500).json({ error: error });
//   }
// };

// exports.deleteExpense = async (req, res) => {
//   const expenseId = req.params.expenseid;
//   try {
//     if (!expenseId) {
//       console.log('ID is missing');
//       return res.status(400).json({ err: 'ID is missing' });
//     }
//     await Expense.destroy({ where: { id: expenseId } });
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

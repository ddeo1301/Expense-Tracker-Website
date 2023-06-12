const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');

const addexpense = async (req, res) => {
    const t = await sequelize.transaction();

    try{
        const { expenseamount, description, category } = req.body;

        if(expenseamount == undefined || expenseamount.length === 0 ){
           return res.status(400).json({success: false, message: 'Parameters missing'})
        }

        const expense = await Expense.create(
            {
              expenseamount, 
              description, 
              category, 
              userId: req.user.id
            }, 
            {transaction: t})
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);

        User.update({
            totalExpenses: totalExpense
        },{
            where: {id: req.user.id},
            //transaction: t
        },{
            transaction: t
        })

        await t.commit();
        res.status(200).json({expense: expense});    
    }catch(err) {
        await t.rollback();
        return res.status(500).json({success : false, error: err})
    }   
}

const getexpenses = (req, res)=> {
    Expense.findAll({where: {userId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}


const deleteexpense = async (req, res) => {
    try {
      if (req.params.expenseid === undefined) {
        console.log("ID is Missing");
        return res.status(400).json({ error: "ID is missing" });
      }
  
      const uId = req.params.expenseid;
      const t = await sequelize.transaction();
  
      try {
        const expensetobedeleted = await Expense.findAll({
          where: { id: uId, userId: req.user.id },
          transaction: t,
        });
  
        const totalExpense1 = Number(req.user.totalExpenses) - Number(expensetobedeleted[0].expenseamount);
  
        console.log(totalExpense1);
        req.user.totalExpenses = totalExpense1;
        await req.user.save({ transaction: t });
  
        const noOfRows = await Expense.destroy({
          where: { id: uId, userId: req.user.id },
          transaction: t,
        });
  
        if (noOfRows === 0) {
          await t.rollback();
          return res
            .status(404)
            .json({ success: false, message: "Expense Doesn't Belong To User" });
        }
  
        await t.commit();
        return res
          .status(200)
          .json({ success: true, message: "Deleted Successfully" });
      } catch (error) {
        await t.rollback();
        throw error;
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Failed" });
    }
  };
  

// const deleteexpense = (req, res) => {
//     const expenseid = req.params.expenseid;

//     if(expenseid == undefined || expenseid.length === 0){
//         return res.status(400).json({success: false })
//     }
    
//     Expense.destroy({where: { id: expenseid, userId: req.user.id }}).then((noofrows) => {
//         if(noofrows === 0){
//             return res.status(404).json({success: false, message: "Expense doesnot belongs to user"})
//         }
//         return res.status(200).json({ success: true, message: "Deleted Successfuly"})
//     }).catch(err => {
//         console.log(err);
//         return res.status(500).json({ success: true, message: "Failed"})
//     })
// }

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}


// const Expense = require('../models/expenses');

// const addexpense = (req, res) => {
//     const { expenseamount, description, category } = req.body;
//     req.user.createExpense({ expenseamount, description, category }).then(expense => {
//         return res.status(201).json({expense, success: true } );
//     }).catch(err => {
//         return res.status(403).json({success : false, error: err})
//     })
// }

// const getexpenses = (req, res)=> {

//     req.user.getExpenses().then(expenses => {
//         return res.status(200).json({expenses, success: true})
//     })
//     .catch(err => {
//         return res.status(402).json({ error: err, success: false})
//     })
// }

// const deleteexpense = (req, res) => {
//     const expenseid = req.params.expenseid;
//     Expense.destroy({where: { id: expenseid }}).then(() => {
//         return res.status(204).json({ success: true, message: "Deleted Successfuly"})
//     }).catch(err => {
//         console.log(err);
//         return res.status(403).json({ success: true, message: "Failed"})
//     })
// }

// module.exports = {
//     deleteexpense,
//     getexpenses,
//     addexpense
// }


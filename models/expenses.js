// const mongoose =  require('mongoose');
// const Schema = mongoose.Schema;

// const ExpenseSchema = new Schema({
//     expenseamount: {
//       type: Number,
//       required: true
//       }, 
//     description: {
//         type: String,
//         required: true
//       },
//     category: {
//         type: String,
//         required: true
//       },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// });

// module.exports = mongoose.model('Expense',ExpenseSchema);

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  expenseamount: Sequelize.INTEGER,
  description:  Sequelize.STRING,
  category: Sequelize.STRING,
});

module.exports = Expense;//
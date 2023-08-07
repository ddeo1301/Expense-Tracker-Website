// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     name:{
//         type: String,
//         required: true
//     },
//     email:{
//         type: String,
//         required: true
//     },
//     password:{
//         type: String,
//         required: true
//     },
//     isPremium: {
//         type: Boolean,
//         default: false
//     },
//     totalExpense:{
//         type: Number,
//         default: 0
//     },
//     orderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Order',
//     }
// });
// module.exports = mongoose.model('User',userSchema);

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', { // sequelize.define is used to define new model named 'user'. which
          // returns a sequelize model class that represent 'user' model.
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: Sequelize.STRING,
    email: {
       type:  Sequelize.STRING,
       allowNull: false,
       unique: true
    },

    password: Sequelize.STRING,
    ispremiumuser : Sequelize.BOOLEAN,

    totalExpenses: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})

module.exports = User;
//code sets up User model with attribute and establishes the mapping between the model and underlying database table
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const ForgotpasswordSchema = new Schema({
//     active: {
//         type: Boolean,
//         default: true
//     },
//     expiresby: {
//         type: Date,
//         default: Date.now,
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }    
// })

// module.exports = mongoose.model('forgotpassword',ForgotpasswordSchema);

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role
const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE    
})

module.exports = Forgotpassword;

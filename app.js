const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const dotenv = require('dotenv');

// get config vars
dotenv.config();

var cors = require('cors')//cross origin resource sharing. alg alg origin se jo request aa rhi use access de dena
const sequelize = require('./util/database');//sets up the connection to DB using sequelize, an ORM for Node.js
//object relational mapping(ORM) simplifies the interaction between object-oriented programming languages and 
//relational databases, providing a higher level of abstraction and productivity for developers. It helps 
//reduce the complexity of database operations, improves code maintainability, and enables database independence

const User = require('./models/users');
const Expense = require('./models/expenses');// imports and associates the models with their respective
const Order = require('./models/orders');// relationships using Sequelize associations.
const Forgotpassword = require('./models/forgotpassword');
const downloadFile = require('./models/downloadFile');

const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user');//imports various route modules that handle different API endpoints.
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const resetPasswordRoutes = require('./routes/resetpassword')
const downloadroutes = require('./routes/user')

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false })); //sets up the necessary middleware to parse incoming request
// bodies, including handling forms
app.use(express.json());  //this is for handling jsons payloads


app.use('/user', userRoutes);// routing for different API endpoints using app.use.
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

app.use((req, res) => {
    console.log('urlll', req.url);
    res.sendFile(path.join(__dirname, `ExpenseTrackerFrontend/${req.url}`))
})

User.hasMany(Expense);//one-to-many relationship between User and Expense where user can have multiple expenses
Expense.belongsTo(User);// expense belongs to single user and establishes foreign key relationship b/w user and 
//expense model, where user model is parent of expense model

User.hasMany(Order);
Expense.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync()// synchronizes the database models with the database using sequelize.sync() and starts the
// server on port 3000 using app.listen(3000).
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })




    
    
    
    
    
    
     
    
    
    
    
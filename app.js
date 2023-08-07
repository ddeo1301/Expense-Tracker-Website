const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const dotenv = require('dotenv');

// get config vars
dotenv.config();

var cors = require('cors')//cross origin resource sharing. alg alg origin se jo request aa rhi use access de dena
const sequelize = require('./util/database');

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

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })


// mongoose
// //.connect('mongodb+srv://divyanshudeo:Divyanshu97@cluster0.c0wlb9b.mongodb.net/?retryWrites=true&w=majority')
// .connect('mongodb+srv://divyanshudeo:Divyanshu97@expense.fstdpax.mongodb.net/?retryWrites=true&w=majority')
// .then(result => {
//   console.log('connected')
//   app.listen(3000)
// })
// .catch(err =>{
//   console.log(err);
// })

// mongoose.connect('mongodb+srv://divyanshudeo:Divyanshu97@cluster0.c0wlb9b.mongodb.net/?retryWrites=true&w=majority', {
//   useNewUrlParser: "true",
//   useUnifiedTopology: "true",
//   serverSelectionTimeoutMS: 5000,
// })
// mongoose.connection.on("error", err => {
//   console.log("err", err)
// })
// mongoose.connection.on("connected", (err, res) => {
//   console.log("mongoose is connected")
// })
// app.listen(3000,()=>{
//   console.log(`conected...`)
// })

// mongoose.connect("mongodb://localhost:27017/Cluster0", {
//   useNewUrlParser: "true",
//   useUnifiedTopology: "true"
// })
// mongoose.connection.on("error", err => {
//   console.log("connection error")
//   console.log("err", err)
// })
// mongoose.connection.on("connected", (err, res) => {
//   console.log("mongoose is connected")
// })


    
    
    
    
    
    
     
    
    
    
    
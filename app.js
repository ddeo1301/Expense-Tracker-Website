const path = require('path');

const express = require('express');
var cors = require('cors')
const sequelize = require('./util/database');
const User = require('./models/users');

const userRoutes = require('./routes/user')

const app = express();
const dotenv = require('dotenv');

// get config vars
dotenv.config();

app.use(cors());

// app.use(bodyParser.urlencoded());  ////this is for handling forms
app.use(express.json());  //this is for handling jsons

app.use('/user', userRoutes)

sequelize.sync()
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
const User = require('../models/users');
const bcrypt = require('bcrypt')

function isstringinvalid(string){
    if(string == undefined ||string.length === 0){
        return true
    } else {
        return false
    }
}

 const signup = async (req, res)=>{ // asynchronous function receiving req, res as parameters, that is likely
    // a route handler function in a server-side application
    try{
    const { name, email, password } = req.body; // destructing assignment used to extract name, email, password
    // properties from req.body which are expexted to sent the request body
    console.log('email', email)

    if(isstringinvalid(name) || isstringinvalid(email || isstringinvalid(password))){
        // if any of three is invalid, it returns a response with status 400(Bad Request) and JSON object 
        // containing an error message
        return res.status(400).json({err: "Bad parameters . Something is missing"})
      }
    const saltrounds = 10; // indicate number of saltround to use when hashing the password

    bcrypt.hash(password, saltrounds, async (err, hash) => { // bcrypt.hash is called to generate a hash of the
    // password using the provided salt rounds. it passes a callback function that takes err and hash as parameters
        console.log(err)
        await User.create({ name, email, password: hash }); // User.create function is use to create new user in
        // database. it uses name, email and 'hashed' password values. await keyword is used before User.create 
        // to wait for the asynchronous operation to complete before proceeding
        res.status(201).json({message: 'Successfuly create new user'})
      })
    }catch(err) {
            res.status(500).json(err);// internal server error
        }

}

// const generateAccessToken = (id, name, ispremiumuser) => {
//     return jwt.sign({ userId : id, name: name, ispremiumuser } ,'secretkey');
// }

const login = async (req, res) => { // login fn receives request and response as parameters indicating as 
    // route handler function in a server side application
    try{
    const { email, password } = req.body; // destructing assignment used to extract 'email' and 'password' from 
    // req.body. these properties are expected to sent in the request body

    if(isstringinvalid(email) || isstringinvalid(password)){ // if email or password is incorrect then it will 
    // return a response with a status 400(bad request) and JSON object containing a message and succeess 
    // properties indicating the failure    
        return res.status(400).json({message: 'EMail id or password is missing ', success: false})
    }

    console.log(password);
    const user  = await User.findAll({ where : { email }}) // User.findAll is called to find users with the provided
    // email. it is like ORM(object relational mapping) library like sequelize. await keyword is used to wait for
    // the asynchronous operation to complete and return the result

        if(user.length > 0){
            // compar the provided password with stores hash password using bcrypt.compare. It passes callback
            // function that takes an error(err) and result as parameter
           bcrypt.compare(password, user[0].password, (err, result) => {
           if(err){
            throw new Error('Something went wrong')
           }
            if(result === true){
                return res.status(200).json({success: true, message: "User logged in successfully"});// json object
            }
            else{
            return res.status(400).json({success: false, message: 'Password is incorrect'})
           }
        })
        } else {
            return res.status(404).json({success: false, message: 'User Doesnot exist'})
        }
    }catch(err){
        // return a status with status 500 (Internal Server Error) and a JSON object containing the error message
        res.status(500).json({message: err, success: false})
    }
}

module.exports = {
    signup,
    login
}

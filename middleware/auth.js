const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = (req, res, next) => {

    try {
        const token = req.header('Authorization');//extract token from request header.Token is provided in 'Authorization' header
        console.log(token);
        const user = jwt.verify(token, 'secretkey');//here token is varified where secret key used to sign JWT
        console.log('userID >>>> ', user.userId);
        
        User.findByPk(user.userId).then(user => {//to find user in database using retrieved userID
            req.user = user; //If user is found then user object is assigned to req.user, allowing the user 
            //information to be accessed in subsequent middleware/route handlers.
            next();// called to pass control to the next middleware/route handler.
        }).catch(err => { throw new Error(err)})

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: 'false'})
        
      }
}

module.exports = {
    authenticate//exported to be used where authentication is required. 
}
//this middleware ensures that only authenticated request with valid JWT can acceess the protected route
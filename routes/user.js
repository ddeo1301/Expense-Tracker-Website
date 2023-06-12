const express = require('express');
const userController = require('../controller/user'); // imports module

const router = express.Router(); // create new router object

router.post('/signup', userController.signup); // /signup is associated with UserController.signup
router.post('/login', userController.login);
// above two controller is called when a POST request is made to the corresponding endpoints

module.exports = router; // router object is exported as a module, makeing it available for use in other parts of the application
// code setsup routes for user signup and login endpoints


// const express = require('express');

// const userController = require('../controller/user');
// const expenseController = require('../controller/expense')
// const authenticatemiddleware = require('../middleware/auth');

// const router = express.Router();

// router.post('/signup', userController.signup);
// router.post('/login', userController.login)
// router.post('/addexpense', authenticatemiddleware.authenticate, expenseController.addexpense )
// router.get('/getexpenses', authenticatemiddleware.authenticate, expenseController.getexpenses )
// router.delete('/deleteexpense/:expenseid', authenticatemiddleware.authenticate, expenseController.deleteexpense)

// module.exports = router;



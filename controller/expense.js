const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3Service = require('../services/S3services');
const DownloadedFile = require('../models/downloadFile');

// here downloadexpensesis asynchronous function which appears to be route handler for downloading expenses
const downloadexpenses = async (req, res) => {
  console.log("hi");
  try {
    const expenses = await UserServices.getexpenses(req);//code is retrieving the expense and it fetch expenses by 'req' object
    console.log(expenses);
    const stringifiedexpenses = JSON.stringify(expenses);//JSON string representation of 'expense' object

    const userId = req.user.id;//userId is extracted from 'req.user.id'. 'req' object has 'user' property
    // conatining user imformation, and 'id' represents user ID. it is set up by authentication process which
    // allows access to authenticated user's imformation in route handler

    const filename = `Expense${userId}/${new Date()}.txt`;//store download file with unique name
    const fileUrl = await S3Service.uploadToS3(stringifiedexpenses, filename);//upload stringifiedexpenses to
    //S3 bucket. use to handle uploading process and return URL of uploaded file

    await DownloadedFile.create({//when upload is successful new entry DownloadedFile is created storing fileUrl and userId
      url: fileUrl,
      userId: req.user.id
    });
    
    // this response indicates that file was successfully uploaded and provides URL for downloading
    res.status(200).json({ fileUrl, success: true });// JSON response is sent with status of 200 and object 
    //containing 'fileURL' and 'succeess' property is set to true
  } catch (err) {
    console.log(err);
    return res.status(500).json({ fileUrl: '', success: false, error: err });
  }
};

//route handler for adding an expense and ensures that both expense creation and update of user's total expense
//are part of same transaction. if any error occurs during transaction  it is rolled back, preventing partial 
//updates and maintaining data integrity.
const addexpense = async (req, res) => {
  const t = await sequelize.transaction();//start new transaction to ensure that all database operation within
  //this fn are part of same transaction

  try {
    const { expenseamount, description, category } = req.body;//extracts from req.body

    if (expenseamount == undefined || expenseamount.length === 0) {
      //checks if the expenseamount is undefined or an empty string. If so, it returns a JSON response with a
      // status of 400 (Bad Request) and a message indicating that the parameters are missing.
      return res.status(400).json({ success: false, message: 'Parameters missing' });
    }

    const expense = await Expense.create(//create new expense record in DB. 
      {
        expenseamount,
        description,
        category,
        userId: req.user.id//userId property is set to req.user.id to associate expense with authenticated user.
      },
      { transaction: t }
    );

    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);

    await User.update(//update 'totalExpense' field of user with calculated totalExpense. 
      {
        totalExpenses: totalExpense
      },
      {
        where: { id: req.user.id },//uses the 'where' clause to update the specific user(req.user.id)
        transaction: t
      }
    );

    await t.commit();//used to commit the transaction applying all the DB changes made within the transaction
    res.status(200).json({ expense: expense });// JSON response with a status of 200 (OK) is sent, containing
    // the newly created expense object.
  } catch (err) {
    //If an error occurs during the try block, the await t.rollback() is called to roll back the transaction
    // and undo any changes made within the transaction.
    await t.rollback();
    // JSON response with a status of 500 (Internal Server Error) is sent, indicating that an error occurred
    // during the processing of the request.
    return res.status(500).json({ success: false, error: err });
  }
};

// Route handler for retrieving expenses. code retrieves expenses for the user, paginates the results,and sends 
//them as a response. It also includes information about the user's premium status and pagination details.
const getexpenses = async (req, res, next) => {
     try{
       const check = req.user.ispremiumuser//checks if the user is premium user or not
       
      //`req.query` represents the query parameters of the HTTP request URL. For example, in the URL
      // `http://example.com/?page=2`, `req.query` would be `{ page: '2' }`.retrieves the value of
      // the `page` parameter as a string. + operator change string to number
       const page = +req.query.page || 1//extracted from query parameter. if nt provided then 1 is default
       const pageSize =  +req.query.pageSize || 10
       let totalExpenses = await req.user.countExpenses();//count no of expense associated with user
       console.log(totalExpenses)
   
      // passing 'req' object and options object as parameter. this fn is responsible for retrieving expenses
       const data = await UserServices.getexpenses(req, {//based on provided options
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [['id', 'DESC']]
       })
       console.log(data)
   
      res.status(200).json({
          allExpense: data,//retrieved expenses data
          check,//ispremiumuser property indicating if the user is a premium user.
          currentPage: page,//current page number.
          hasNextPage: pageSize * page < totalExpenses,//boolean indicating if next page is there based on pageSize.
          nextPage: page + 1,
          hasPreviousPage: page > 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalExpenses / pageSize) 
       })
    }catch(err){
       console.log(err)
   }
}

//Route handler for deleting expense, update total expenses and provides appropriate responses based on outcome
const deleteexpense = async (req, res) => {//of the deletion process
  try {
    if (req.params.expenseid === undefined) {
      console.log("ID is Missing");//JSON response with a status of 400 (Bad Request) and an error message is
      return res.status(400).json({ error: "ID is missing" });// returned.
    }

    const uId = req.params.expenseid;//id of the expenses to be deleted
    const t = await sequelize.transaction();//start new transaction

    try {
      const expensetobedeleted = await Expense.findAll({//retrieves expense to be deleted
        where: { id: uId, userId: req.user.id },
        transaction: t,
      });
      
      //req.user.totalExpenses is updated with the calculated totalExpense1, and the 
      //changes are saved to the database within the transaction.
      const totalExpense1 = Number(req.user.totalExpenses) - Number(expensetobedeleted[0].expenseamount);

      console.log(totalExpense1);
      req.user.totalExpenses = totalExpense1;
      await req.user.save({ transaction: t });
      
      // Expense.destroy() method is called to delete the expense based on the provided id and userId
      // matching the uId and req.user.id, respectively. The transaction is specified as t.
      const noOfRows = await Expense.destroy({
        where: { id: uId, userId: req.user.id },
        transaction: t,
      });

      if (noOfRows === 0) {//the transaction is rolled back, and a JSON response with a status of 404 
        //(Not Found) and an error message indicating that the expense doesn't belong to the user is returned.
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

module.exports = {
  deleteexpense,
  getexpenses,
  addexpense,
  downloadexpenses,
};

const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3Service = require('../services/S3services');
const DownloadedFile = require('../models/downloadFile');

const downloadexpenses = async (req, res) => {
  console.log("hi");
  try {
    const expenses = await UserServices.getexpenses(req);
    console.log(expenses);
    const stringifiedexpenses = JSON.stringify(expenses);

    const userId = req.user.id;

    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await S3Service.uploadToS3(stringifiedexpenses, filename);

    await DownloadedFile.create({
      url: fileUrl,
      userId: req.user.id
    });

    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ fileUrl: '', success: false, error: err });
  }
};

const addexpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { expenseamount, description, category } = req.body;

    if (expenseamount == undefined || expenseamount.length === 0) {
      return res.status(400).json({ success: false, message: 'Parameters missing' });
    }

    const expense = await Expense.create(
      {
        expenseamount,
        description,
        category,
        userId: req.user.id
      },
      { transaction: t }
    );
    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);

    await User.update(
      {
        totalExpenses: totalExpense
      },
      {
        where: { id: req.user.id },
        transaction: t
      }
    );

    await t.commit();
    res.status(200).json({ expense: expense });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, error: err });
  }
};

const getexpenses = async (req, res, next) => {
     try{
       const check = req.user.ispremiumuser
       const page = +req.query.page || 1
       const pageSize =  +req.query.pageSize || 10
       let totalExpenses = await req.user.countExpenses();
       //let totalExpenses = await UserServices.countExpenses();
       console.log(totalExpenses)
   
       const data = await UserServices.getexpenses(req, {
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [['id', 'DESC']]
       })
       console.log(data)
   
      res.status(200).json({
          allExpense: data,
          check,
          currentPage: page,
          hasNextPage: pageSize * page < totalExpenses,
          nextPage: page + 1,
          hasPreviousPage: page > 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalExpenses / pageSize) 
       })
    }catch(err){
       console.log(err)
   }
}

// const getexpenses = (req, res)=> {

  //     req.user.getExpenses().then(expenses => {
  //         return res.status(200).json({expenses, success: true})
  //     })
  //     .catch(err => {
  //         return res.status(402).json({ error: err, success: false})
  //     })
  // }

const deleteexpense = async (req, res) => {
  try {
    if (req.params.expenseid === undefined) {
      console.log("ID is Missing");
      return res.status(400).json({ error: "ID is missing" });
    }

    const uId = req.params.expenseid;
    const t = await sequelize.transaction();

    try {
      const expensetobedeleted = await Expense.findAll({
        where: { id: uId, userId: req.user.id },
        transaction: t,
      });

      const totalExpense1 = Number(req.user.totalExpenses) - Number(expensetobedeleted[0].expenseamount);

      console.log(totalExpense1);
      req.user.totalExpenses = totalExpense1;
      await req.user.save({ transaction: t });

      const noOfRows = await Expense.destroy({
        where: { id: uId, userId: req.user.id },
        transaction: t,
      });

      if (noOfRows === 0) {
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

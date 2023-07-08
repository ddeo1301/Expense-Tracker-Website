//calls getExpenses method on req.user to retrieve expenses associated with authenticated user. 
const getexpenses = (req, where)=>{
    return req.user.getExpenses(where);
}

const countExpenses = (user,where)=>{
    return user.countExpenses(where);
}

module.exports = {
    getexpenses,
    countExpenses
}
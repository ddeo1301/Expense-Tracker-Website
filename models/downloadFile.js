// const mongoose=require('mongoose');
// const Schema=mongoose.Schema;

// const downloadSchema=new Schema({
//     url:{
//         type:String,
//         required:true
//     },
//     userId:{
//         type:Schema.Types.ObjectId,
//         ref:'User',
//         required:true
//     }
// })
// module.exports = mongoose.model('DownlodedFile',downloadSchema);

const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const DownloadedFile = sequelize.define('file',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    
   url:Sequelize.STRING

});

module.exports = DownloadedFile;
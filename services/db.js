//1 Import mongoose

const mongoose = require('mongoose');

//2 define connection string between mongoose and express

mongoose.connect('mongodb://127.0.0.1:27017/BankServer').then((data)=>{
    console.log("connection oky");
})

//3 create a model and schema for sharing data mongodb and express

const User=mongoose.model('User',{
    acno:Number,
    password:String,
    username:String,
    balance:Number,
    transaction:[]
})

//4 export the collection
    module.exports={
        User
    }
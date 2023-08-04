//import db.js

const { response } = require('express');
const db = require('./db')
const jwt =require('jsonwebtoken')


const register=(acno,password,username)=>{
console.log('Inside the register function');

//to  check acno in Mongodb

return db.User.findOne({acno}).then((response)=>{
   console.log(response);
   if(response){
    return{
        statusCode: 401,
        message:"Account Already Registered"
    }
   }
   else{
    // acno is not present in mongodb, then it register new account

    const newUser= new db.User({
        acno,password,username,balance:5000,transaction:[]
    })

    // Store new account in mongodb
    newUser.save()
    //send response as register success to client
    return{
        statusCode:200, 
        message:"Account registered successfully"
    }
   }
})
}

const login=(acno,password)=>{
    console.log('Inside the login function');
    
    //to  check acno in Mongodb
    
    return db.User.findOne({acno,password}).then((result)=>{
    //    console.log(response);
       if(result){
        //generate token
        const token=jwt.sign({loginAcno:acno},'superkey2023')

        //send response as login success to client
        return{
            statusCode: 200,
            message:"Login Successful",
            currentUser: result.username, //  Send Username to client
            token,
            currentAcno:acno
        }
       }
       else{
        // send response as login fail to connect
        return{
            statusCode:401, 
            message:"Not a valid data"
        }
       }
    })
    }

const getBalance=(acno)=>{
  // check account  number in mongodb
  return db.User.findOne({acno}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            balance: result.balance // send balance to client
        }
    }
    else{
        return{
            statusCode:400,
            message:"Invalid Account Number"
        }
    }
  })
}
    
const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
    //logic of Transfer
    // step:1  convert amount to number    // parseInt - A string to convert into a number or Converts a string to an integer.
        let amount=parseInt(amt)
    // step:2 To check fromAcno in mongodb 
    return db.User.findOne({acno: fromAcno,password: fromAcnoPswd}).then((debit)=>{
        if(debit){
            // to check toAcno in mongodb
            return db.User.findOne({acno:toAcno}).then((credit)=>{
                if(credit){
                    if(debit.balance>=amount){
                        debit.balance -=amount;
                        debit.transaction.push({
                            type: 'Debit',
                            amount,
                            fromAcno,
                            toAcno,
                        })
                        // save changes in mongodb
                        debit.save()

                        //update in toAcno
                        credit.balance+=amount
                        credit.transaction.push({
                            type: 'Credit',
                            amount,
                            fromAcno,
                            toAcno,
                        })
                        // save changes in mongodb
                        credit.save()

                        //send response to the client
                        return{
                            statusCode:200,
                            message:"Fund Transfer Successful."
                        }
                    }
                    else{
                        return{
                            statusCode:401,
                            message:"Insufficient Funds"
                        }
                    }
                }
                else{
                    return{
                        statusCode:401,
                        message: "Invalid Credit Details"
                    }
                }
            })
        }
        else{
            return{
                statusCode:401,
                message: "Invalid Debit Details" 
            }
        }
    })
}

const getTransactions=(acno)=>{
    //get all transactions from mongodb
    //check acno in mongodb
    return db.User.findOne({acno}).then((result)=>{
        if (result){
            return{
                statusCode:200,
                transaction:result.transaction
            }
        } else {
            return{
                statusCode:404,
            message :'Invalid Data'
            }
            
        }
    })

}

const deleteMyAccount=(acno)=>{
    //delete an account from mongodb
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:"Your Account Has Been Deleted"
        }
    })
}
module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    getTransactions,
    deleteMyAccount
}
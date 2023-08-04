//Create server using Express

// 1: Import express

const express = require('express');

//4: import cors

const cors =require('cors');

//import logic

const logic = require('./services/logic')

//import jwt token
const jwt=require('jsonwebtoken')

//2: Create server using  express

const server =express()

//5: Using cors in server app

server.use(cors({
    origin:'http://localhost:4200'
}  
))

//6: To parse json  data to js in server app - use express.json()

server.use(express.json())

//3: setup port server app

server.listen(5000,()=>{
    console.log('sever listing on port 5000');
})


//7: To resolve client request in server

// server.get('/',(req,res)=>{
//     res.send('get')
// })


// Application specific middleware
    const appMiddleware=(req,res,next)=>{
        console.log('Application specific middleware');
        next();
    }
    server.use(appMiddleware)//function call

//Router specific middleware
        const jwtMiddleware=(req,res,next)=>{
    //middleware for verifying token to check user in logged in or not
    console.log('Router specific middleware');          
    //get the token from the request header
    const token = req.headers['verify-token']; // token
    console.log(token);
    try{
    //verify the token
     const data=jwt.verify(token,'superkey2023')
     console.log(data); // { loginAcno: '4561', iat: 1686404531 } this we seen in terminal
     req.currentAcno=data.loginAcno // to get the current Acno number
    next();
        }
        catch{
            res.status(401).json({message:"please Login......"})
        }
    }

// register - post

server.post('/register',(req,res)=>{
    console.log("Inside register api")
    console.log(req.body)

    // logic for register
    logic.register(req.body.acno,req.body.password,req.body.username).then((result)=>{
        res.status(result.statusCode).json(result)
    })


})

//login

server.post('/login',(req,res)=>{
    console.log("Inside login api")
    console.log(req.body)

    // logic for login
    logic.login(req.body.acno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })


})

//balance enquiry

server.get('/balance/:acno',jwtMiddleware,(req,res)=>{   // here we need to get the date so we use GET
    console.log('Inside the getbalance api'); // to check whether we get the data
    console.log(req.params);   // to get the data from URL we use params
    logic.getBalance(req.params.acno).then((result)=>{   // to call the function form logic
        res.status(result.statusCode).json(result)     // this we used for fetching the data to frontend
    })
})
//fund transfer

server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log("Inside the fund Transfer api");
    console.log(req.body);
    logic.fundTransfer(req.currentAcno, req.body.password, req.body.toAcno, req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//get transaction

server.get('/get-transaction', jwtMiddleware,(req,res)=>{
    console.log('Inside the get transaction api');
    logic.getTransactions(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
   
    })
})

//delete Account

server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log('Inside the delete a api');
    logic.deleteMyAccount(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
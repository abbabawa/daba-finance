import { Response, Request } from 'express';
import {ITransaction, Transaction} from '../models/transaction'; 

exports.makeTransfer= async(req:Request,res:Response,next:any)=>{
    const {username,email,password}=req.body;
    try {
        // const user:ITransaction= await Transaction.create({
        //     username
        //     ,email,
        //     password
        // });
        res.status(200).send({message: "got message"});
        //sendToken(user,201,res)
    } catch (error:any) {
        next(error);
    }
};

// import { Response, Request } from 'express';
import {ErrorResponse} from '../utils/errorResponse';
// import {IUser, User} from '../models/user';
exports.transactionHistory = async(req:Request,res:Response,next:any)=>{
    // const {email,password}=req.body;
    // if (!email || !password){
    //     return next(new ErrorResponse("Please provide a valid email and Password",400))
    // };
    try {return {message: "got message"}
        // const user:IUser | null = await User.findOne({email}).select("+password");
        // if (!user){
        //     return next(new ErrorResponse("Invalid Credentials",401))
        // }
        // const isMatch:boolean= await user.matchPassword(password);
        // if (!isMatch){
        //     return next(new ErrorResponse("Invalid Credentials",401))
        // }
        // res.status(200).send(user)
        //res.send({user,200,res})
    } catch (error:any) {
        return next(new ErrorResponse(error.message,500))
    }
}
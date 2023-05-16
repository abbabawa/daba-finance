import { Response, Request } from 'express';
import {IUser, User} from '../models/user'; 

exports.register= async(req:Request,res:Response,next:any)=>{
    const {username,email,password}=req.body;
    try {
        const user:IUser= await User.create({
            username
            ,email,
            password
        });
        res.status(200).send(user);
        //sendToken(user,201,res)
    } catch (error:any) {
        next(error);
    }
};

// import { Response, Request } from 'express';
import {ErrorResponse} from '../utils/errorResponse';
// import {IUser, User} from '../models/user';
exports.login = async(req:Request,res:Response,next:any)=>{
    const {email,password}=req.body;
    if (!email || !password){
        return next(new ErrorResponse("Please provide a valid email and Password",400))
    };
    try {
        const user:IUser | null = await User.findOne({email}).select("+password");
        if (!user){
            return next(new ErrorResponse("Invalid Credentials",401))
        }
        const isMatch:boolean= await user.matchPassword(password);
        if (!isMatch){
            return next(new ErrorResponse("Invalid Credentials",401))
        }
        res.status(200).send(user)
        //res.send({user,200,res})
    } catch (error:any) {
        return next(new ErrorResponse(error.message,500))
    }
}
import mongoose from "mongoose";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { model, Schema, Model, Document } from 'mongoose';

//declare user type
export interface IUser extends Document {
    getSignedToken():string;
    matchPassword(password: string): boolean | PromiseLike<boolean>;
    username:string;
    password:string;
    email:string;
    account_balance:number;
    active:boolean;
}
// define user schema
const UserSchema: Schema = new Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Can't be blank"],
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength:  [8, "Please use minimum of 8 characters"],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Can't be blank"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
        unique:true,
        index:true
    },
    account_balance: {
        type: Number
    },

    active: { type: Boolean, default: true }
});

UserSchema.pre<IUser>("save", async function (next: any) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bycrypt.genSalt(10);
    this.password = bycrypt.hashSync(this.password, 10);
    next();
});

UserSchema.methods.matchPassword= async function (password:string) {
    return await bycrypt.compare(password,this.password)   
}
UserSchema.methods.getSignedToken= function (password:string) {
    return jwt.sign({id:this._id},process.env.JWT_SECRET!,{
        expiresIn:process.env.JWT_EXPIRE
    })   
}


export const User:Model<IUser> = model("User", UserSchema);

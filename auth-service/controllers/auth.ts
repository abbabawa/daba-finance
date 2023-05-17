import { Response, Request } from "express";
import { IUser, User } from "../models/user";

const crypto = require('crypto');
var axios = require('axios');
const jwtSecret = process.env.JWT_SECRET, jwt = require('jsonwebtoken');

exports.register = async (req: Request, res: Response, next: any) => {
  const { username, email, password } = req.body;console.log( username, email, password);
  try {
    const user: IUser = await User.create({
      username,
      email,
      password,
    });
    let token = jwt.sign(req.body, jwtSecret, {expiresIn: "24h"});
    res.status(200).send(user);
    //sendToken(user,201,res)
  } catch (error: any) {
    next(error);
  }
};

// import { Response, Request } from 'express';
import { ErrorResponse } from "../utils/errorResponse";
// import {IUser, User} from '../models/user';
exports.login = async (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide a valid email and Password", 400)
    );
  }
  try {
    const user: IUser | null = await User.findOne({ email }).select(
      "+password"
    );
    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    const isMatch: boolean = await user.matchPassword(password);
    let token = jwt.sign({...user.toJSON()}, jwtSecret, {expiresIn: "24h"});
    let userData = {...user.toJSON(), token}
    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    res.status(200).send(userData);
    //res.send({user,200,res})
  } catch (error: any) {
    return next(new ErrorResponse(error.message, 500));
  }
};

exports.getUserByEmail = async (req: Request, res: Response, next: any) => {
  const { email } = req.params;
  if (!email) {
    return next(
      new ErrorResponse("Please provide a valid email", 400)
    );
  }
  try {
    const user: IUser | null = await User.findOne({ email }).select(
      "+password"
    );console.log(user)
    if (!user) {
      return res.status(404).send({message: "user not found", status: false});
    }
    
    res.status(200).send({data: user});
    //res.send({user,200,res})
  } catch (error: any) {
    return next(new ErrorResponse(error.message, 500));
  }
};

exports.verifyToken = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                res.header("Access-Control-Allow-Origin", "true");
                return res.status(401).send(
                    {
                        status: false,
                        message: "",
                        errors: ["Authorization header missing"]
                    }
                );
            } else {
                req.jwt = jwt.verify(authorization[1], jwtSecret);
                // return next();
                return res.status(401).send(
                    {
                        status: true,
                        message: "Token is valid",
                        errors: []
                    }
                );
            }

        } catch (err) {console.log(err, err.message)
            if(err.message === "jwt expired"){
                return res.status(403).send(
                    {
                        status: false,
                        type: "expired_token",
                        message: "Expired AccessToken",
                        errors: ["Internal server error"]
                    }
                );
            }
            return res.status(403).send(
                {
                    status: false,
                    message: "",
                    errors: ["Internal server error"]
                }
            );
        }
    } else {
        return res.status(401).send(
            {
                status: false,
                message: "Missing authorization header",
                errors: ["User not logged in"]
            }
        );
    }
};
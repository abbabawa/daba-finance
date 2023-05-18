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
    return res.status(200).send({status: true, data: user, message: "request successful"});
    //sendToken(user,201,res)
  } catch (error: any) {
    return res.status(500).send({status: false,  error: "Internal Server Error"});
  }
};

exports.login = async (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({status: false, error: "Please provide a valid email and Password"})
  }
  try {
    const user: IUser | null = await User.findOne({ email }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).send({status: false,  error: "Invalid Credentials"});
    }
    const isMatch: boolean = await user.matchPassword(password);
    let token = jwt.sign({...user.toJSON()}, jwtSecret, {expiresIn: "24h"});
    let userData = {...user.toJSON(), token}
    if (!isMatch) {
      return res.status(400).send({status: false, error: "Invalid credentials"})
    }
    res.status(200).send({status: true, data: userData, message: "Request was successful"});
  } catch (error: any) {
    res.status(500).send({status: false, error: "Internal server error"});
  }
};

exports.getUserByEmail = async (req: Request, res: Response, next: any) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).send({status: false,  error: "Please provide a valid email"});
  }
  try {
    const user: IUser | null = await User.findOne({ email }).select(
      "+password"
    );console.log(user)
    if (!user) {
      return res.status(404).send({error: "user not found", status: false});
    }
    
    return res.status(200).send({status: true, data: user, message: "Request successful"});
    
  } catch (error: any) {
    return res.status(400).send({status: false,  error: "Internal server error"});
  }
};

exports.verifyToken = (req, res, next) => {
    if (req.headers['authorization']) {
        try {console.log(req.headers['authorization'])
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
                let tokenValue = jwt.verify(authorization[1], jwtSecret);console.log(tokenValue, "token value");
                req.jwt = tokenValue;
                // return next();
                return res.status(401).send(
                    {
                        status: true,
                        message: "Token is valid",
                        data: tokenValue
                    }
                );
            }

        } catch (err) {console.log(err.message)
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
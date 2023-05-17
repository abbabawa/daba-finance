import { Response, Request } from "express";
import { ITransaction, Transaction } from "../models/transaction";

exports.makeTransfer = async (req: Request, res: Response, next: any) => {console.log(req.body, typeof req.body)
  const { sender, recipient, amount } = req.body;
  //TODO: check if user is logged in
  //TODO: check if user balance is sufficient
  try {
    const data = await fetch("http://localhost:5005/api/auth/user/" + recipient);
    if (!data.status) {
    }
    let user = await data.json();
    
    const transaction: ITransaction = await Transaction.create({
      sender: '6463d88c275d087e62ac5fd7',
      recipient: user?.data?._id,
      amount,
    });
    console.log(transaction);
    res
      .status(200)
      .send({ message: "Transaction created successfully", transaction });
    //sendToken(user,201,res)
  } catch (error: any) {
    next(error);
  }
};

// import { Response, Request } from 'express';
import { ErrorResponse } from "../utils/errorResponse";
// import {IUser, User} from '../models/user';
exports.transactionHistory = async (req: Request, res: Response, next: any) => {
  const {userId}=req.params;

  try {
    const transactions: ITransaction[] | null = await Transaction.find({
      $or: [
        { sender: { $eq: userId } },
        { recipient: { $eq: userId } },
      ],
    });

    res.status(200).send(transactions);
    //res.send({user,200,res})
  } catch (error: any) {
    return next(new ErrorResponse(error.message, 500));
  }
};

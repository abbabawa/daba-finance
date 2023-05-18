import { Response, Request } from "express";
import { ITransaction, Transaction } from "../models/transaction";

import { produceMessage } from "../kafka/producer";

const calculateAccountBalance = async (userId) => {
  const transactions = await Transaction.find({
    $or: [{ sender: { $eq: userId } }, { recipient: { $eq: userId } }],
  });

  let balance = 0;
  transactions.forEach((tx) => {
    //console.log(tx.amount, tx.sender.toString(), balance, typeof tx)
    if (tx.sender.toString() === userId) {
      balance -= tx.amount;
    } else if (tx.recipient.toString() === userId) {
      balance += tx.amount;
    }
  });
  return balance;
};

const isUserLoggedIn = async (token) => {
  const data = await fetch(
    "http://localhost:5005/api/auth/verify-token/",
    //   requestOptions
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "" + token,
      },
    }
  );
  let val = await data.json();
  // console.log(val, typeof val.status, "verify token");
  return val;
};

exports.makeTransfer = async (req: Request, res: Response, next: any) => {
  console.log(req.body, typeof req.body);
  const { recipient, amount } = req.body;
  let val = await isUserLoggedIn(req.headers.authorization);

  if (val.status == false) {
    return res
      .status(401)
      .send({
        status: false,
        error: "You must be logged in to be able to make transfers.",
      });
  }
  try {
    const data = await fetch(
      "http://localhost:5005/api/auth/user/" + recipient
    );
    if (!data.status) {
      return res
        .status(400)
        .send({
          status: false,
          error: "Invalid email: The email provided is invalid.",
        });
    }
    const balance = await calculateAccountBalance(val.data._id);
    // Check if user has sufficient balance in account
    if (balance < amount) {
      return res
        .status(400)
        .send({
          status: false,
          error:
            "Insufficient funds: You do not have sufficient funds to make this transfer.",
        });
    }
    let user = await data.json();

    const transaction: ITransaction = await Transaction.create({
      sender: val.data._id,
      recipient: user?.data?._id,
      amount,
    });
    console.log(transaction);
    produceMessage();
    return res
      .status(200)
      .send({ message: "Transaction created successfully", transaction });
    //sendToken(user,201,res)
  } catch (error: any) {
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

import { ErrorResponse } from "../utils/errorResponse";

exports.transactionHistory = async (req: Request, res: Response, next: any) => {

  try {
    //Check if user is logged in
    let val = await isUserLoggedIn(req.headers.authorization);

    if (val.status == false) {
      return res
        .status(401)
        .send({
          status: false,
          error: "You must be logged in to view your transaction history.",
        });
    }
    const transactions: ITransaction[] | null = await Transaction.find({
      $or: [{ sender: { $eq: val.data._id } }, { recipient: { $eq: val.data._id } }],
    });

    return res.status(200).send(transactions);
    //res.send({user,200,res})
  } catch (error: any) {
    return next(new ErrorResponse(error.message, 500));
  }
};

exports.getAccountBalance = async (req: Request, res: Response, next: any) => {
  const { userId } = req.params;

  //Check if user is logged in
  let val = await isUserLoggedIn(req.headers.authorization);

  if (val.status == false) {
    return res
      .status(401)
      .send({
        status: false,
        error: "You must be logged in to check your account balance.",
      });
  }

  try {
    const balance = await calculateAccountBalance(val.data._id);

    return res
      .status(200)
      .send({
        status: true,
        data: balance,
        message: "Balance retrieved successfully",
      });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .send({ status: false, message: "Internal server error" });
  }
};

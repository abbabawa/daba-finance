import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
  } from "type-graphql";
  import { User, RegisterUserInput, LoginInput, LoginResponse } from "../schemas/auth.schema";
  import express  from "express";
import { Transfer, TransferFundsInput, ViewTransactionsInput } from "../schemas/transfer.schema";
  // import fetch from 'node-fetch';
  
  @Resolver((of) => User)
  export default class {
    @Query((returns) => User, { nullable: true })
    async getUserByEmail(@Arg("email") email: string) {
  
      var requestOptions = {
        method: "GET",
      };
      const user = await fetch(
        "http://localhost:5005/api/auth/user/"+email,
        //   requestOptions
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      let data: any = await user.json();console.log(data)
      data = data.data
      return {
        username: data.username || "",
        email: data.email || "",
        accessToken: data.token || "",
        balance: 9000 || 0,
      };
    }
  
    @Mutation((returns) => Transfer)
    async makeTransfer(@Arg("input") input: TransferFundsInput) {
        
      var raw = JSON.stringify({
        ...input,
      });
      console.log(raw, "raw body");
  
      var requestOptions = {
        method: "POST",
  
        body: JSON.stringify({ ...input }),
        //   redirect: "follow",
      };
      const user = await fetch(
        "http://localhost:5001/api/transaction/transfer-funds",
        //   requestOptions
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: raw,
        }
      );console.log(user, "transaction response before")
      let data: any = await user.json();
      data = data.transaction; console.log(data, "transaction response")
      return {
        sender: data.sender || "",
        recipient: data.recipient || "",
        date: data.transaction_date || "",
        amount: data.amount || 0,
      };
    }
  
    @Query((returns) => [Transfer])
    async viewTransactions(@Arg("input") input: ViewTransactionsInput) {
      const user = await fetch(
        "http://localhost:5001/api/transaction/view/"+input.user,
        //   requestOptions
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      let data: any = await user.json();
      data = data.map((transaction:any)=>{
        return {
            sender: transaction.sender,
            recipient: transaction.recipient,
            amount: transaction.amount,
            date: transaction.transaction_date
        }
      })
      return data;
    }
  }
  
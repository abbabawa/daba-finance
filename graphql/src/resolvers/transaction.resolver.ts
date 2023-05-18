import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
  } from "type-graphql";
  import { User, RegisterUserInput, LoginInput, LoginResponse } from "../schemas/auth.schema";
  import express  from "express";
import { Balance, Transfer, TransferFundsInput, ViewTransactionsInput } from "../schemas/transfer.schema";
import { IncomingMessage } from "http";
  // import fetch from 'node-fetch';
  
  @Resolver((of) => User)
  export default class {
    @Query((returns) => User, { nullable: true })
    async getUserByEmail(@Arg("email") email: string, @Ctx() context: IncomingMessage) {
      const headers = context.headers;
      var requestOptions = {
        method: "GET",
      };
      const user = await fetch(
        "http://localhost:5005/api/auth/user/",
        //   requestOptions
        {
          method: "GET",
          headers: { "Content-Type": "application/json", "Authorization": ""+headers.authorization },
        }
      );
      let data: any = await user.json();
      if(!data.status){
        throw new Error(data.error)
      }
      data = data.data
      return {
        username: data.username || "",
        email: data.email || "",
        accessToken: data.token || "",
        balance: 9000 || 0,
      };
    }
  
    @Mutation((returns) => Transfer)
    async makeTransfer(@Arg("input") input: TransferFundsInput, @Ctx() context: IncomingMessage) {
      const headers = context.headers;
      var raw = JSON.stringify({
        ...input,
      });
  
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
          headers: { "Content-Type": "application/json", "Authorization": ""+headers.authorization },
          body: raw,
        }
      );
      let data: any = await user.json();
      if(data.status == false){
        throw new Error(data.error)
      }
      data = data.transaction; 
      return {
        sender: data.sender || "",
        recipient: data.recipient || "",
        date: data.transaction_date || "",
        amount: data.amount || 0,
      };
    }
  
    //TODO: populate user info
    @Query((returns) => [Transfer] || [])
    async viewTransactions(@Ctx() context: IncomingMessage) {
      const headers = context.headers;
      const user = await fetch(
        "http://localhost:5001/api/transaction/view/",
        //   requestOptions
        {
          method: "GET",
          headers: { "Content-Type": "application/json", "Authorization": ""+headers.authorization },
        }
      );
      let data: any = await user.json();
      if(data.status == false){
        throw new Error(data.error)
      }
      data = data.data
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

    @Query((returns) => Balance)
    async getAccountBalance( @Ctx() context: IncomingMessage) {
      const headers = context.headers;
      const user = await fetch(
        "http://localhost:5001/api/transaction/account-balance/",
        //   requestOptions
        {
          method: "GET",
          headers: { "Content-Type": "application/json", "Authorization": ""+headers.authorization},
        }
      );
      let data: any = await user.json();
      if(!data.status){
        throw new Error(data.error)
      }
      
      return {status: data.status, message: data.message, balance: {amount: data.data.balance}};
    }
  }
  
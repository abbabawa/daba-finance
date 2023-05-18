import {
  Arg,
  ArgumentValidationError,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { User, RegisterUserInput, LoginInput, LoginResponse } from "../schemas/auth.schema";
// import fetch from 'node-fetch';

@Resolver((of) => User)
export default class {
  @Query((returns) => User)
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
    if(!data.status){
      throw new ArgumentValidationError([data.error])
    }
    data = data.data
    return {
      username: data.username || "",
      email: data.email || "",
      accessToken: data.token || "",
      balance: 9000 || 0,
    };
  }

  @Mutation((returns) => User)
  async register(@Arg("input") input: RegisterUserInput) {
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
      "http://localhost:5005/api/auth/register",
      //   requestOptions
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      }
    );
    let data: any = await user.json();
    if(!data.status){
      throw new Error(data.error);
    }
    data = data.data;
    return {
      username: data.username || "",
      email: data.email || "",
      password: data.password || "",
      balance: 9000 || 0,
    };
  }

  @Mutation((returns) => LoginResponse)
  async login(@Arg("input") input: LoginInput) {
    var raw = JSON.stringify({
      ...input,
    });

    var requestOptions = {
      method: "POST",

      body: JSON.stringify({ ...input }),
      //   redirect: "follow",
    };
    const user = await fetch(
      "http://localhost:5005/api/auth/login",
      //   requestOptions
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      }
    );
    let data: any = await user.json();
    if(!data.status){
      throw new Error(data.error)
    }
    data = data.data;
    return {
      username: data.username || "",
      email: data.email || "",
      accessToken: data.token || "",
      balance: 9000 || 0,
    };
  }
}

import { Field, InputType, Int, ObjectType } from "type-graphql";
// import Task from "./task";

@ObjectType()
export class User {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => Number)
  balance: number;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  accessToken: string;

  @Field(() => Number)
  balance: number;
}

@InputType()
export class RegisterUserInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
